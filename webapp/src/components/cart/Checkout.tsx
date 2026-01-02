"use client"
import { Button, Form, Input, notification } from "antd";
import { getCookie } from "cookies-next";
import { useRouter } from 'next/navigation';
import { API_URL } from "~/constants";
import { useGlobalContext } from "~/context/GlobalContextProvider";
import { Cart } from "~/types/cart";
import { fetchData } from "~/utils/fetchData";

interface OrderFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
}

type CheckoutProps = {
  cartListInState: Cart[];
  setCartListInState: React.Dispatch<React.SetStateAction<Cart[]>>;
}
type NotificationType = "success" | "info" | "warning" | "error";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "Vui lòng nhập ${label}!",
  types: {
    email: "Địa chỉ email không hợp lệ",
    number: "Địa chỉ email không hợp lệ",
  },
};

export default function Checkout({ cartListInState, setCartListInState }: CheckoutProps) {
  const { userInfo } = useGlobalContext();
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    description: string
  ) => {
    api[type]({
      message: "Đơn hàng",
      description,
      placement: "bottomRight",
    });
  };

  const onFinish = async (values: OrderFormValues) => {
    try {
      const accessToken = getCookie("accessToken");

      const { data: cartList } = await fetchData(
        `${API_URL}/cart`,
        "GET",
        {},
        "",
        accessToken as string
      );

      const orderItems = cartListInState.map((item: any) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));
      const bodyOrder = JSON.stringify({
        fullName: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        note: values.note,
        orderItems,
      });

      const { res, data } = await fetchData(
        `${API_URL}/order/create`,
        "POST",
        { "Content-Type": "application/json" },
        bodyOrder,
        accessToken as string
      );

      if (res?.ok) {
        openNotificationWithIcon("success", "Đặt hàng thành công");
        console.log(data)
        router.push(`/don-hang/${data.id}`);
        cartList.map((item: any) => {
          fetchData(
            `${API_URL}/cart/${item.id}`,
            "DELETE",
            {},
            "",
            accessToken as string
          );
        });
        setTimeout(() => {
          setCartListInState([]);
        }, 2000)
      }
    } catch (err) {
      console.error("Lỗi ngoài luồng:", err);
    }
  };
  return (
    <>
      {contextHolder}
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        validateMessages={validateMessages}
        initialValues={{
          name: userInfo?.fullname || "",
          email: userInfo?.email || "",
        }}
      >
        <Form.Item name={"name"} label="Họ tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name={"email"}
          label="Email"
          rules={[{ type: "email", required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true },
            {
              pattern: /^[0-9]{9,11}$/,
              message: "Số điện thoại không hợp lệ!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="note" label="Ghi chú" rules={[{ required: false }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Đặt hàng
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
