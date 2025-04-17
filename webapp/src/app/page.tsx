import { fetchData } from "~/utils/fetchData";
import { ProductList } from "~/components/product/ProductList";
import { API_URL } from "~/constants";
import { Category } from "~/types/category";
import DefaultLayout from "~/components/layout/DefaultLayout";

export default async function Home() {
  const { data: categoryList } = await fetchData(`${API_URL}/category`);

  // Lấy sản phẩm của mỗi danh mục
  const categoriesWithProducts = await Promise.all(
    categoryList.map(async (category: Category) => {
      const { data: products } = await fetchData(
        `${API_URL}/product/search?categoryId=${category.id}`
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
              <ProductList products={products.data} />
            ) : (
              <p>Chưa có sản phẩm</p>
            )}
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
}
