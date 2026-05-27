"use server";

/**
 * @file theme.actions.ts
 * @path src/presentation/actions/theme.actions.ts
 * @description Server Action สำหรับสลับโหมดการแสดงผล (โหมดมืด/โหมดสว่าง) บันทึกผ่านคุกกี้ และรีเฟรชแคชหน้าจอ
 */

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleThemeAction() {
  const cookieStore = await cookies();
  const currentTheme = cookieStore.get("theme")?.value || "dark";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  
  // Set theme cookie for 365 days
  cookieStore.set("theme", nextTheme, { 
    path: "/", 
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
  
  revalidatePath("/");
}
