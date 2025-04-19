import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import React from "react";
import CartList from "~/components/cart/CartList";
import DefaultLayout from "~/components/layout/DefaultLayout";
import { API_URL } from "~/constants";
import { fetchData } from "~/utils/fetchData";

export default async function CartPage() {
  const accessToken = await getCookie("accessToken", { cookies });
  const { data: cartList } = await fetchData(
    `${API_URL}/cart`,
    "GET",
    {},
    "",
    accessToken as string
  );

  if (cartList.statusCode == 401) {
    return <DefaultLayout>Bạn chưa đăng nhập...</DefaultLayout>;
  }
  return (
    <DefaultLayout>
      <section className="bg-white py-8 antialiased md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Giỏ hàng
          </h2>
          <CartList cartList={cartList} accessToken={accessToken}></CartList>
        </div>
      </section>
    </DefaultLayout>
  );
}
