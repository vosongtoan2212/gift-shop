import QuantityControl from "~/components/cart/QuatityControl";
import { Button } from "antd";
import { Cart } from "~/types/cart";
import formatCurrency from "~/utils/format-currency";

type CartItemCardProps = {
  item: Cart;
  onRemove: (id: number) => void;
  onUpdateQuantity: (cartId: number, quantity: number) => void;
  isRemoving: boolean;
};

export default function CartItemCard({
  item,
  onRemove,
  onUpdateQuantity,
  isRemoving,
}: CartItemCardProps) {
  if (item.product === null) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
          <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
            <div className="flex justify-between">
              <p>Sản phẩm đã bị xóa</p>
              <div className="flex items-center gap-4">
                <Button
                  danger
                  onClick={() => onRemove(item.id)}
                  loading={isRemoving}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
          <div className="flex">
            {/* Image */}
            <div className="shrink-0 md:order-1 mr-8">
              <img
                className="h-20 w-20 object-cover"
                src={item.product.imageUrl as string}
                alt={item.product.name}
              />
            </div>

            {/* Info + Actions */}
            <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
              <p className="text-base font-medium text-gray-900">
                {item.product.name}
              </p>
              <div className="flex items-center gap-4">
                <Button
                  danger
                  onClick={() => onRemove(item.id)}
                  loading={isRemoving}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </div>

          {/* Quantity + Price */}
          <div className="flex items-center justify-between md:order-3 md:justify-end">
            <div className="flex items-center">
              <QuantityControl
                quantity={item.quantity}
                onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
                onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
              />
            </div>
            <div className="text-end md:order-4 md:w-32">
              <p className="text-base font-bold text-gray-900">
                {formatCurrency(item.product.price)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
