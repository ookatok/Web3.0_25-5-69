/**
 * @file auth.ts
 * @path src/infrastructure/auth/auth.ts
 * @description ตัวกำหนดค่า NextAuth หลักที่รันบนสภาพแวดล้อม Node.js เพื่อประมวลผลการตรวจสอบสิทธิ์ผู้ใช้ด้วยรหัสผ่านผ่าน bcrypt และฐานข้อมูล
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { container } from "@/infrastructure/di/container";
import { loginSchema } from "@/application/dto/auth.dto";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const userEntity = await container.verifyCredentials.execute(parsed.data);
        if (!userEntity) {
          return null;
        }

        // Return object conforming to NextAuth User interface
        return {
          id: userEntity.id,
          email: userEntity.email,
          name: userEntity.name,
          role: userEntity.role,
        };
      },
    }),
  ],
});
