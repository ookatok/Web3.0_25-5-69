/**
 * @file page.tsx
 * @path src/app/(public)/blog/page.tsx
 * @description หน้ารวมบทความสาระน่ารู้เกี่ยวกับวงการตัดเย็บเสื้อผ้า แนะนำแฟชั่น และข่าวกิจกรรมต่างๆ
 */

import React from "react";
import Link from "next/link";
import { Search, Calendar, Eye, ArrowRight, BookOpen } from "lucide-react";
import { container } from "@/infrastructure/di/container";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { cookies } from "next/headers";
import { translations } from "@/shared/i18n/translations";

interface BlogPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export const metadata = {
  title: "บทความและบล็อก | Web3.0 Premium Services",
  description: "อัปเดตเทรนด์ เทคโนโลยี ความรู้เรื่องเสื้อผ้าเครื่องแบบ และการทำการตลาดดิจิทัลในยุค Web3.0",
};

export default async function PublicBlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams.search || "";
  const category = resolvedSearchParams.category || "";
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page || "1", 10));
  const limit = 6;
  const offset = (currentPage - 1) * limit;

  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "th") as "th" | "en";
  const t = translations[lang];

  // Fetch posts from usecase
  const { posts, total } = await container.listPosts.execute({
    limit,
    offset,
    status: "PUBLISHED",
    search: search || undefined,
    category: category || undefined,
  });

  const totalPages = Math.ceil(total / limit);

  // Categories list (localized default option)
  const defaultOption = lang === "th" ? "ทั้งหมด" : "All";
  const categories = lang === "th"
    ? ["ทั้งหมด", "Technology", "Marketing", "Business", "Fashion", "Uniforms"]
    : ["All", "Technology", "Marketing", "Business", "Fashion", "Uniforms"];

  return (
    <div className="min-h-screen bg-theme-bg py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans space-y-8">
      {/* Header Card */}
      <div className="w-full max-w-5xl bg-theme-card-bg text-theme-card-text rounded-[2.5rem] p-8 md:p-12 border-[4px] border-theme-card-border shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none hidden md:block"></div>
        <div className="space-y-4 relative z-10">
          <span className="font-mono text-[10px] tracking-widest text-theme-card-subtext uppercase font-bold">{t.blogSub}</span>
          <h1 className="font-teko text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-wider leading-none">
            {t.blogTitle}
          </h1>
          <p className="font-mono text-xs text-theme-card-subtext uppercase tracking-widest">
            {t.blogDescSub}
          </p>
          <p className="text-xs text-theme-card-subtext max-w-lg leading-relaxed font-light">
            {t.blogDescText}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar Card */}
      <div className="w-full max-w-5xl bg-theme-card-bg border-[4px] border-theme-card-border rounded-[2rem] p-6 text-theme-card-text flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        {/* Categories Tab */}
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none gap-2 w-full md:w-auto font-mono pb-2 md:pb-0">
          {categories.map((cat) => {
            const isDefault = cat === defaultOption;
            const isActive = (isDefault && !category) || category === cat;
            const href = isDefault 
              ? `/blog${search ? `?search=${search}` : ""}`
              : `/blog?category=${cat}${search ? `&search=${search}` : ""}`;

            return (
              <Link
                key={cat}
                href={href}
                className={`px-4 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase transition-all duration-200 border ${
                  isActive
                    ? "bg-theme-inverted-bg border-theme-inverted-border text-theme-inverted-text font-extrabold"
                    : "bg-theme-bg text-theme-card-subtext border-transparent hover:text-theme-card-text hover:border-theme-card-border"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Search Form */}
        <form action="/blog" method="GET" className="relative w-full md:w-80">
          {category && <input type="hidden" name="category" value={category} />}
          <input
            type="text"
            name="search"
            placeholder={t.blogSearch}
            defaultValue={search}
            className="w-full bg-theme-bg border border-theme-card-border rounded-full px-5 py-2.5 pl-10 text-[10px] text-theme-card-text placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-theme-card-text focus:border-theme-card-text transition-all font-mono font-bold tracking-wider uppercase"
          />
          <Search className="absolute left-4 top-3.5 w-3.5 h-3.5 text-theme-card-subtext" />
        </form>
      </div>

      {/* Blog Grid Card */}
      <div className="w-full max-w-5xl bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border-[4px] border-theme-card-border shadow-2xl space-y-8">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-theme-bg text-theme-card-text border border-theme-card-border rounded-[2rem] space-y-4">
            <p className="font-mono text-xs text-theme-card-subtext uppercase tracking-widest">{t.blogNoResult}</p>
            {(search || category) && (
              <Link href="/blog">
                <Button className="rounded-full bg-theme-button-primary-bg text-theme-button-primary-text hover:bg-theme-button-primary-bg/85 font-mono tracking-widest text-[9px] uppercase py-4 px-6">
                  {t.blogClear}
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card 
                key={post.id} 
                className="group flex flex-col bg-theme-bg text-theme-card-text border-2 border-transparent hover:border-theme-card-text rounded-[2rem] overflow-hidden shadow-lg transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="relative h-48 m-3 bg-theme-card-bg rounded-[1.5rem] overflow-hidden border border-white/5">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950/20 to-purple-950/20">
                      <BookOpen className="w-8 h-8 text-indigo-500/30" />
                    </div>
                  )}
                  {post.category && (
                    <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-[8px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                      {post.category}
                    </span>
                  )}
                </div>

                <CardHeader className="space-y-2 p-5 pb-2">
                  <div className="flex items-center gap-4 text-[8px] font-mono font-bold uppercase tracking-widest text-theme-card-subtext">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "NOT SPECIFIED"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views} {lang === "th" ? "ครั้ง" : "VIEWS"}
                    </span>
                  </div>
                  <CardTitle className="font-mono text-xs font-bold text-theme-card-text group-hover:text-theme-card-subtext transition-colors line-clamp-2 leading-snug uppercase">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow p-5 pt-0 pb-4">
                  <p className="text-[11px] text-theme-card-subtext font-light leading-relaxed line-clamp-3">
                    {post.excerpt || (lang === "th" ? "ไม่มีบทนำสำหรับบทความนี้..." : "No excerpt available for this post...")}
                  </p>
                </CardContent>

                <CardFooter className="p-5 pt-0 border-t border-white/5">
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="w-full inline-flex items-center justify-between text-[9px] font-mono tracking-widest text-theme-card-subtext group-hover:text-theme-card-text uppercase pt-4"
                  >
                    <span>{t.blogRead}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-6 font-mono">
            <Link
              href={`/blog?page=${currentPage - 1}${category ? `&category=${category}` : ""}${
                search ? `&search=${search}` : ""
              }`}
              className={`px-4 py-2 rounded-full border text-[9px] tracking-widest uppercase transition-colors ${
                currentPage === 1
                  ? "opacity-50 pointer-events-none text-theme-card-subtext border-slate-300"
                  : "bg-white border-white text-black font-bold hover:bg-slate-200"
              }`}
            >
              {lang === "th" ? "ก่อนหน้า" : "PREV"}
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?page=${p}${category ? `&category=${category}` : ""}${
                  search ? `&search=${search}` : ""
                }`}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-[9px] font-bold border transition-all ${
                  currentPage === p
                    ? "bg-theme-button-primary-bg border-theme-button-primary-bg text-theme-button-primary-text"
                    : "bg-theme-bg border-transparent text-theme-card-subtext hover:border-black hover:text-black"
                }`}
              >
                {p}
              </Link>
            ))}
            <Link
              href={`/blog?page=${currentPage + 1}${category ? `&category=${category}` : ""}${
                search ? `&search=${search}` : ""
              }`}
              className={`px-4 py-2 rounded-full border text-[9px] tracking-widest uppercase transition-colors ${
                currentPage === totalPages
                  ? "opacity-50 pointer-events-none text-theme-card-subtext border-slate-300"
                  : "bg-white border-white text-black font-bold hover:bg-slate-200"
              }`}
            >
              {lang === "th" ? "ถัดไป" : "NEXT"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
