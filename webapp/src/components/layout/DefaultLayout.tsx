import React from "react";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between min-h-[100vh] text-primary">
      <Header />
      <main className="container mx-auto pt-18 px-4 sm:pt-32">{children}</main>
      <Footer />
    </div>
  );
}
