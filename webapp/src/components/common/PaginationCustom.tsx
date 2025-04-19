"use client";
import { ConfigProvider, Pagination } from "antd";
import { useRouter } from 'next-nprogress-bar';

type PaginationProps = {
  totalItems: number;
  currentPage: number;
  pageSize: number | string | undefined;
};

export default function PaginationCustom(props: PaginationProps) {
  const { totalItems, currentPage, pageSize } = props;

  const router = useRouter();

  const onChangePage = (page: number, pageSize: number) => {
    const url = `?page=${page}&pageSize=${pageSize}`;
    router.push(url);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Pagination: {
            borderRadius: 50,
            itemBg: "#ffffff",
          },
        },
      }}
    >
      <div className="flex justify-center mt-8">
        <Pagination
          className="text-right"
          total={totalItems}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} của tổng ${total} sản phẩm`
          }
          defaultPageSize={Number(pageSize)}
          current={currentPage}
          showSizeChanger
          pageSizeOptions={[6, 12, 24]}
          onChange={(page, pageSize) => onChangePage(page, pageSize)}
        />
      </div>
    </ConfigProvider>
  );
}
