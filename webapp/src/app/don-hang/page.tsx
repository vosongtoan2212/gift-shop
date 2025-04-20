"use client";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import OrderList from "~/components/order/OrderList";
import DefaultLayout from "~/components/layout/DefaultLayout";
import { API_URL } from "~/constants";
import { useGlobalContext } from "~/context/GlobalContextProvider";
import { Order } from "~/types/order";
import { fetchData } from "~/utils/fetchData";

export default function OrderPage() {
  const { isLoggedIn } = useGlobalContext();
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    const accessToken = getCookie("accessToken") as string;
    const fetchOrder = async () => {
      try {
        const { data } = await fetchData(
          `${API_URL}/order`,
          "GET",
          {},
          "",
          accessToken
        );
        setOrderList(data);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn !== null) {
      fetchOrder();
    }
  }, [isLoggedIn]);

  if (isLoggedIn == null || loading) {
    return <DefaultLayout>Đang tải...</DefaultLayout>;
  }

  if (!isLoggedIn) {
    return <DefaultLayout>Bạn chưa đăng nhập...</DefaultLayout>;
  }

  return (
    <DefaultLayout>
      <section className="bg-white py-8 antialiased md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <OrderList orderList={orderList}></OrderList>
        </div>
      </section>
    </DefaultLayout>
  );
}
