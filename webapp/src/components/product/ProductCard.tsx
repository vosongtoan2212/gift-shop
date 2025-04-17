"use client";
import Link from "next/link";
import React from "react";
import { Button } from "antd";
import { ProductCardProps } from "~/types/product";
import StarRating from "~/components/product/StarRating";
import { fetchData } from "~/utils/fetchData";
import { API_URL } from "~/constants";
import { getCookie } from "cookies-next";

export function ProductCard({ product }: ProductCardProps) {
  
  const addToCart = async (productId: number) => {
    const path = `${API_URL}/cart`;
    const method = "POST";
    const token = getCookie("accessToken"); // hoặc bỏ nếu không cần

    const body = JSON.stringify({
      productId,
      quantity: 1,
    });

    const headers = {
      "Content-Type": "application/json",
    };

    const { data, errorMessage } = await fetchData(
      path,
      method,
      headers,
      body,
      token as string,
    );

    if (errorMessage) {
      console.error("Error:", errorMessage);
    } else {
      console.log("Response:", data);
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <Link href="#">
        <img
          className="p-8 rounded-t-lg"
          src={product.imageUrl}
          alt={product.name}
        />
      </Link>
      <div className="px-5 pb-5">
        <Link href="#">
          <h5
            className="text-xl h-14 font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2 overflow-hidden"
            title={product.name}
          >
            {product.name}
          </h5>
        </Link>
        <div className="flex items-center mt-2.5 mb-5">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <StarRating averageRating={product.averageRating}></StarRating>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">
            {Number(product.averageRating.toFixed(1))}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {product.price} đ
          </span>
          <Button type="primary" onClick={() => addToCart(product.id)}>
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
