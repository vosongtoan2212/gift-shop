export interface IUser {
  id: number;
  email: string;
  fullname: string;
  profilePictureURL: string;
}
export interface ICategory {
  id: number;
  name: string;
}

export interface IBrand {
  id: number;
  name: string;
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  brandId: number;
  categoryId: number;
  imageUrl: number;
  category: ICategory;
  brand: IBrand;
  createdAt: Date;
  updatedAt: Date;
  averageRating: number;
  reviewCount: number;
}
export interface IOrder {
  id: number;
  totalAmount: number;
  status: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  createdAt: string;
  user: IUser;
  orderItems: IOrderItem[];
}

interface IOrderItem {
  id: number;
  quantity: number;
  price: number;
  product: IProduct;
}