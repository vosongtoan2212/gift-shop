import { Product } from "~/types/product";
import { User } from "~/types/user";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: number;
  totalAmount: number;
  status: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  createdAt: string;
  user: User;
  orderItems: OrderItem[];
}