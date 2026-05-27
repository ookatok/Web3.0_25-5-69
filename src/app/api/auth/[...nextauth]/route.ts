/**
 * @file route.ts
 * @path src/app/api/auth/[...nextauth]/route.ts
 * @description API Handler ของระบบล็อกอิน NextAuth สำหรับรองรับความปลอดภัยฝั่งเซิร์ฟเวอร์
 */

import { handlers } from "@/infrastructure/auth/auth";
export const { GET, POST } = handlers;
