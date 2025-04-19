"use client";
import React, { useEffect, useState } from "react";
import formatCurrency from "~/services/format-currency";
import { Cart } from "~/types/cart";

type TotalPriceProps = {
  cartList: Cart[];
};

export default function TotalPrice({ cartList }: TotalPriceProps) {
  const [totalPrice, setTotalPrice] = useState("Loading...");

  useEffect(() => {
    const total = formatCurrency(calculateTotalPrice(cartList));
    setTotalPrice(total);
  }, [cartList]);

  function calculateTotalPrice(cartItems: Cart[]): number {
    return cartItems.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);
  }

  return (
    <div className="space-y-4">
      <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
        <dt className="text-base font-bold text-gray-900">Tổng</dt>
        <dd className="text-base font-bold text-gray-900">{totalPrice}</dd>
      </dl>
    </div>
  );
}
