'use client';

import { getCookie } from 'cookies-next';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DefaultLayout from '~/components/layout/DefaultLayout';
import OrderItemCard from '~/components/order/OrderItemCard';
import PaymentMethodSelector from '~/components/payment/PaymentMethodSelector';
import { API_URL } from '~/constants';
import { useGlobalContext } from '~/context/GlobalContextProvider';
import { Order } from '~/types/order';
import { fetchData } from '~/utils/fetchData';

export default function CheckoutPage() {
    const { isLoggedIn } = useGlobalContext();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

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
                setLoading(false);
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
                <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div>
                        {order && (
                            <OrderItemCard item={order} isCheckout={true}></OrderItemCard>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div>
                        {loading ? (
                            <div>Đang tải...</div>
                        ) : order ? (
                            <PaymentMethodSelector
                                orderId={order.id}
                                totalAmount={order.totalAmount}
                                onPaymentInitiated={() => {
                                    console.log('Payment initiated');
                                }}
                            />
                        ) : (
                            <div>Không tìm thấy đơn hàng</div>
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
