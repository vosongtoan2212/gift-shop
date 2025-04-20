"use client";
import { useState } from "react";
import {
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Input, Menu, Spin, Tooltip } from "antd";
import Link from "next/link";
import { Category } from "~/types/category";
import { useGlobalContext } from "~/context/GlobalContextProvider";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next-nprogress-bar";

const ActionMenu = () => {
  const { isLoggedIn, setIsLoggedIn } = useGlobalContext();

  const logout = () => {
    setIsLoggedIn(false);
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("user");
  };
  if (isLoggedIn == null) {
    return <Spin />;
  }
  if (isLoggedIn) {
    return (
      <div className="flex gap-2">
        <Link href="/gio-hang">
          <Tooltip title={"Giỏ hàng"}>
            <Button
              className="text-xl"
              icon={<ShoppingCartOutlined />}
              variant="filled"
            ></Button>
          </Tooltip>
        </Link>

        <Link href="/don-hang">
          <Tooltip title={"Đơn hàng"}>
            <Button
              className="text-xl"
              icon={<ShoppingOutlined />}
              variant="filled"
            ></Button>
          </Tooltip>
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

  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (trimmed) {
      router.push(`/tim-kiem/${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
            prefix={
              <SearchOutlined
                onClick={handleSearch}
                className="cursor-pointer"
              />
            }
            className="rounded-md"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
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
