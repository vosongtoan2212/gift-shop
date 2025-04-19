import { Button, Empty } from "antd";

import { fetchData } from "~/utils/fetchData";
import { ProductList } from "~/components/product/ProductList";
import { API_URL } from "~/constants";
import { Category } from "~/types/category";
import DefaultLayout from "~/components/layout/DefaultLayout";
import Link from "next/link";

export default async function Home() {
  const { data: categoryList } = await fetchData(`${API_URL}/category`);

  // Lấy sản phẩm của mỗi danh mục
  const categoriesWithProducts = await Promise.all(
    categoryList.map(async (category: Category) => {
      const { data: products } = await fetchData(
        `${API_URL}/product/search?limit=8&categoryId=${category.id}`
      );

      return {
        category: category,
        products: products,
      };
    })
  );

  return (
    <DefaultLayout>
      <div className="">
        {categoriesWithProducts.map(({ category, products }) => (
          <div key={category.id} className="mb-4">
            <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
            {products.data.length > 0 ? (
              <div>
                <ProductList products={products.data} />
                <div className="flex justify-center mt-6">
                  <Link href={`/danh-muc/${category.id}`}>
                    <Button type="primary" size="large">
                      Xem thêm
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <Empty description="Chưa có sản phẩm"></Empty>
            )}
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
}
