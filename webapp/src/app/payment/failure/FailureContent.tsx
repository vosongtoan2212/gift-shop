'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function FailureContent() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {/* Error Icon */}
                <div className="mb-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <svg
                            className="w-10 h-10 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Thanh toán thất bại
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    {message || 'Đã có lỗi xảy ra trong quá trình thanh toán'}
                </p>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={() => window.history.back()}
                        className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        Thử lại
                    </button>

                    <Link
                        href="/"
                        className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}