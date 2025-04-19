import { cookies } from "next/headers";
import { getCookie, setCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { API_URL, JWT_SECRET } from "~/constants";
import { fetchData } from "~/utils/fetchData";

interface JwtPayload {
  exp: number; // Hạn sử dụng của token (UNIX timestamp)
  [key: string]: unknown;
}

// Hàm gọi API để refresh access token
async function refreshAccessToken(refreshToken: string) {
  const path = `${API_URL}/auth/refresh`;
  const method = "POST";

  const headers = {
    "Content-Type": "application/json",
  };

  const { res, data } = await fetchData(
    path,
    method,
    headers,
    "",
    refreshToken
  );

  if (!res?.ok) {
    throw new Error("Failed to refresh token");
  }

  return data.accessToken;
}

export async function isLogin(): Promise<boolean> {
  const accessToken = await getCookie("accessToken", { cookies }); // Cookie access token
  const refreshToken = await getCookie("refreshToken", { cookies }); // Cookie refresh token

  if (!accessToken) {
    return false;
  }

  try {
    jwt.verify(accessToken as string, JWT_SECRET || "undefined") as JwtPayload;

    return true; // Token còn hạn và hợp lệ
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      if (!refreshToken) {
        return false;
      }

      const newAccessToken = await refreshAccessToken(refreshToken as string);
      await setCookie("accessToken", newAccessToken, { cookies });

      return true; // Token đã được làm mới
    }

    console.error(error);
    return false; // Token không hợp lệ hoặc lỗi khác
  }
}
