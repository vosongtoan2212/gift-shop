'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);

    const orderId = searchParams.get('orderId');
    const message = searchParams.get('message');

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push(`/don-hang/${orderId}`);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [orderId, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {/* Success Icon */}
                <div className="mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <svg
                            className="w-10 h-10 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Thanh toán thành công!
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    {message || 'Đơn hàng của bạn đã được thanh toán thành công'}
                </p>

                {/* Order Info */}
                {orderId && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600">Mã đơn hàng</p>
                        <p className="text-xl font-bold text-gray-900">#{orderId}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                    <Link
                        href={`/don-hang/${orderId}`}
                        className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        Xem chi tiết đơn hàng
                    </Link>

                    <Link
                        href="/"
                        className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Về trang chủ
                    </Link>
                </div>

                {/* Auto redirect */}
                <p className="text-sm text-gray-500 mt-6">
                    Tự động chuyển hướng sau {countdown} giây...
                </p>
            </div>
        </div>
    );
}