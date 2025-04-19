import {
  GiftOutlined,
  MoneyCollectOutlined,
  RetweetOutlined,
  TruckOutlined,
} from "@ant-design/icons";

import StarRating from "~/components/product/StarRating";
import { API_URL } from "~/constants";
import { Product } from "~/types/product";
import { fetchData } from "~/utils/fetchData";
import AddToCart from "~/components/product/AddToCart";
import DefaultLayout from "~/components/layout/DefaultLayout";
import formatCurrency from "~/services/format-currency";
import ReviewSection from "~/components/product/ReviewSection";

type Props = {
  params: { slug: string };
};

export default async function ProductDetail({ params }: Props) {
  const { slug } = await params;

  const { data: product } = await fetchData(
    `${API_URL}/product/search?slug=${slug}`
  );
  const productData = product.data[0] as Product;

  const { data: reviewList } = await fetchData(`${API_URL}/review/${productData.id}`);

  return (
    <DefaultLayout>
      <section className="py-8 bg-white md:py-16 antialiased">
        <div className="px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-4">
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
              <img className="w-full" src={productData.imageUrl} alt="" />
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                {productData.name}
              </h1>
              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                  {formatCurrency(productData.price)}
                </p>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <StarRating
                      averageRating={productData.averageRating}
                    ></StarRating>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm ms-3">
                    {Number(productData.averageRating.toFixed(1))}
                  </span>
                  <p className="text-sm font-medium leading-none text-gray-900">
                    {productData.reviewCount} đánh giá
                  </p>
                </div>
              </div>

              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                <AddToCart productId={productData.id}></AddToCart>
              </div>

              <hr className="my-6 md:my-8 border-gray-200" />

              <p className="mb-6 text-gray-500">{productData.description}</p>

              <hr className="my-6 md:my-8 border-gray-200" />

              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <TruckOutlined
                    className="pr-4 text-3xl"
                    style={{ color: "#FA9BAB" }}
                  />
                  <p className="font-bold">
                    Giao hàng toàn quốc đơn hàng từ 99k
                  </p>
                </div>
                <div className="flex items-center">
                  <MoneyCollectOutlined
                    className="pr-4 text-3xl"
                    style={{ color: "#FA9BAB" }}
                  />
                  <p className="font-bold">COD nội thành Cần Thơ</p>
                </div>
                <div className="flex items-center">
                  <RetweetOutlined
                    className="pr-4 text-3xl"
                    style={{ color: "#FA9BAB" }}
                  />
                  <p className="font-bold">Đổi trả trong 24h </p>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <GiftOutlined
                  className="pr-4 text-3xl"
                  style={{ color: "#FA9BAB" }}
                />
                <p className="font-bold">
                  Hỗ trợ ship 20k cho đơn hàng từ 300k nội thành HN, HCM Hỗ trợ
                  <br></br>
                  ship 30k cho đơn hàng từ 500k các khu vực khác
                </p>
              </div>
            </div>
          </div>
        </div>
        <ReviewSection reviewList={reviewList} productId={productData.id}></ReviewSection>
      </section>
    </DefaultLayout>
  );
}
