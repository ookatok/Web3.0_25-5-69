/**
 * @file layout.tsx
 * @path src/app/(public)/layout.tsx
 * @description หน้าโครงสร้างหลัก (Layout) สาธารณะ ตรวจจับคุกกี้ภาษาเพื่อส่งต่อไปยัง Navbar/Footer
 */

import React from "react";
import Navbar from "@/presentation/components/shared/Navbar";
import Footer from "@/presentation/components/shared/Footer";
import { cookies } from "next/headers";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "th") as "th" | "en";
  const theme = (cookieStore.get("theme")?.value || "dark") as "dark" | "light";

  return (
    <>
      <Navbar lang={lang} theme={theme} />
      <main className="flex-grow pt-20 bg-theme-bg text-theme-text transition-colors duration-300 flex flex-col">
        {children}
      </main>
      <Footer lang={lang} theme={theme} />
    </>
  );
}
