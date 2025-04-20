import { Order } from "~/types/order";
import formatCurrency from "~/utils/format-currency";

type OrderItemCardProps = {
  item: Order;
};

export default function OrderItemCard({ item }: OrderItemCardProps) {
  // const status = item.status === "pending" ? "Đang xử lý" : item.status === "completed" ? "Hoàn thành" : "Đã hủy";

  let status: { text: string; style: string };
  if (item.status === "pending") {
    status = { text: "Đang chờ xử lý", style: "bg-yellow-100 text-yellow-800" };
  } else if (item.status === "processing") {
    status = { text: "Đang xử lý", style: "bg-yellow-200 text-yellow-800" };
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
        <span
          className={`px-3 py-1 text-sm rounded-full ${status.style}`}
        >
          {status.text}
        </span>
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
        {item.orderItems.map((orderItem) => (
          <div key={orderItem.id} className="flex justify-between py-3">
            <div className="flex items-center gap-4">
              <img
                src={orderItem.product.imageUrl}
                alt={orderItem.product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="font-medium">{orderItem.product.name}</p>
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
