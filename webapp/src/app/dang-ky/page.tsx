"use client";
import React, { useLayoutEffect, useState } from "react";
import { Button, Form, Input, Alert, notification } from "antd";
import { redirect } from "next/navigation";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { useGlobalContext } from "~/context/GlobalContextProvider";
import { fetchData } from "~/utils/fetchData";
import { API_URL } from "~/constants";

type FieldType = {
  name?: string;
  email?: string;
  password?: string;
  re_password?: string;
};

type NotificationType = "success" | "info" | "warning" | "error";
type NotificationPlacment =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | undefined;

export default function Register() {
  const [isShowError, setIsShowError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState({
    empty_name: "Vui lòng nhập họ tên !",
    empty_email: "Vui lòng nhập email !",
    not_email: "Vui lòng nhập email hợp lệ !",
    empty_password: "Vui lòng nhập mật khẩu !",
    min_password: "Vui lòng nhập ít nhất 6 ký tự",
    empty_re_password: "Vui lòng nhập lại mật khẩu !",
    register_failed: "Đăng ký không thành công. Vui lòng thử lại !",
  });
  const { isLoggedIn } = useGlobalContext();
  const [api, contextHolder] = notification.useNotification();

  useLayoutEffect(() => {
    if (isLoggedIn) {
      redirect("/");
    }
  }, [isLoggedIn]);

  function onChange() {
    setIsShowError(false);
  }

  const openNotificationWithIcon = (
    type: NotificationType,
    message: string,
    description: string,
    placement: NotificationPlacment
  ) => {
    api[type]({ message, description, placement });
  };

  async function onFinish(values: FieldType): Promise<void> {
    setIsLoading(true);
    setIsShowError(false);

    const postData = JSON.stringify({
      fullname: values.name,
      email: values.email,
      password: values.password,
    });

    if (values.password === values.re_password) {
      const { res, data } = await fetchData(
        `${API_URL}/auth/register`,
        "POST",
        { "Content-Type": "application/json" },
        postData
      );

      if (res?.status === 201) {
        openNotificationWithIcon(
          "success",
          "Đăng ký",
          "Đăng ký thành công",
          "bottomRight"
        );
        setIsLoading(false);
      }
      switch (data?.message) {
        case "Email has been registered":
          const temp = errorMessage;
          setErrorMessage({
            ...temp,
            register_failed: "Email đã được đăng ký",
          });
          setIsLoading(false);
          setIsShowError(true);
          break;

        default:
          break;
      }
    } else {
      const temp = errorMessage;
      setErrorMessage({
        ...temp,
        register_failed: "Mật khẩu và mật khẩu nhập lại không khớp!",
      });
      setIsLoading(false);
      setIsShowError(true);
    }
  }

  return (
    <>
      {contextHolder}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <Title level={3} className="text-center">
              Đăng ký
            </Title>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 18 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onChange={onChange}
              autoComplete="on"
            >
              <Form.Item<FieldType>
                label="Họ tên"
                name="name"
                rules={[{ required: true, message: errorMessage.empty_name }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: errorMessage.empty_email,
                  },
                  {
                    type: "email",
                    message: errorMessage.not_email,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: errorMessage.empty_password },
                  { min: 6, message: errorMessage.min_password },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item<FieldType>
                label="Nhập lại mật khẩu"
                name="re_password"
                rules={[
                  { required: true, message: errorMessage.empty_re_password },
                  { min: 6, message: errorMessage.min_password },
                ]}
              >
                <Input.Password />
              </Form.Item>

              {isShowError && (
                <div className="mb-6">
                  <Alert
                    message={errorMessage.register_failed}
                    type="error"
                    showIcon
                  />
                </div>
              )}

              <Form.Item wrapperCol={{ span: 24 }} className="text-center">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
            <div className="flex justify-between text-primary">
              <Link href="/dang-nhap" className="hover:text-secondary">
                Đăng nhập
              </Link>
              <Link href="/forgot-password" className="hover:text-secondary">
                Quên mật khẩu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
