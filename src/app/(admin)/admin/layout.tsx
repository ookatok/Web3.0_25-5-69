import React from "react";
import { requireAdmin } from "@/infrastructure/auth/require-admin";
import { auth } from "@/infrastructure/auth/auth";
import { cookies } from "next/headers";
import AdminNavigation from "@/presentation/components/admin/AdminNavigation";
import { container } from "@/infrastructure/di/container";

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
  const lang = (cookieStore.get("admin_lang")?.value || "th") as "th" | "en";
  const theme = (cookieStore.get("theme")?.value || "dark") as "dark" | "light";

  // Fetch count of contact messages
  let contactCount = 0;
  try {
    const contacts = await container.listContacts.execute();
    contactCount = contacts.length;
  } catch (err) {
    console.error("Failed to fetch contact count for admin layout:", err);
  }

  // 5. Wrap console pages in the responsive layout component with localized switcher
  return (
    <AdminNavigation adminName={adminName} adminEmail={adminEmail} lang={lang} theme={theme} contactCount={contactCount}>
      {children}
    </AdminNavigation>
  );
}
