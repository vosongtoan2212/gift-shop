import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Brand } from "~/types/brand";
import { Category } from "~/types/category";

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | StaticImport;
  createdAt: string;
  updatedAt: string;
  category: Category;
  brand: Brand;
  averageRating: number,
  reviewCount: number
}

export interface ProductCardProps {
  product: Product;
}

export interface ProductListProps {
  products: Product[];
}