'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCookie } from 'cookies-next';

export default function AuthCallbackClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const userRaw = searchParams.get('user');

        if (!accessToken || !refreshToken || !userRaw) {
            router.replace('/login');
            return;
        }

        const user = JSON.parse(userRaw);

        setCookie('accessToken', accessToken, { maxAge: 15 * 60 });
        setCookie('refreshToken', refreshToken, { maxAge: 7 * 24 * 60 * 60 });
        setCookie('user', user, { maxAge: 7 * 24 * 60 * 60 });

        router.replace('/');
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
                <p className="mt-4">Đang xử lý đăng nhập...</p>
            </div>
        </div>
    );
}
