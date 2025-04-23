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