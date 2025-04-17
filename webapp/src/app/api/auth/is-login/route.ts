import { NextResponse } from 'next/server';
import { isLogin } from '~/utils/isAuthenticated';

export async function GET() {
  const loggedIn = await isLogin();
  return NextResponse.json({ loggedIn });
}
