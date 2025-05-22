# Dự án Cửa hàng Quà tặng

Dự án Cửa hàng Quà tặng là một ứng dụng thương mại điện tử đầy đủ tính năng, bao gồm một ứng dụng web phía người dùng (client), một bảng điều khiển quản trị (admin dashboard) và một API backend mạnh mẽ. Mục tiêu của dự án là cung cấp một nền tảng trực tuyến cho phép người dùng duyệt sản phẩm, mua sắm, và quản trị viên quản lý sản phẩm, đơn hàng, người dùng một cách hiệu quả.

## Mục lục

* [Tổng quan](#tổng-quan)
* [Tính năng](#tính-năng)
* [Công nghệ Sử dụng](#công-nghệ-sử-dụng)
* [Cấu trúc Dự án](#cấu-trúc-dự-án)
* [Cài đặt và Chạy](#cài-đặt-và-chạy)
    * [Backend (API)](#backend-api)
    * [Frontend (Webapp)](#frontend-webapp)
    * [Admin Dashboard](#admin-dashboard)
* [Biến môi trường](#biến-môi-trường)
* [Triển khai](#triển-khai)

## Tổng quan

Dự án được chia thành ba phần chính, mỗi phần được xây dựng với các công nghệ phù hợp nhất cho vai trò của nó:

  * **API (Backend):** Cung cấp các điểm cuối RESTful để quản lý dữ liệu sản phẩm, người dùng, đơn hàng, xác thực và các chức năng cốt lõi khác.
  * **Webapp (Frontend Người dùng):** Ứng dụng web hiển thị, đánh giá các sản phẩm, cho phép người dùng thêm vào giỏ hàng, đặt hàng, quản lý đơn hàng.
  * **Admin (Admin Dashboard):** Bảng điều khiển quản trị mạnh mẽ cho phép quản trị viên quản lý danh mục sản phẩm, sản phẩm, đơn hàng. Quản lý người dùng và xem báo cáo sẽ tiếp tục phát triển.

## Tính năng

**API (Backend):**

  * Quản lý xác thực và phân quyền (JWT).
  * Quản lý người dùng (đăng ký, đăng nhập, hồ sơ).
  * Quản lý sản phẩm (thêm, sửa, xóa, lấy thông tin sản phẩm).
  * Quản lý danh mục sản phẩm.
  * Quản lý đơn hàng và trạng thái đơn hàng.

**Webapp (Frontend Người dùng):**

  * Đăng nhập, đăng ký.
  * Hiển thị danh sách sản phẩm và chi tiết sản phẩm.
  * Đánh giá sản phẩm.
  * Chức năng tìm kiếm và lọc sản phẩm.
  * Thêm sản phẩm vào giỏ hàng.
  * Quản lý tài khoản người dùng và lịch sử đơn hàng.
  * Giao diện người dùng thân thiện, responsive.

**Admin (Admin Dashboard):**

  * Dashboard tổng quan về doanh số, đơn hàng, người dùng (sẽ phát triển).
  * Quản lý sản phẩm (CRUD).
  * Quản lý danh mục (CRUD).
  * Quản lý người dùng (Xem, chỉnh sửa, khóa) (sẽ phát triển).
  * Quản lý đơn hàng (Xem, cập nhật trạng thái).
  * Hệ thống phân trang và tìm kiếm.

## Công nghệ Sử dụng

**Backend (API):**

  * **Framework:** NestJS
  * **Ngôn ngữ:** TypeScript
  * **ORM:** TypeORM
  * **Cơ sở dữ liệu:** PostgreSQL hoặc MySQL (có thể cấu hình)
  * **Xác thực:** JWT (JSON Web Tokens)
  * **Validation:** Class Validator

**Frontend (Webapp):**

  * **Framework:** Next.js
  * **Ngôn ngữ:** TypeScript
  * **Styling:** Tailwind CSS
  * **Quản lý trạng thái:** React Context API (hoặc các phương pháp khác)
  * **Thư viện UI:** Ant Design

**Admin (Admin Dashboard):**

  * **Framework:** Angular
  * **Ngôn ngữ:** TypeScript, JavaScript
  * **Styling:** SCSS, Tailwind CSS
  * **Thư viện UI:** Angular Material

## Cấu trúc Dự án

Dự án được tổ chức thành ba thư mục cấp cao nhất:

```
.
├── admin/            # Ứng dụng quản trị Angular
├── api/              # API backend NestJS
└── webapp/           # Ứng dụng web người dùng Next.js
```

Mỗi thư mục chứa cấu trúc riêng biệt theo quy ước của framework tương ứng.

## Cài đặt và Chạy

Để chạy dự án này trên máy cục bộ của bạn, bạn cần thực hiện các bước sau cho từng phần:

### Backend (API)

1.  **Chuyển đến thư mục `api`:**
    ```bash
    cd api
    ```
2.  **Cài đặt các phụ thuộc:**
    ```bash
    npm install
    # hoặc yarn install
    ```
3.  **Thiết lập biến môi trường:**
    Tạo một file `.env` trong thư mục `api` và cấu hình các biến môi trường cần thiết (xem phần [Biến môi trường](#biến-môi-trường)).
4.  **Chạy ứng dụng:**
    ```bash
    npm run start:dev
    # hoặc yarn start:dev
    ```
    API sẽ chạy trên `http://localhost:3000` (mặc định) hoặc cổng được cấu hình trong `.env`.

### Frontend (Webapp)

1.  **Chuyển đến thư mục `webapp`:**
    ```bash
    cd webapp
    ```
2.  **Cài đặt các phụ thuộc:**
    ```bash
    npm install
    # hoặc yarn install
    ```
3.  **Thiết lập biến môi trường:**
    Tạo một file `.env.local` trong thư mục `webapp` và cấu hình các biến môi trường cần thiết (xem phần [Biến môi trường](#biến-môi-trường)).
4.  **Chạy ứng dụng:**
    ```bash
    npm run dev
    # hoặc yarn dev
    ```
    Ứng dụng web sẽ chạy trên `http://localhost:3001` (mặc định) hoặc cổng được cấu hình trong `.env.local`.

### Admin Dashboard

1.  **Chuyển đến thư mục `admin`:**
    ```bash
    cd admin
    ```
2.  **Cài đặt các phụ thuộc:**
    ```bash
    npm install
    # hoặc yarn install
    ```
3.  **Thiết lập biến môi trường:**
    Cấu hình URL của API backend trong môi trường Angular (thường là trong `src/environments/environment.ts` và `src/environments/environment.prod.ts`).
4.  **Chạy ứng dụng:**
    ```bash
    ng serve
    ```
    Admin dashboard sẽ chạy trên `http://localhost:4200` (mặc định).

## Biến môi trường

### Backend (`api/.env`)

  * `DATABASE_URL`: Chuỗi kết nối đến cơ sở dữ liệu PostgreSQL hoặc MySQL.
  * `JWT_SECRET`: Khóa bí mật cho JWT.
  * `PORT`: Cổng mà API sẽ lắng nghe (mặc định là 3000).

### Frontend (`webapp/.env.local`)

  * `NEXT_PUBLIC_API_URL`: URL của API backend (ví dụ: `http://localhost:3000/api`).

### Admin (`admin/src/environments/environment.ts`)

  * `apiUrl`: URL của API backend (ví dụ: `http://localhost:3000/api`).

## Triển khai

Mỗi phần của dự án có thể được triển khai độc lập.
Hiện tại đã triển khai lên Vercel
  * **Backend (API):** https://gift-shop-api-dun.vercel.app/
  * **Webapp (Frontend):** https://gift-shop-webapp.vercel.app/
  * **Admin (Angular):** https://gift-shop-admin.vercel.app/

Tham khảo tài liệu của từng framework/nền tảng để biết chi tiết.
