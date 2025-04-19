import React from "react";
import { Button, Empty } from "antd";

import DefaultLayout from "~/components/layout/DefaultLayout";
import { ProductList } from "~/components/product/ProductList";
import { API_URL } from "~/constants";
import { fetchData } from "~/utils/fetchData";
import Link from "next/link";
import PaginationCustom from "~/components/common/PaginationCustom";
type Props = {
  params: { id: string };
  searchParams: { page: number, pageSize: number };
};
export default async function Category({ params, searchParams }: Props) {
  const { id } = await params;
  const searchParamsValue = await searchParams;
  const page = searchParamsValue.page || 1;
  const pageSize = searchParamsValue.pageSize || 10;
  const { data: category } = await fetchData(`${API_URL}/category/${id}`);

  const { data: productOfCategory } = await fetchData(
    `${API_URL}/product/search?page=${page}&categoryId=${id}&limit=${pageSize}`
  );

  return (
    <DefaultLayout>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
        {productOfCategory.data.length > 0 ? (
          <div>
            <ProductList products={productOfCategory.data} />
            <PaginationCustom
              totalItems={productOfCategory.total}
              currentPage={page}
              pageSize={productOfCategory.limit}
            ></PaginationCustom>
          </div>
        ) : (
          <div className="mt-12">
            <Empty description="Danh mục chưa có sản phẩm">
              <Link href="/">
                <Button type="primary">Quay lại trang chủ</Button>
              </Link>
            </Empty>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
