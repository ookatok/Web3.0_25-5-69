/**
 * @file layout.tsx
 * @path src/app/(admin)/admin/layout.tsx
 * @description หน้าโครงสร้างหลัก (Layout) ฝั่งแอดมิน ตรวจสอบสิทธิ์ผู้ดูแลระบบ ดึงคุกกี้ภาษา และแสดงแผงควบคุมระบบ
 */

import React from "react";
import { requireAdmin } from "@/infrastructure/auth/require-admin";
import { auth } from "@/infrastructure/auth/auth";
import { cookies } from "next/headers";
import AdminNavigation from "@/presentation/components/admin/AdminNavigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

// 1. Root Admin Layout Component (Server Component)
export default async function AdminLayout({ children }: AdminLayoutProps) {
  
  // 2. Guard Route: verify session role in the database.
  // Redirects to /login if user is unauthorized or not signed in.
  await requireAdmin();

  // 3. Retrieve admin details (name and email) from current active session
  const session = await auth();
  const adminEmail = session?.user?.email || "admin@example.com";
  const adminName = session?.user?.name || "Admin User";

  // 4. Retrieve language configuration setting from cookie store (default: "th")
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "th") as "th" | "en";
  const theme = (cookieStore.get("theme")?.value || "dark") as "dark" | "light";

  // 5. Wrap console pages in the responsive layout component with localized switcher
  return (
    <AdminNavigation adminName={adminName} adminEmail={adminEmail} lang={lang} theme={theme}>
      {children}
    </AdminNavigation>
  );
}
