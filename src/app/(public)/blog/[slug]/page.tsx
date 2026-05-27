/**
 * @file page.tsx
 * @path src/app/(public)/blog/[slug]/page.tsx
 * @description หน้าแสดงรายละเอียดบทความฉับเต็ม พร้อมรูปหน้าปก ระบบนับยอดอ่าน และโครงสร้างข้อมูล SEO JSON-LD
 */

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye, BookOpen } from "lucide-react";
import { container } from "@/infrastructure/di/container";
import { Button } from "@/presentation/components/ui/button";
import { cookies } from "next/headers";
import { translations } from "@/shared/i18n/translations";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await container.getPostBySlug.execute(decodedSlug, { incrementViews: false });
  if (!post) {
    return {
      title: "ไม่พบหน้าบทความ | Web3.0 Premium Services",
    };
  }

  return {
    title: `${post.title} | บทความ Web3.0`,
    description: post.excerpt || `${post.title} - อ่านบทความสาระน่ารู้เพิ่มเติมได้ที่นี่`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await container.getPostBySlug.execute(decodedSlug, { incrementViews: true });

  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "th") as "th" | "en";
  const t = translations[lang];

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  // Generate Article Schema JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || "",
    "image": post.coverImage ? [post.coverImage] : [],
    "datePublished": post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": [{
      "@type": "Organization",
      "name": "Web3.0 Services",
      "url": "http://localhost:3000"
    }]
  };

  return (
    <div className="min-h-screen bg-theme-bg py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans space-y-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Link */}
      <div className="w-full max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-theme-card-subtext hover:text-theme-card-text uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.blogBack}
        </Link>
      </div>

      {/* Title Card */}
      <div className="w-full max-w-4xl bg-theme-card-bg text-theme-card-text rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none hidden md:block"></div>
        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap gap-2">
            {post.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest bg-white/5 border border-white/10 text-theme-card-subtext uppercase">
                {post.category}
              </span>
            )}
          </div>
          <h1 className="font-teko text-5xl sm:text-7xl font-bold uppercase tracking-wider leading-none text-theme-card-text">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-[9px] font-mono font-bold uppercase tracking-widest text-theme-card-subtext pt-2 border-b border-[#3a3b3d] pb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "NOT SPECIFIED"}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views} {lang === "th" ? "ครั้ง" : "VIEWS"}
            </span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full max-w-4xl bg-theme-card-bg border-[4px] border-theme-card-border rounded-[2.5rem] p-4 shadow-2xl overflow-hidden aspect-video relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover rounded-[1.8rem]"
          />
        </div>
      )}

      {/* Article Body Card */}
      <div className="w-full max-w-4xl bg-theme-card-bg border-[4px] border-theme-card-border rounded-[2.5rem] p-6 md:p-14 shadow-2xl relative">
        <div 
          className="prose-custom max-w-none pt-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-8 border-t border-[#3a3b3d] mt-8 font-mono">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="bg-theme-card-bg text-theme-card-subtext border border-white/5 text-[9px] font-bold uppercase px-3 py-1.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA Box Card */}
      <div className="w-full max-w-4xl bg-theme-inverted-bg text-theme-inverted-text rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl text-center space-y-6">
        <h3 className="font-teko text-5xl font-bold uppercase tracking-wider leading-none">{t.blogMore}</h3>
        <p className="text-xs text-theme-inverted-text/80 max-w-sm mx-auto font-light leading-relaxed">
          {t.blogMoreDesc}
        </p>
        <div className="pt-2 font-mono">
          <Link href="/blog">
            <Button className="py-5 px-8 rounded-full bg-theme-bg text-theme-card-text hover:opacity-90 tracking-widest text-[9px] font-bold uppercase cursor-pointer">
              {t.blogBackBtn}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
