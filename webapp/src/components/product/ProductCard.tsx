"use client";
import Link from "next/link";
import React from "react";
import { ProductCardProps } from "~/types/product";
import StarRating from "~/components/product/StarRating";
import AddToCart from "~/components/product/AddToCart";
import formatCurrency from "~/utils/format-currency";

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
      <Link href={`/san-pham/${product.slug}`}>
        <div className="w-full h-[250px] overflow-hidden rounded-t-lg bg-white flex items-center justify-center">
          <img
            className="w-full h-full object-cover"
            src={product.imageUrl}
            alt={product.name}
          />
        </div>
      </Link>
      <div className="px-5 pb-5">
        <Link href={`san-pham/${product.slug}`}>
          <h5
            className="text-base my-2 font-semibold tracking-tight text-gray-900 line-clamp-1 overflow-hidden"
            title={product.name}
          >
            {product.name}
          </h5>
        </Link>
        <div className="flex items-center my-2">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <StarRating averageRating={product.averageRating}></StarRating>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm">
            {Number(product.averageRating.toFixed(1))}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {formatCurrency(product.price)}
          </span>
          <AddToCart productId={product.id}></AddToCart>
        </div>
      </div>
    </div>
  );
}
