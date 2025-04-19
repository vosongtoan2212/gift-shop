"use client";
import React from "react";
import { Button, Tooltip } from "antd";
import { API_URL } from "~/constants";
import { getCookie } from "cookies-next";
import { fetchData } from "~/utils/fetchData";
import { useGlobalContext } from "~/context/GlobalContextProvider";
export default function AddToCart({ productId }: { productId: number }) {
  const { isLoggedIn } = useGlobalContext();
  const addToCart = async (productId: number) => {
    const path = `${API_URL}/cart`;
    const method = "POST";
    const token = getCookie("accessToken");
    const body = JSON.stringify({ productId, quantity: 1 });
    const headers = { "Content-Type": "application/json" };
    const { errorMessage } = await fetchData(
      path,
      method,
      headers,
      body,
      token as string
    );

    if (errorMessage) {
      console.error("Error:", errorMessage);
    }
  };

  if (isLoggedIn) {
    return (
      <Button type="primary" onClick={() => addToCart(productId)}>
        Thêm vào giỏ hàng
      </Button>
    );
  } else {
    return (
      <Tooltip title={"Đăng nhập để thêm vào giỏ hàng"}>
        <Button type="primary" disabled>
          Thêm vào giỏ hàng
        </Button>
      </Tooltip>
    );
  }
}
