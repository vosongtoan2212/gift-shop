"use client";
import { useState } from "react";
import { List, Rate, Input, Button, Form, message, Avatar } from "antd";
import { fetchData } from "~/utils/fetchData";
import { API_URL } from "~/constants";
import { getCookie } from "cookies-next";
import { useGlobalContext } from "~/context/GlobalContextProvider";

const { TextArea } = Input;

interface Review {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
  user: {
    id: number;
    email: string;
    fullname: string;
    profilePictureURL: string;
  };
}

interface Props {
  reviewList: Review[];
  productId: number;
}

interface FieldType {
  content: string;
  rating: number;
}

export default function ReviewSection({ reviewList, productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>(reviewList);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useGlobalContext();

  const [form] = Form.useForm();
  const handleSubmit = async (values: FieldType) => {
    const path = `${API_URL}/review/create`;
    const method = "POST";

    const body = JSON.stringify({
      productId,
      content: values.content,
      rating: values.rating,
    });

    const headers = {
      "Content-Type": "application/json",
    };

    const accessToken = getCookie("accessToken");

    const { res, data } = await fetchData(
      path,
      method,
      headers,
      body,
      accessToken as string
    );
    console.log(res, data);
    if (!res?.ok) {
      message.error("Có lỗi xảy ra khi đánh giá sản phẩm");
    } else {
      message.success("Đánh giá sản phẩm thành công");
      setReviews((prevReviews) => [data, ...prevReviews]);
      form.resetFields();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Đánh giá sản phẩm</h3>

      {isLoggedIn && (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item<FieldType>
            name="rating"
            label="Đánh giá"
            rules={[{ required: true, message: "Vui lòng chọn sao" }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item<FieldType>
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Gửi đánh giá
            </Button>
          </Form.Item>
        </Form>
      )}

      {!isLoggedIn && (
        <p className="text-sm text-gray-500">Bạn cần đăng nhập để đánh giá.</p>
      )}

      <List
        dataSource={reviews}
        itemLayout="vertical"
        renderItem={(item) => (
          <List.Item key={item.id}>
            <div className="flex justify-between items-center">
              <div>
                <Avatar src={item.user.profilePictureURL}>
                  {item.user.fullname.charAt(0)}
                </Avatar>
                <span className="font-medium text-[#FA9BAB] ml-2">
                  {item.user.fullname}
                </span>
              </div>
              <Rate disabled value={item.rating} />
            </div>
            <div className="mt-1 text-gray-600">{item.content}</div>
            <div className="text-sm text-gray-400">
              {new Date(item.createdAt).toLocaleString()}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
