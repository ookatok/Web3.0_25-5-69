/**
 * @file require-admin.ts
 * @path src/infrastructure/auth/require-admin.ts
 * @description ฟังก์ชันผู้ช่วย (Helper function) ตรวจสอบเซสชันความถูกต้องของ Admin บน Server Component และ Server Action
 */

import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/login");
  }
}
