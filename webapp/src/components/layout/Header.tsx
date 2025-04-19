"use client";
import { useState } from "react";
import {
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Input, Menu, Spin } from "antd";
import Link from "next/link";
import { Category } from "~/types/category";
import { useGlobalContext } from "~/context/GlobalContextProvider";
import { deleteCookie } from "cookies-next";

const ActionMenu = () => {
  const { isLoggedIn, setIsLoggedIn } = useGlobalContext();
  // const isLoggedIn = true;

  const logout = () => {
    setIsLoggedIn(false);
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
  };
  if (isLoggedIn == null) {
    return <Spin />;
  }
  if (isLoggedIn) {
    return (
      <div className="flex gap-2">
        <Link href="/gio-hang">
          <Button
            className="text-xl"
            icon={<ShoppingCartOutlined />}
            variant="filled"
          ></Button>
        </Link>
        <Button type="primary" onClick={logout}>
          Đăng xuất
        </Button>
      </div>
    );
  } else {
    return (
      <div className="flex gap-2">
        <Link href="/register">
          <Button type="link">Đăng ký</Button>
        </Link>
        <Link href="/login">
          <Button type="primary" icon={<UserOutlined />}>
            Đăng nhập
          </Button>
        </Link>
      </div>
    );
  }
};

const Header = () => {
  const { categoryList } = useGlobalContext();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          MyShop
        </Link>

        {/* Search */}
        <div className="flex flex-1 mx-4">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            className="rounded-md"
          />
        </div>

        {/* Menu Desktop */}
        <div className="hidden sm:flex items-center gap-4">
          <ActionMenu></ActionMenu>
        </div>

        {/* Menu Mobile */}
        <div className="sm:hidden">
          <Button icon={<MenuOutlined />} onClick={() => setOpen(true)} />
        </div>
      </div>
      <div className="hidden sm:block container mx-auto">
        <Menu
          mode="horizontal"
          className="border-none"
          style={{ justifyContent: "flex-end" }}
          items={categoryList.map((category: Category) => ({
            key: category.id,
            label: (
              <Link href={`/danh-muc/${category.id}`}>{category.name}</Link>
            ),
          }))}
        />
      </div>

      {/* Drawer Mobile */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      >
        <Menu
          mode="vertical"
          className="border-none"
          style={{ justifyContent: "flex-end" }}
          items={categoryList.map((category: Category) => ({
            key: category.id,
            label: <Link href="#">{category.name}</Link>,
          }))}
        />
        <ActionMenu></ActionMenu>
      </Drawer>
    </header>
  );
};

export default Header;
