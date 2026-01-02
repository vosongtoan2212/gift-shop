import Link from "next/link";
import { Order } from "~/types/order";
import { Button } from "antd";
import formatCurrency from "~/utils/format-currency";
// import PaymentMethodSelector from "../payment/PaymentMethodSelector";

type OrderItemCardProps = {
  item: Order;
  isCheckout?: boolean;
};

export default function OrderItemCard({ item, isCheckout = false }: OrderItemCardProps) {
  let status: { text: string; style: string };
  if (item.status === "pending") {
    status = { text: "Đang chờ xử lý", style: "bg-yellow-100 text-yellow-800" };
  } else if (item.status === "processing") {
    status = { text: "Đang xử lý", style: "bg-yellow-300 text-yellow-800" };
  } else if (item.status === "shipping") {
    status = { text: "Đang vận chuyển", style: "bg-blue-100 text-blue-800" };
  } else if (item.status === "completed") {
    status = { text: "Hoàn thành", style: "bg-green-100 text-green-800" };
  } else if (item.status === "cancelled") {
    status = { text: "Đã hủy", style: "bg-red-100 text-red-800" };
  } else {
    status = { text: "Không xác định", style: "bg-gray-100 text-gray-800" };
  }
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6 mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Đơn hàng #{item.id}</h2>
        <div>
          <div className={`px-3 py-1 mb-4 text-sm rounded-full ${status.style}`}>
            {status.text}
          </div>
          {item.status === "pending" && !isCheckout &&
            <Link href={`/thanh-toan/${item.id}`}>
              <Button type="primary">Thanh toán</Button>
            </Link>

          }{item.status !== "pending" && !isCheckout &&
            <div>Đã thanh toán</div>

          }
        </div>
      </div>

      {/* Order Info */}
      <div className="text-sm text-gray-600 mb-4">
        <p>
          <strong>Khách hàng:</strong> {item.fullName}
        </p>
        <p>
          <strong>Email:</strong> {item.email}
        </p>
        <p>
          <strong>SĐT:</strong> {item.phone}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {item.address}
        </p>
        {item.note && (
          <p>
            <strong>Ghi chú:</strong> {item.note}
          </p>
        )}
        <p>
          <strong>Ngày đặt:</strong> {new Date(item.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Product List */}
      <div className="divide-y divide-gray-200">
        {item.orderItems.map((orderItem, key) => (
          <div key={key} className="flex justify-between py-3">
            <div className="flex items-center gap-4">
              <img
                src={orderItem.product?.imageUrl as string}
                alt={orderItem.product?.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                {orderItem.product?.name ? (
                  <p className="font-medium">{orderItem.product?.name}</p>
                ) : (
                  <p className="font-medium text-red-500 italic">Sản phẩm đã bị xóa</p>
                )}
                <p className="text-sm text-gray-500">x{orderItem.quantity}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700">
                {formatCurrency(orderItem.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="text-right mt-4 font-semibold">
        Tổng tiền: {formatCurrency(item.totalAmount)}
      </div>
    </div>
  );
}
