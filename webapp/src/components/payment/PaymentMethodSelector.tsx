'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Bank {
    code: string;
    name: string;
    logo?: string;
}

const POPULAR_BANKS: Bank[] = [
    { code: 'VNPAYQR', name: 'VNPay QR Code' },
    { code: 'VNBANK', name: 'Ngân hàng Việt Nam' },
    { code: 'INTCARD', name: 'Thẻ quốc tế' },
    { code: 'VIETCOMBANK', name: 'Vietcombank' },
    { code: 'TECHCOMBANK', name: 'Techcombank' },
    { code: 'MBBANK', name: 'MB Bank' },
    { code: 'VIETINBANK', name: 'VietinBank' },
    { code: 'BIDV', name: 'BIDV' },
    { code: 'AGRIBANK', name: 'Agribank' },
    { code: 'SACOMBANK', name: 'Sacombank' },
    { code: 'ACB', name: 'ACB' },
    { code: 'VPBANK', name: 'VPBank' },
    { code: 'NCB', name: 'NCB' },
];

interface PaymentMethodSelectorProps {
    orderId: number;
    totalAmount: number;
    onPaymentInitiated?: () => void;
}

export default function PaymentMethodSelector({
    orderId,
    totalAmount,
    onPaymentInitiated,
}: PaymentMethodSelectorProps) {
    const [selectedBank, setSelectedBank] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<'redirect' | 'qr'>('redirect');
    const [loading, setLoading] = useState(false);
    const [qrUrl, setQrUrl] = useState<string>('');

    const handlePayment = async () => {
        if (!selectedBank && paymentMethod === 'redirect') {
            alert('Vui lòng chọn ngân hàng');
            return;
        }

        setLoading(true);
        try {
            if (paymentMethod === 'redirect') {
                // Redirect payment
                const { paymentAPI } = await import('~/app/lib/api/payment');
                const paymentUrl = await paymentAPI.createVNPayPayment({
                    orderId,
                    bankCode: selectedBank,
                });

                onPaymentInitiated?.();
                window.location.href = paymentUrl;
            } else {
                // QR payment
                const { paymentAPI } = await import('~/app/lib/api/payment');
                const paymentUrl = await paymentAPI.createVNPayQR(orderId);
                setQrUrl(paymentUrl);
                onPaymentInitiated?.();
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert(error instanceof Error ? error.message : 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    if (qrUrl) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-center">
                    Quét mã QR để thanh toán
                </h3>
                <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                        <Image
                            src={qrUrl}
                            alt="QR Code"
                            width={300}
                            height={300}
                        />
                    </div>
                    <p className="mt-4 text-gray-600 text-center">
                        Sử dụng app ngân hàng để quét mã QR
                    </p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                        {formatCurrency(totalAmount)}
                    </p>
                    <button
                        onClick={() => setQrUrl('')}
                        className="mt-4 text-blue-600 hover:underline"
                    >
                        ← Quay lại chọn phương thức khác
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Chọn phương thức thanh toán</h3>

            {/* Payment Method Toggle */}
            <div className="mb-6">
                <div className="flex gap-4">
                    <button
                        onClick={() => setPaymentMethod('redirect')}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${paymentMethod === 'redirect'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                            }`}
                    >
                        <div className="font-semibold">Chuyển hướng</div>
                        <div className="text-sm text-gray-600">
                            Chuyển sang trang ngân hàng
                        </div>
                    </button>

                    <button
                        onClick={() => setPaymentMethod('qr')}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${paymentMethod === 'qr'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                            }`}
                    >
                        <div className="font-semibold">QR Code</div>
                        <div className="text-sm text-gray-600">Quét mã thanh toán</div>
                    </button>
                </div>
            </div>

            {/* Bank Selection (only for redirect) */}
            {paymentMethod === 'redirect' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Chọn ngân hàng
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {POPULAR_BANKS.map((bank) => (
                            <button
                                key={bank.code}
                                onClick={() => setSelectedBank(bank.code)}
                                className={`p-4 rounded-lg border-2 transition-all ${selectedBank === bank.code
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <div className="text-sm font-medium text-center">
                                    {bank.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Amount Display */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tổng thanh toán:</span>
                    <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(totalAmount)}
                    </span>
                </div>
            </div>

            {/* Payment Button */}
            <button
                onClick={handlePayment}
                disabled={loading || (paymentMethod === 'redirect' && !selectedBank)}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors ${loading || (paymentMethod === 'redirect' && !selectedBank)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Đang xử lý...
                    </span>
                ) : (
                    <>
                        {paymentMethod === 'redirect'
                            ? 'Thanh toán ngay'
                            : 'Tạo mã QR'}
                    </>
                )}
            </button>

            {/* Security Note */}
            <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Giao dịch được bảo mật bởi VNPay
            </p>
        </div>
    );
}