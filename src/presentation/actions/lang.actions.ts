"use server";

/**
 * @file lang.actions.ts
 * @path src/presentation/actions/lang.actions.ts
 * @description Server Action สำหรับสลับภาษา (TH/EN) บันทึกตัวเลือกผ่านคุกกี้ และสั่งเคลียร์แคชรีเฟรชหน้าเว็บอัตโนมัติ
 */


import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleLanguageAction() {
  const cookieStore = await cookies();
  const currentLang = cookieStore.get("lang")?.value || "th";
  const nextLang = currentLang === "th" ? "en" : "th";
  
  // Set lang cookie for 365 days
  cookieStore.set("lang", nextLang, { 
    path: "/", 
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
  
  revalidatePath("/");
}
