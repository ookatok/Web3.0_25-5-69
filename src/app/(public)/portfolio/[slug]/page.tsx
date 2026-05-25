import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Folder, Briefcase, Phone, Send } from "lucide-react";
import { container } from "@/infrastructure/di/container";
import Gallery from "@/presentation/components/portfolio/Gallery";
import { Button } from "@/presentation/components/ui/button";

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

  if (!project || project.status !== "PUBLISHED") {
    notFound();
  }

  // Generate CreativeWork Schema JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": project.images,
    "creator": {
      "@type": "Organization",
      "name": "Web3.0 Services",
      "url": "http://localhost:3000"
    }
  };

  return (
    <div className="min-h-screen bg-[#131415] py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans space-y-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Link */}
      <div className="w-full max-w-5xl">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-slate-400 hover:text-white uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO PORTFOLIO
        </Link>
      </div>

      {/* Title Card */}
      <div className="w-full max-w-5xl bg-[#212224] text-white rounded-[2.5rem] p-8 md:p-12 border-[4px] border-[#2c2d30] shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none hidden md:block"></div>
        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap gap-2">
            {project.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest bg-white/5 border border-white/10 text-slate-400 uppercase">
                <Folder className="w-3 h-3" />
                {project.category}
              </span>
            )}
          </div>
          <h1 className="font-teko text-5xl sm:text-7xl font-bold uppercase tracking-wider leading-none text-white">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Main Grid: Gallery & Details */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Gallery & Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#2d2e30] border-[4px] border-[#202225] rounded-[2.5rem] p-4 shadow-2xl overflow-hidden">
            <Gallery images={project.images} title={project.title} />
          </div>

          <div className="bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] p-8 md:p-10 border-[4px] border-[#202225] shadow-2xl space-y-4">
            <h3 className="font-mono text-xs uppercase font-bold tracking-wider">รายละเอียดการผลิต // DESCRIPTION</h3>
            <p className="text-xs text-[#2d2e30] leading-relaxed font-light whitespace-pre-line">
              {project.description}
            </p>
          </div>
        </div>

        {/* Right Side: Info Panel */}
        <div className="space-y-6">
          <div className="bg-[#212224] text-white rounded-[2.5rem] p-8 border-[4px] border-[#2c2d30] shadow-2xl space-y-6">
            <h3 className="font-mono text-xs uppercase font-bold tracking-wider border-b border-[#3a3b3d] pb-3">SPECIFICATIONS</h3>
            
            <ul className="space-y-4 text-xs font-mono font-bold uppercase tracking-wide text-slate-400">
              {project.client && (
                <li className="flex items-start gap-3">
                  <User className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-widest">CLIENT</span>
                    <span className="text-white text-xs">{project.client}</span>
                  </div>
                </li>
              )}

              {project.category && (
                <li className="flex items-start gap-3">
                  <Folder className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-widest">CATEGORY</span>
                    <span className="text-white text-xs">{project.category}</span>
                  </div>
                </li>
              )}

              {project.date && (
                <li className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-widest">PRODUCTION YEAR</span>
                    <span className="text-white text-xs">
                      {new Date(project.date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                </li>
              )}
            </ul>

            <hr className="border-[#3a3b3d]" />

            {/* CTAs */}
            <div className="space-y-3 font-mono">
              <Link href="/contact" className="w-full">
                <Button className="w-full py-5 rounded-full bg-white text-black hover:bg-slate-200 tracking-widest text-[9px] font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5">
                  ORDER SIMILAR WORK
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <a
                href="tel:0999999999"
                className="w-full flex items-center justify-center gap-2 px-8 py-3 rounded-full text-[9px] font-bold tracking-widest bg-[#2d2e30] text-white hover:bg-black transition-all uppercase"
              >
                CALL 099-999-9999
              </a>
            </div>
          </div>

          {/* Quality Info Box */}
          <div className="bg-[#2d2e30] text-slate-400 rounded-[2rem] p-6 space-y-3 border border-white/5 shadow-inner">
            <Briefcase className="w-5 h-5 text-white" />
            <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-white">GARANTEED QUALITY</h4>
            <p className="text-[10px] text-slate-400 font-light leading-relaxed">
              สินค้าของเราทั้งหมดผ่านกระบวนการคัดกรองเนื้อผ้าและการปักสกรีนที่ประณีตด้วยเครื่องจักรความเที่ยงตรงสูง พร้อมรับประกันสินค้าชำรุดเสียหายใน 14 วัน
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
