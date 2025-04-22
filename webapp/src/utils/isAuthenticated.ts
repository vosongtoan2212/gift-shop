import { cookies } from "next/headers";
import { getCookie, setCookie } from "cookies-next";
import { API_URL } from "~/constants";
import { fetchData } from "~/utils/fetchData";

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

  return data;
}

export async function isLogin(): Promise<boolean | undefined> {
  const accessToken = await getCookie("accessToken", { cookies }); // Cookie access token
  const refreshToken = await getCookie("refreshToken", { cookies }); // Cookie refresh token

  if (!accessToken && !refreshToken) {
    return false;
  }
  if (!accessToken && refreshToken) {
    const data = await refreshAccessToken(refreshToken as string);
    await setCookie("accessToken", data.accessToken, {
      cookies,
      maxAge: 15 * 60,
    });
    await setCookie("user", data.user, { cookies, maxAge: 15 * 60 });

    return true;
  }
  if (!refreshToken) {
    return false;
  }

  if (accessToken) {
    try {
      const path = `${API_URL}/auth/check`;
      const method = "POST";
      const headers = {
        "Content-Type": "application/json",
      };

      const { res } = await fetchData(path, method, headers, "", accessToken);
      if (res?.ok) {
        return true; // Token còn hạn và hợp lệ
      }

      const newAccessToken = await refreshAccessToken(refreshToken as string);
      await setCookie("accessToken", newAccessToken, { cookies });

      return true; // Token đã được làm mới
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Unknown error', error);
      }
      return false;
    }
  }
}
