"use client";
import React from "react";
import { Button, notification, Tooltip } from "antd";
import { API_URL } from "~/constants";
import { getCookie } from "cookies-next";
import { fetchData } from "~/utils/fetchData";
import { useGlobalContext } from "~/context/GlobalContextProvider";

type NotificationType = "success" | "info" | "warning" | "error";

export default function AddToCart({ productId }: { productId: number }) {
  const { isLoggedIn } = useGlobalContext();
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    description: string
  ) => {
    api[type]({
      message: "Giỏ hàng",
      description,
      placement: "bottomRight",
    });
  };

  const addToCart = async (productId: number) => {
    const path = `${API_URL}/cart`;
    const method = "POST";
    const token = getCookie("accessToken");
    const body = JSON.stringify({ productId, quantity: 1 });
    const headers = { "Content-Type": "application/json" };
    const { res } = await fetchData(
      path,
      method,
      headers,
      body,
      token as string
    );

    if (res?.ok) {
      openNotificationWithIcon("success", "Sản phẩm đã được thêm vào giỏ hàng");
    } else {
      openNotificationWithIcon("error", "Đã có lỗi xảy ra");
    }
  };

  if (isLoggedIn) {
    return (
      <>
        {contextHolder}
        <Button type="primary" onClick={() => addToCart(productId)}>
          Thêm vào giỏ hàng
        </Button>
      </>
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
