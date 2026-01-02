import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Tạo URL thanh toán VNPay (redirect)
   * POST /api/payment/vnpay/create
   */
  @Post('vnpay/create')
  async createVNPayPayment(
    @Body('orderId') orderId: number,
    @Body('bankCode') bankCode: string,
    @Req() req: Request,
  ) {
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const paymentUrl = await this.paymentService.createVNPayPayment(
      orderId,
      ipAddr as string,
      bankCode,
    );

    return {
      success: true,
      data: {
        paymentUrl,
      },
    };
  }

  /**
   * Tạo URL thanh toán VNPay QR Code
   * POST /api/payment/vnpay/qr
   */
  @Post('vnpay/qr')
  async createVNPayQRPayment(
    @Body('orderId') orderId: number,
    @Req() req: Request,
  ) {
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      '127.0.0.1';

    const paymentUrl = await this.paymentService.createVNPayQRPayment(
      orderId,
      ipAddr as string,
    );

    return {
      success: true,
      data: {
        paymentUrl,
      },
    };
  }

  /**
   * VNPay return URL (user quay lại từ VNPay)
   * GET /api/payment/vnpay/return?vnp_xxx=xxx
   */
  @Get('vnpay/return')
  async vnpayReturn(@Query() query: any, @Res() res: Response) {
    const result = await this.paymentService.handleVNPayReturn(query);

    // Redirect về frontend với kết quả
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (result.success) {
      res.redirect(
        `${frontendUrl}/payment/success?orderId=${result.orderId}&message=${encodeURIComponent(result.message)}`,
      );
    } else {
      res.redirect(
        `${frontendUrl}/payment/failure?message=${encodeURIComponent(result.message)}`,
      );
    }
  }

  /**
   * VNPay IPN (webhook từ VNPay)
   * GET /api/payment/vnpay/ipn?vnp_xxx=xxx
   */
  @Get('vnpay/ipn')
  async vnpayIPN(@Query() query: any, @Res() res: Response) {
    const result = await this.paymentService.handleVNPayIPN(query);
    console.log("result >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);

    return res.status(HttpStatus.OK).json(result);
  }

  /**
   * Kiểm tra trạng thái thanh toán
   * GET /api/payment/:orderId/status
   */
  @Get(':orderId/status')
  async getPaymentStatus(@Param('orderId') orderId: number) {
    const status = await this.paymentService.getPaymentStatus(orderId);
    return {
      success: true,
      data: status,
    };
  }
}
