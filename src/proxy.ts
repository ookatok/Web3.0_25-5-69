/**
 * @file proxy.ts
 * @path src/proxy.ts
 * @description ไฟล์ Middleware ระดับ Edge เพื่อตรวจสอบและคุมความปลอดภัยไม่ให้คนทั่วไปเข้าใช้งานหน้า `/admin/*`
 */

import NextAuth from "next-auth";
import { authConfig } from "@/infrastructure/auth/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
