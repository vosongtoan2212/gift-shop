"use client"
import Link from "next/link";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Category } from "~/types/category";
import { useGlobalContext } from "~/context/GlobalContextProvider";

const Footer = () => {
  const { categoryList } = useGlobalContext();
  return (
    <footer className="bg-[#FFB0BD] text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 p-4 my-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Về chúng tôi</h3>
          <p className="text-sm">
            Chuyên cung cấp quà tặng và phụ kiện cao cấp, tinh tế, sang trọng
            dành cho mọi dịp đặc biệt.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Danh mục</h3>
          <ul className="text-sm space-y-1">
            {categoryList.map((category: Category, key: number) => (
              <li key={key}>
                <Link href={`/danh-muc/${category.id}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Hỗ trợ khách hàng</h3>
          <ul className="text-sm space-y-1">
            <li>
              <Link href="/faq">Câu hỏi thường gặp</Link>
            </li>
            <li>
              <Link href="/contact">Liên hệ</Link>
            </li>
            <li>
              <Link href="/policy">Chính sách bảo mật</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Kết nối với chúng tôi</h3>
          <div className="flex gap-2">
            <Button shape="circle" icon={<UserOutlined />} />
            <Button shape="circle" icon={<UserOutlined />} />
            <Button shape="circle" icon={<UserOutlined />} />
          </div>
        </div>
      </div>
      <div className="text-center text-sm mt-4 border-t border-white pt-4">
        © 2025 MyShop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
