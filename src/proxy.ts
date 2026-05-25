import NextAuth from "next-auth";
import { authConfig } from "@/infrastructure/auth/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
