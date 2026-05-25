import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye, BookOpen } from "lucide-react";
import { container } from "@/infrastructure/di/container";
import { Button } from "@/presentation/components/ui/button";


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
    <div className="min-h-screen bg-[#131415] py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans space-y-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Link */}
      <div className="w-full max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-slate-400 hover:text-white uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO INSIGHTS
        </Link>
      </div>

      {/* Title Card */}
      <div className="w-full max-w-4xl bg-[#212224] text-white rounded-[2.5rem] p-8 md:p-12 border-[4px] border-[#2c2d30] shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none hidden md:block"></div>
        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap gap-2">
            {post.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest bg-white/5 border border-white/10 text-slate-400 uppercase">
                {post.category}
              </span>
            )}
          </div>
          <h1 className="font-teko text-5xl sm:text-7xl font-bold uppercase tracking-wider leading-none text-white">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 pt-2 border-b border-[#3a3b3d] pb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "NOT SPECIFIED"}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views} VIEWS
            </span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full max-w-4xl bg-[#2d2e30] border-[4px] border-[#202225] rounded-[2.5rem] p-4 shadow-2xl overflow-hidden aspect-video relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover rounded-[1.8rem]"
          />
        </div>
      )}

      {/* Article Body Card */}
      <div className="w-full max-w-4xl bg-[#212224] border-[4px] border-[#2c2d30] rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative">
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
                className="bg-[#2d2e30] text-slate-300 border border-white/5 text-[9px] font-bold uppercase px-3 py-1.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA Box Card */}
      <div className="w-full max-w-4xl bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] p-8 md:p-12 border-[4px] border-[#202225] shadow-2xl text-center space-y-6">
        <h3 className="font-teko text-5xl font-bold uppercase tracking-wider leading-none">MORE ARTICLES</h3>
        <p className="text-xs text-[#2d2e30] max-w-sm mx-auto font-light leading-relaxed">
          พวกเราอัปเดตบทความสาระความรู้เกี่ยวกับเสื้อผ้าเครื่องแต่งกาย ยูนิฟอร์มองค์กร และนวัตกรรมใหม่ๆ ทุกสัปดาห์
        </p>
        <div className="pt-2 font-mono">
          <Link href="/blog">
            <Button className="py-5 px-8 rounded-full bg-black text-white hover:bg-[#2d2e30] tracking-widest text-[9px] font-bold uppercase cursor-pointer">
              BACK TO BLOG
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
