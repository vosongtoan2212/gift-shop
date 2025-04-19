import { Product } from "~/types/product";

export interface Cart {
  id: number;
  quantity: number,
  product: Product
}