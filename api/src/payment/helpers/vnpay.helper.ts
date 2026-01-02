import * as crypto from 'crypto';
import * as querystring from 'querystring';
import * as moment from 'moment';

export class VNPayHelper {
  /**
   * Tạo URL thanh toán VNPay
   */
  static createPaymentUrl(params: {
    vnpTmnCode: string;
    vnpHashSecret: string;
    vnpUrl: string;
    vnpReturnUrl: string;
    orderId: number;
    amount: number;
    orderInfo: string;
    bankCode?: string;
    ipAddr: string;
  }): string {
    const {
      vnpTmnCode,
      vnpHashSecret,
      vnpUrl,
      vnpReturnUrl,
      orderId,
      amount,
      orderInfo,
      bankCode,
      ipAddr,
    } = params;

    const createDate = moment().format('YYYYMMDDHHmmss');
    const txnRef = `${orderId}_${createDate}`; // Mã giao dịch unique

    let vnpParams: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpTmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPay yêu cầu nhân 100
      vnp_ReturnUrl: vnpReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnpParams.vnp_BankCode = bankCode;
    }

    // Sắp xếp params theo alphabet
    vnpParams = this.sortObject(vnpParams);

    // Tạo secure hash
    const signData = new URLSearchParams(vnpParams).toString();
    const hmac = crypto.createHmac('sha512', vnpHashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnpParams.vnp_SecureHash = signed;

    // Tạo URL
    const paymentUrl = vnpUrl + '?' + new URLSearchParams(vnpParams).toString();

    return paymentUrl;
  }

  /**
   * Tạo QR code payment URL
   */
  static createQRPaymentUrl(params: {
    vnpTmnCode: string;
    vnpHashSecret: string;
    vnpUrl: string;
    vnpReturnUrl: string;
    orderId: number;
    amount: number;
    orderInfo: string;
    ipAddr: string;
  }): string {
    return this.createPaymentUrl({
      ...params,
      bankCode: 'VNPAYQR', // QR Code
    });
  }

  /**
   * Verify IPN callback từ VNPay
   */
  static verifyReturnUrl(vnpParams: any, vnpHashSecret: string): boolean {
    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    const sortedParams = this.sortObject(vnpParams);
    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', vnpHashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return secureHash === signed;
  }

  /**
   * Kiểm tra response code từ VNPay
   */
  static getResponseMessage(responseCode: string): string {
    const messages: { [key: string]: string } = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
    };

    return messages[responseCode] || 'Lỗi không xác định';
  }

  /**
   * Sort object keys alphabetically
   */
  private static sortObject(obj: any): any {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
  }
}
