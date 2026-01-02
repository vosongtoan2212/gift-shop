import { API_URL } from "~/constants";

export interface CreatePaymentParams {
  orderId: number;
  bankCode?: string;
}

export interface PaymentStatusResponse {
  orderId: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  amount: number;
  paidAt?: string;
}

export const paymentAPI = {
  /**
   * Tạo payment VNPay (redirect)
   */
  async createVNPayPayment(params: CreatePaymentParams): Promise<string> {
    const response = await fetch(`${API_URL}/payment/vnpay/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Tạo thanh toán thất bại");
    }

    return data.data.paymentUrl;
  },

  /**
   * Tạo payment VNPay QR
   */
  async createVNPayQR(orderId: number): Promise<string> {
    const response = await fetch(`${API_URL}/payment/vnpay/qr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Tạo QR thanh toán thất bại");
    }

    return data.data.paymentUrl;
  },

  /**
   * Lấy trạng thái thanh toán
   */
  async getPaymentStatus(orderId: number): Promise<PaymentStatusResponse> {
    const response = await fetch(`${API_URL}/payment/${orderId}/status`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Lấy trạng thái thất bại");
    }

    return data.data;
  },
};
