"use client";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import CartList from "~/components/cart/CartList";
import DefaultLayout from "~/components/layout/DefaultLayout";
import { API_URL } from "~/constants";
import { useGlobalContext } from "~/context/GlobalContextProvider";
import { Cart } from "~/types/cart";
import { fetchData } from "~/utils/fetchData";

export default function CartPage() {
  const { isLoggedIn } = useGlobalContext();
  const [cartList, setCartList] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    const accessToken = getCookie("accessToken") as string;
    const fetchCart = async () => {
      try {
        const { data } = await fetchData(
          `${API_URL}/cart`,
          "GET",
          {},
          "",
          accessToken
        );
        setCartList(data);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn !== null) {
      fetchCart();
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
          <CartList cartList={cartList}></CartList>
        </div>
      </section>
    </DefaultLayout>
  );
}
