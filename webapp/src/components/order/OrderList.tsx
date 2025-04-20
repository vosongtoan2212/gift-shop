import React from "react";
import { Button, Empty } from "antd";

import OrderItemCard from "~/components/order/OrderItemCard";
import { Order } from "~/types/order";
import Link from "next/link";

interface OrderListProps {
  orderList: Order[];
}

export default function OrderList({ orderList }: OrderListProps) {
  if (!(orderList.length >= 1)) {
    return (
      <div className="mt-12">
        <Empty description="Chưa có đơn hàng">
          <div className="mb-4">
            <Link href="/">
              <Button type="primary">Bắt đầu mua sắm</Button>
            </Link>
          </div>
          <div>
            <Link href="/gio-hang">
              <Button type="primary">Xem giỏ hàng</Button>
            </Link>
          </div>
        </Empty>
      </div>
    );
  } else {
    return (
      <>
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Danh sách đơn hàng
        </h2>
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none">
            <div className="space-y-6">
              {orderList.map((item: Order) => (
                <OrderItemCard key={item.id} item={item}></OrderItemCard>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
}
