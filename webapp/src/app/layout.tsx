import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import "./globals.css";
import { GlobalContextProvider } from "~/context/GlobalContextProvider";
import ProgressBar from "~/components/common/ProgressBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mua sắm quà tặng và phục kiện",
  description: "Mua sắm quà tặng và phục kiện",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProgressBar />
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorText: "#393280",
                colorPrimary: "#FA9BAB",
              },
            }}
          >
            <GlobalContextProvider>{children}</GlobalContextProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
