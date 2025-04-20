"use client";
import React, { useState, useCallback } from "react";
import { getCookie } from "cookies-next";
import { Button, Empty } from "antd";

import { API_URL } from "~/constants";
import { Cart } from "~/types/cart";
import { fetchData } from "~/utils/fetchData";
import CartItemCard from "~/components/cart/CartItemCard";
import TotalPrice from "~/components/cart/TotalPrice";
import Link from "next/link";
import Checkout from "~/components/cart/Checkout";

type CartListProps = {
  cartList: Cart[];
};

export default function CartList({ cartList }: CartListProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [cartListInState, setCartListInState] = useState(cartList);
  const accessToken = getCookie("accessToken") as string;
  const removeItemCart = useCallback(
    async (id: number) => {
      try {
        setLoadingId(id);
        const { res } = await fetchData(
          `${API_URL}/cart/${id}`,
          "DELETE",
          {},
          "",
          accessToken
        );
        if (res?.ok) {
          setCartListInState((prevList) =>
            prevList.filter((item) => item.id !== id)
          );
        }
      } finally {
        setLoadingId(null);
      }
    },
    [accessToken]
  );

  const updateQuantity = useCallback(
    async (cartId: number, newQuantity: number) => {
      setLoadingId(cartId);
      try {
        if (newQuantity <= 0) {
          await removeItemCart(cartId);
        } else {
          const headers = { "Content-Type": "application/json" };
          const body = JSON.stringify({ quantity: newQuantity });
          const { res } = await fetchData(
            `${API_URL}/cart/${cartId}`,
            "PUT",
            headers,
            body,
            accessToken
          );
          if (res?.ok) {
            setCartListInState((prevList) =>
              prevList.map((item) =>
                item.id === cartId ? { ...item, quantity: newQuantity } : item
              )
            );
          }
        }
      } finally {
        setLoadingId(null);
      }
    },
    [accessToken, removeItemCart]
  );

  if (!(cartListInState.length >= 1)) {
    return (
      <div className="mt-12">
        <Empty description="Chưa có sản phẩm trong giỏ hàng">
          <div className="mb-4">
            <Link href="/">
              <Button type="primary">Bắt đầu mua sắm</Button>
            </Link>
          </div>
          <div>
            <Link href="/don-hang">
              <Button type="primary">Xem đơn hàng</Button>
            </Link>
          </div>
        </Empty>
      </div>
    );
  } else {
    return (
      <>
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Giỏ hàng
        </h2>
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-xl xl:max-w-2xl">
            <div className="space-y-6">
              {cartListInState.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onRemove={removeItemCart}
                  onUpdateQuantity={updateQuantity}
                  isRemoving={loadingId === item.id}
                />
              ))}
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <p className="text-xl font-semibold text-gray-900">
                Tổng thanh toán
              </p>
              <TotalPrice cartList={cartListInState}></TotalPrice>
            </div>
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <p className="text-xl font-semibold text-gray-900">Thanh toán</p>
              <Checkout
                cartListInState={cartListInState}
                setCartListInState={setCartListInState}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}
