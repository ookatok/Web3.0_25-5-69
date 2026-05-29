/**
 * @file page.tsx
 * @path src/app/(public)/portfolio/[slug]/page.tsx
 * @description หน้าแสดงผลงานโครงการเจาะลึก รวมรูปภาพสไลเดอร์แบบละเอียดและคำบรรยายแนวคิดงานผลิต
 */

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Folder, Briefcase, Phone, Send } from "lucide-react";
import { container } from "@/infrastructure/di/container";
import Gallery from "@/presentation/components/portfolio/Gallery";
import { Button } from "@/presentation/components/ui/button";
import { cookies } from "next/headers";
import { translations } from "@/shared/i18n/translations";

interface PortfolioDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PortfolioDetailsPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const project = await container.getProjectBySlug.execute(decodedSlug);
  if (!project) {
    return {
      title: "ไม่พบข้อมูลผลงาน | Web3.0 Premium Production",
    };
  }

  return {
    title: `${project.title} | ผลงาน Web3.0`,
    description: project.description.substring(0, 160) || `${project.title} - รายละเอียดตัวอย่างการผลิตสิ่งทอและงานสั่งทำคุณภาพสูง`,
    openGraph: {
      title: project.title,
      description: project.description.substring(0, 160) || undefined,
      type: "article",
      images: project.coverImage ? [{ url: project.coverImage }] : [],
    },
  };
}

export default async function PublicPortfolioDetailsPage({ params }: PortfolioDetailsPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const project = await container.getProjectBySlug.execute(decodedSlug);

  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "th") as "th" | "en";
  const t = translations[lang];

  if (!project || project.status !== "PUBLISHED") {
    notFound();
  }

  // Generate CreativeWork Schema JSON-LD
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": project.images ? project.images.map(img => img.startsWith("http") ? img : `${baseUrl}${img}`) : [],
    "creator": {
      "@type": "Organization",
      "name": "Web3.0 Services",
      "url": baseUrl
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans space-y-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Link */}
      <div className="w-full max-w-5xl">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-theme-card-subtext hover:text-theme-card-text uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.portBack}
        </Link>
      </div>

      {/* Title Card */}
      <div className="w-full max-w-5xl bg-theme-card-bg text-theme-card-text rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none hidden md:block"></div>
        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap gap-2">
            {project.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest bg-white/5 border border-white/10 text-theme-card-subtext uppercase">
                <Folder className="w-3 h-3" />
                {project.category}
              </span>
            )}
          </div>
          <h1 className="font-teko text-5xl sm:text-7xl font-bold uppercase tracking-wider leading-none text-theme-card-text">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Main Grid: Gallery & Details */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Gallery & Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-theme-card-bg border-[4px] border-theme-card-border rounded-[2.5rem] p-4 shadow-2xl overflow-hidden">
            <Gallery images={project.images} title={project.title} />
          </div>

          <div className="bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] p-6 md:p-10 border-[4px] border-theme-card-border shadow-2xl space-y-4">
            <h2 className="font-mono text-xs uppercase font-bold tracking-wider">{t.portDescTitle}</h2>
            <p className="text-xs text-[#2d2e30] leading-relaxed font-light whitespace-pre-line">
              {project.description}
            </p>
          </div>
        </div>

        {/* Right Side: Info Panel */}
        <div className="space-y-6">
          <div className="bg-theme-card-bg text-theme-card-text rounded-[2.5rem] p-6 md:p-8 border-[4px] border-theme-card-border shadow-2xl space-y-6">
            <h2 className="font-mono text-xs uppercase font-bold tracking-wider border-b border-theme-card-border pb-3">{t.portSpecTitle}</h2>
            
            <ul className="space-y-4 text-xs font-mono font-bold uppercase tracking-wide text-theme-card-subtext">
              {project.client && (
                <li className="flex items-start gap-3">
                  <User className="w-4 h-4 text-theme-card-text shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[8px] text-theme-card-subtext font-bold uppercase tracking-widest">{t.portClient}</span>
                    <span className="text-theme-card-text text-xs">{project.client}</span>
                  </div>
                </li>
              )}

              {project.category && (
                <li className="flex items-start gap-3">
                  <Folder className="w-4 h-4 text-theme-card-text shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[8px] text-theme-card-subtext font-bold uppercase tracking-widest">{t.portCategory}</span>
                    <span className="text-theme-card-text text-xs">{project.category}</span>
                  </div>
                </li>
              )}

              {project.date && (
                <li className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-theme-card-text shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[8px] text-theme-card-subtext font-bold uppercase tracking-widest">{t.portYear}</span>
                    <span className="text-theme-card-text text-xs">
                      {new Date(project.date).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                </li>
              )}
            </ul>

            <hr className="border-theme-card-border" />

            {/* CTAs */}
            <div className="space-y-3 font-mono">
              <Link href="/contact" className="w-full">
                <Button className="w-full py-5 rounded-full bg-theme-button-primary-bg text-theme-button-primary-text hover:bg-theme-button-primary-bg/85 tracking-widest text-[9px] font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5">
                  {t.portOrderSimilar}
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <a
                href="tel:0999999999"
                className="w-full flex items-center justify-center gap-2 px-8 py-3 rounded-full text-[9px] font-bold tracking-widest bg-theme-card-bg text-theme-card-text hover:bg-black transition-all uppercase"
              >
                CALL 099-999-9999
              </a>
            </div>
          </div>

          {/* Quality Info Box */}
          <div className="bg-theme-card-bg text-theme-card-subtext rounded-[2rem] p-6 space-y-3 border border-theme-card-border shadow-inner">
            <Briefcase className="w-5 h-5 text-theme-card-text" />
            <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-theme-card-text">{t.portGuaranteeTitle}</h4>
            <p className="text-[10px] text-theme-card-subtext font-light leading-relaxed">
              {t.portGuaranteeDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
