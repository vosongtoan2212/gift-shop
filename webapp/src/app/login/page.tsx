"use client";
import React, { useLayoutEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Alert } from "antd";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { fetchData } from "~/utils/fetchData";
import { API_URL } from "~/constants";
import { setCookie } from "cookies-next";
import { useGlobalContext } from "~/context/GlobalContextProvider";

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

export default function Login() {
  const [isShowNotCorrectPassword, setIsShowNotCorrectPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isLoggedIn, setIsLoggedIn } = useGlobalContext();

  const router = useRouter();
  const searchParams = useSearchParams();
  const preLoginUrl = searchParams.get("preLoginUrl") || "/";

  const onLoginSuccess = () => {
    router.push(preLoginUrl);
  };

  const [errorMessage, setErrorMessage] = useState({
    empty_email: "Vui lòng nhập email !",
    not_email: "Vui lòng nhập email hợp lệ !",
    empty_password: "Vui lòng nhập mật khẩu !",
    login_failed: "Email hoặc mật khẩu không đúng.",
  });

  useLayoutEffect(() => {
    if (isLoggedIn) {
      redirect("/");
    }
  }, [isLoggedIn]);

  async function handleLogin(values: FieldType): Promise<void> {
    setIsLoading(true);
    setIsShowNotCorrectPassword(false);

    const path = `${API_URL}/auth/login`;
    const method = "POST";

    const body = JSON.stringify({
      email: values.email,
      password: values.password,
    });

    const headers = {
      "Content-Type": "application/json",
    };

    const { data } = await fetchData(path, method, headers, body);

    if (data.accessToken) {
      onLoginSuccess();
      setIsLoggedIn(true);

      if (values.remember) {
        setCookie("accessToken", data.accessToken, {
          maxAge: 15 * 60,
        });
        setCookie("refreshToken", data.refreshToken, {
          maxAge: 7 * 24 * 60 * 60,
        });
        setCookie("user", data.user, { maxAge: 7 * 24 * 60 * 60 });
      } else {
        setCookie("accessToken", data.accessToken);
        setCookie("refreshToken", data.refreshToken);
        setCookie("user", data.user);
      }
    } else {
      const temp = errorMessage;
      setErrorMessage({
        ...temp,
        login_failed: "Email hoặc mật khẩu không đúng.",
      });
      setIsLoading(false);
      setIsShowNotCorrectPassword(true);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <Title level={3} className="text-center">
            Đăng nhập
          </Title>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            autoComplete="on"
          >
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
              rules={[{ required: true, message: errorMessage.empty_password }]}
            >
              <Input.Password />
            </Form.Item>

            {isShowNotCorrectPassword && (
              <Alert
                message={errorMessage.login_failed}
                type="error"
                showIcon
              />
            )}

            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }} className="text-center">
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          <div className="flex justify-between text-primary">
            <Link href="/register" className="hover:text-secondary">
              Đăng ký
            </Link>
            <Link href="/forgot-password" className="hover:text-secondary">
              Quên mật khẩu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
