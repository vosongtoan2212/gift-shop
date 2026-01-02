import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { OrderEntity } from '~/entities/order.entity';
import {
  PaymentEntity,
  PaymentMethod,
  PaymentStatus,
} from '~/entities/payment.entity';
import { ProductEntity } from '~/entities/product.entity';
import { VNPayHelper } from './helpers/vnpay.helper';
import { OrderStatus } from '~/common/enums/order.enum';
// import { MailService } from '~/mail/mail.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private configService: ConfigService,
    private dataSource: DataSource,
    // private mailService: MailService,
  ) {}

  /**
   * Tạo URL thanh toán VNPay
   */
  async createVNPayPayment(
    orderId: number,
    ipAddr: string,
    bankCode?: string,
  ): Promise<string> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product', 'payment'],
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        'Đơn hàng không ở trạng thái chờ thanh toán',
      );
    }

    // Kiểm tra stock
    for (const item of order.orderItems) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Sản phẩm "${item.product.name}" không đủ số lượng trong kho`,
        );
      }
    }

    // Tạo hoặc cập nhật payment record
    let payment = order.payment;
    if (!payment) {
      payment = this.paymentRepository.create({
        order: order,
        method:
          bankCode === 'VNPAYQR' ? PaymentMethod.VNPAY_QR : PaymentMethod.VNPAY,
        status: PaymentStatus.PENDING,
        amount: order.totalAmount,
      });
      await this.paymentRepository.save(payment);
    }

    // Tạo payment URL
    const paymentUrl = VNPayHelper.createPaymentUrl({
      vnpTmnCode: this.configService.get('VNPAY_TMN_CODE'),
      vnpHashSecret: this.configService.get('VNPAY_HASH_SECRET'),
      vnpUrl: this.configService.get('VNPAY_URL'),
      vnpReturnUrl: this.configService.get('VNPAY_RETURN_URL'),
      orderId: order.id,
      amount: order.totalAmount,
      orderInfo: `Thanh toan don hang #${order.id}`,
      bankCode: bankCode,
      ipAddr: ipAddr,
    });

    return paymentUrl;
  }

  /**
   * Tạo QR Code payment URL
   */
  async createVNPayQRPayment(orderId: number, ipAddr: string): Promise<string> {
    return this.createVNPayPayment(orderId, ipAddr, 'VNPAYQR');
  }

  /**
   * Xử lý callback từ VNPay (IPN)
   */
  async handleVNPayReturn(vnpParams: any): Promise<{
    success: boolean;
    message: string;
    orderId?: number;
  }> {
    // Verify signature
    const isValid = VNPayHelper.verifyReturnUrl(
      vnpParams,
      this.configService.get('VNPAY_HASH_SECRET'),
    );

    if (!isValid) {
      return { success: false, message: 'Chữ ký không hợp lệ' };
    }

    const vnpTxnRef = vnpParams.vnp_TxnRef;
    const vnpResponseCode = vnpParams.vnp_ResponseCode;
    const vnpTransactionNo = vnpParams.vnp_TransactionNo;
    const vnpBankCode = vnpParams.vnp_BankCode;
    const vnpCardType = vnpParams.vnp_CardType;

    // Parse orderId từ txnRef
    const orderId = parseInt(vnpTxnRef.split('_')[0]);

    // Sử dụng transaction để đảm bảo data consistency
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(OrderEntity, {
        where: { id: orderId },
        relations: ['payment', 'orderItems', 'orderItems.product'],
      });

      if (!order) {
        await queryRunner.rollbackTransaction();
        return { success: false, message: 'Không tìm thấy đơn hàng' };
      }

      const payment = order.payment;

      // Cập nhật payment info
      payment.vnpTxnRef = vnpTxnRef;
      payment.vnpTransactionNo = vnpTransactionNo;
      payment.vnpBankCode = vnpBankCode;
      payment.vnpCardType = vnpCardType;
      payment.vnpResponseCode = vnpResponseCode;
      payment.vnpSecureHash = vnpParams.vnp_SecureHash;

      if (vnpResponseCode === '00') {
        // Thanh toán thành công
        payment.status = PaymentStatus.SUCCESS;
        payment.paidAt = new Date();
        order.status = OrderStatus.PROCESSING;

        // Trừ stock và tăng sold
        for (const item of order.orderItems) {
          const product = item.product;
          product.stock -= item.quantity;
          product.sold += item.quantity;

          if (product.stock < 0) {
            throw new BadRequestException(
              `Sản phẩm "${product.name}" không đủ số lượng`,
            );
          }

          await queryRunner.manager.save(product);
        }
      } else {
        // Thanh toán thất bại
        payment.status = PaymentStatus.FAILED;
      }

      await queryRunner.manager.save(payment);
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      return {
        success: vnpResponseCode === '00',
        message: VNPayHelper.getResponseMessage(vnpResponseCode),
        orderId: order.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error processing VNPay return:', error);
      return { success: false, message: 'Có lỗi xảy ra khi xử lý thanh toán' };
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Xử lý IPN từ VNPay
   */
  async handleVNPayIPN(
    vnpParams: any,
  ): Promise<{ RspCode: string; Message: string }> {
    // Verify signature
    const isValid = VNPayHelper.verifyReturnUrl(
      vnpParams,
      this.configService.get('VNPAY_HASH_SECRET'),
    );

    if (!isValid) {
      return { RspCode: '97', Message: 'Invalid Signature' };
    }

    const vnpTxnRef = vnpParams.vnp_TxnRef;
    const vnpResponseCode = vnpParams.vnp_ResponseCode;
    const vnpAmount = parseInt(vnpParams.vnp_Amount) / 100;

    // Parse orderId
    const orderId = parseInt(vnpTxnRef.split('_')[0]);

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['payment'],
    });

    if (!order) {
      return { RspCode: '01', Message: 'Order not found' };
    }

    if (order.totalAmount !== vnpAmount) {
      return { RspCode: '04', Message: 'Invalid Amount' };
    }

    const payment = order.payment;

    // Kiểm tra đã xử lý chưa
    if (payment.status === PaymentStatus.SUCCESS) {
      return { RspCode: '02', Message: 'Order already confirmed' };
    }

    if (vnpResponseCode === '00') {
      // Cập nhật trạng thái (logic tương tự handleVNPayReturn)
      await this.handleVNPayReturn(vnpParams);
      return { RspCode: '00', Message: 'Confirm Success' };
    } else {
      return { RspCode: '00', Message: 'Confirm Success' };
    }
  }

  /**
   * Lấy trạng thái thanh toán
   */
  async getPaymentStatus(orderId: number): Promise<{
    orderId: number;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    amount: number;
    paidAt?: Date;
  }> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['payment'],
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    return {
      orderId: order.id,
      orderStatus: order.status,
      paymentStatus: order.payment?.status || PaymentStatus.PENDING,
      paymentMethod: order.payment?.method || PaymentMethod.COD,
      amount: order.totalAmount,
      paidAt: order.payment?.paidAt,
    };
  }
}
