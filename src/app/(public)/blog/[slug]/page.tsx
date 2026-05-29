/**
 * @file page.tsx
 * @path src/app/(public)/blog/[slug]/page.tsx
 * @description หน้าแสดงรายละเอียดบทความฉับเต็ม พร้อมรูปหน้าปก ระบบนับยอดอ่าน และโครงสร้างข้อมูล SEO JSON-LD
 */

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

  // Fetch related posts in the same category (with recent fallbacks)
  let relatedPosts: any[] = [];
  try {
    const { posts: fetchedPosts } = await container.listPosts.execute({
      limit: 4,
      status: "PUBLISHED",
      category: post.category || undefined,
    });
    relatedPosts = fetchedPosts
      .filter((p) => p.id !== post.id)
      .slice(0, 3);
    
    if (relatedPosts.length < 3) {
      const { posts: recentPosts } = await container.listPosts.execute({
        limit: 5,
        status: "PUBLISHED",
      });
      const extraPosts = recentPosts
        .filter((p) => p.id !== post.id && !relatedPosts.some((r) => r.id === p.id))
        .slice(0, 3 - relatedPosts.length);
      relatedPosts = [...relatedPosts, ...extraPosts];
    }
  } catch (err) {
    console.error("Failed to fetch related posts:", err);
  }

  // Generate Article Schema JSON-LD
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || "",
    "image": post.coverImage ? (post.coverImage.startsWith("http") ? [post.coverImage] : [`${baseUrl}${post.coverImage}`]) : [],
    "datePublished": post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": [{
      "@type": "Organization",
      "name": "Web3.0 Services",
      "url": baseUrl
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
          <div className="flex flex-wrap items-center gap-6 text-[9px] font-mono font-bold uppercase tracking-widest text-theme-card-subtext pt-2 border-b border-theme-card-border pb-4">
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
          <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              unoptimized={post.coverImage.startsWith("http")}
            />
          </div>
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
          <div className="flex flex-wrap gap-2 pt-8 border-t border-theme-card-border mt-8 font-mono">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="bg-theme-card-bg text-theme-card-subtext border border-theme-card-border text-[9px] font-bold uppercase px-3 py-1.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA Box Card */}
      <div className="w-full max-w-4xl bg-theme-inverted-bg text-theme-inverted-text rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl text-center space-y-6">
        <h2 className="font-teko text-5xl font-bold uppercase tracking-wider leading-none">{t.blogMore}</h2>
        <p className="text-xs text-theme-inverted-text/80 max-w-sm mx-auto font-light leading-relaxed">
          {t.blogMoreDesc}
        </p>

        {relatedPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left my-8">
            {relatedPosts.map((rPost) => (
              <Link
                key={rPost.id}
                href={`/blog/${rPost.slug}`}
                className="group flex flex-col bg-theme-bg text-theme-card-text border-2 border-transparent hover:border-theme-inverted-text rounded-[2rem] overflow-hidden shadow-lg transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="relative h-40 m-2.5 bg-theme-card-bg rounded-[1.3rem] overflow-hidden border border-white/5 shrink-0">
                  {rPost.coverImage ? (
                    <Image
                      src={rPost.coverImage}
                      alt={rPost.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 250px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized={rPost.coverImage.startsWith("http")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950/20 to-purple-950/20">
                      <BookOpen className="w-6 h-6 text-indigo-500/30" />
                    </div>
                  )}
                  {rPost.category && (
                    <span className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-[7px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 text-white">
                      {rPost.category}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[7px] tracking-widest uppercase font-mono text-theme-card-subtext font-bold">
                      {rPost.publishedAt
                        ? new Date(rPost.publishedAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "NOT SPECIFIED"}
                    </span>
                    <h4 className="font-mono text-[11px] font-bold text-theme-card-text group-hover:text-theme-card-subtext transition-colors line-clamp-2 leading-snug uppercase">
                      {rPost.title}
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[8px] font-mono tracking-widest text-indigo-500 font-bold uppercase pt-2">
                    {lang === "th" ? "อ่านต่อ" : "READ MORE"} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

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
