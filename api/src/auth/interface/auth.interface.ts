export interface JwtPayloadRefreshToken {
  email: string;
  sub: number; // user ID
  iat: number; // issued at
  exp: number; // expiry
}