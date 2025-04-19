// app/api/cart/add-to-cart/route.ts
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "~/constants";
import { fetchData } from "~/utils/fetchData";
import { isLogin } from "~/utils/isAuthenticated";

export async function POST(req: Request) {
  const body = await req.json();
  const { productId, quantity } = body;
  const loggedIn = await isLogin();
  console.log("loggedIn", loggedIn);
  
  if (loggedIn) {
    const accessToken = await getCookie("accessToken", { cookies });
    console.log("accessToken", accessToken);
    const path = `${API_URL}/cart`;
    const method = "POST";

    const body = JSON.stringify({
      productId,
      quantity,
    });

    const headers = {
      "Content-Type": "application/json",
    };

    const { data, errorMessage } = await fetchData(
      path,
      method,
      headers,
      body,
      accessToken as string
    );

    if (errorMessage) {
      console.error("Error:", errorMessage);
    } else {
      console.log("Response:", data);
    }

    return NextResponse.json({ data });
  }
  return NextResponse.json({ loggedIn });
}
