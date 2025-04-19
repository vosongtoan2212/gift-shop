import { ProductCard } from "~/components/product/ProductCard";
import { ProductListProps } from "~/types/product";

export function ProductList({ products }: ProductListProps) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
