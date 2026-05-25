import React from "react";
import Navbar from "@/presentation/components/shared/Navbar";
import Footer from "@/presentation/components/shared/Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-20 bg-[#131415] text-[#c2c4c6] flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
