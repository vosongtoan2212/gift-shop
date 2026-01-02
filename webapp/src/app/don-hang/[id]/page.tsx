'use client';

import { getCookie } from 'cookies-next';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DefaultLayout from '~/components/layout/DefaultLayout';
import OrderItemCard from '~/components/order/OrderItemCard';
import { API_URL } from '~/constants';
import { useGlobalContext } from '~/context/GlobalContextProvider';
import { Order } from '~/types/order';
import { fetchData } from '~/utils/fetchData';

export default function OrderDetailPage() {
    const { isLoggedIn } = useGlobalContext();
    const [order, setOrder] = useState<Order | null>(null);

    const params = useParams();
    const orderId = params?.id as string;

    useEffect(() => {
        if (!isLoggedIn || !orderId) return;

        const accessToken = getCookie('accessToken') as string;

        const fetchOrder = async () => {
            try {
                const { data } = await fetchData(
                    `${API_URL}/order/${orderId}`,
                    'GET',
                    {},
                    '',
                    accessToken,
                );
                setOrder(data);
            } catch (err) {
                console.error('Lỗi khi lấy đơn hàng:', err);
            } finally {
            }
        };

        fetchOrder();
    }, [isLoggedIn, orderId]);

    useEffect(() => {
        if (order) {
            console.log('Order loaded:', order);
        }
    }, [order]);

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-8">
                <h2 className='text-2xl font-bold'>Chi tiết đơn hàng</h2>
                <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                    <div className="mx-auto w-full flex-none">
                        <div className="space-y-6">
                            {order ?
                                <OrderItemCard item={order}></OrderItemCard>
                                :
                                <div>Đang tải...</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
