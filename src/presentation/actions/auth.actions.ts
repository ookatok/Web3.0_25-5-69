"use server";

/**
 * @file auth.actions.ts
 * @path src/presentation/actions/auth.actions.ts
 * @description Server Actions สำหรับควบคุมพฤติกรรม Login และ Logout ฝั่งผู้ดูแลระบบ
 */


import { loginSchema } from "@/application/dto/auth.dto";
import { signIn, signOut } from "@/infrastructure/auth/auth";
import { AuthError } from "next-auth";

export async function loginAction(formData: unknown) {
  const result = loginSchema.safeParse(formData);
  if (!result.success) {
    return { error: "อีเมลหรือรหัสผ่านรูปแบบไม่ถูกต้อง" };
  }

  const { email, password } = result.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
        default:
          return { error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" };
      }
    }
    throw error; // Essential for Next.js to handle the NextAuth redirect internally
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
