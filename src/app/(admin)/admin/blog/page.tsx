/**
 * @file page.tsx
 * @path src/app/(admin)/admin/blog/page.tsx
 * @description ตารางจัดการข้อมูลบล็อกบทความฝั่งแอดมิน มีปุ่มเพิ่ม แก้ไข ลบ และรองรับการแสดงผลแบบ Responsive ในมือถือ
 */

import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { container } from "@/infrastructure/di/container";
import { Plus, Edit, Trash2, BookOpen, Eye } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { deletePostFormAction } from "@/presentation/actions/blog.actions";
import { translations } from "@/shared/i18n/translations";

// 1. Disable Next.js caching to fetch real-time items on table load
export const revalidate = 0;

export default async function AdminBlogListPage() {
  // 2. Fetch blogs from use case container
  const { posts } = await container.listPosts.execute({});

  // 3. Resolve active bilingual setting from client cookies
  const cookieStore = await cookies();
  const lang = (cookieStore.get("admin_lang")?.value || "th") as "th" | "en";
  const t = translations[lang];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 4. Page Header Block (Stacks vertically on mobile, renders inline on desktop screens) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-theme-card-text">{t.admManageBlog}</h1>
          <p className="text-xs text-theme-card-subtext font-light mt-1">
            {t.admBlogDesc}
          </p>
        </div>

        <Link href="/admin/blog/new" className="w-fit">
          <Button className="bg-theme-button-primary-bg hover:opacity-90 text-theme-button-primary-text font-semibold flex items-center gap-1 text-xs rounded-lg py-4 px-5 transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            {t.admWriteNewBlog}
          </Button>
        </Link>
      </div>

      {/* 5. Empty State display (Triggers if there are no records) */}
      {posts.length === 0 ? (
        <div className="border border-theme-card-border bg-theme-card-bg rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
          <div className="p-3.5 bg-theme-bg border border-theme-card-border rounded-2xl text-theme-card-subtext">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-theme-card-text">{t.admNoBlog}</h3>
          <p className="text-xs text-theme-card-subtext font-light max-w-xs leading-relaxed">
            {t.admNoBlogDesc}
          </p>
        </div>
      ) : (
        <div className="border border-theme-card-border bg-theme-card-bg rounded-xl overflow-hidden shadow">
          {/* 6. Main blog table block wrapped in overflow scrollbar container */}
          <div className="overflow-x-auto">
            {/* min-w-[700px] guarantees columns will have adequate space on small screens */}
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="border-b border-theme-card-border bg-theme-bg text-[10px] uppercase font-bold text-theme-card-subtext tracking-wider">
                  <th className="py-4 px-6 w-20 whitespace-nowrap">{t.admTableCover}</th>
                  <th className="py-4 px-6 min-w-[200px]">{t.admTableTitle}</th>
                  <th className="py-4 px-6 whitespace-nowrap">{t.admTableCategory}</th>
                  <th className="py-4 px-6 whitespace-nowrap">{t.admStatus}</th>
                  <th className="py-4 px-6 text-center whitespace-nowrap">{t.admViews}</th>
                  <th className="py-4 px-6 text-right whitespace-nowrap">{t.admActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-card-border text-xs">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-theme-bg/50 text-theme-card-text transition-colors">
                    {/* Cover image preview cell */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="w-12 h-12 bg-theme-bg border border-theme-card-border rounded-md overflow-hidden flex items-center justify-center font-bold text-[9px] text-theme-card-subtext">
                        {post.coverImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          t.admNoCover
                        )}
                      </div>
                    </td>
                    
                    {/* Article title cell */}
                    <td className="py-4 px-6 font-medium text-theme-card-text max-w-xs truncate">
                      {post.title}
                    </td>
                    
                    {/* Category cell */}
                    <td className="py-4 px-6 font-light whitespace-nowrap text-theme-card-subtext">
                      {post.category || (lang === "th" ? "ไม่มีหมวดหมู่" : "Uncategorized")}
                    </td>
                    
                    {/* Status badge cell */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {post.status === "PUBLISHED" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          {t.admPublish}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-theme-bg border border-theme-card-border text-theme-card-subtext">
                          {t.admDraft}
                        </span>
                      )}
                    </td>
                    
                    {/* Views counter cell */}
                    <td className="py-4 px-6 text-center font-semibold whitespace-nowrap text-theme-card-text">
                      <span className="inline-flex items-center gap-1 text-[10px]">
                        <Eye className="w-3.5 h-3.5 text-theme-card-subtext" />
                        {post.views}
                      </span>
                    </td>
                    
                    {/* Action buttons (Edit / Delete) */}
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <button className="p-1.5 rounded hover:bg-theme-bg text-theme-card-subtext hover:text-theme-card-text transition-all cursor-pointer">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </Link>
 
                      <form action={deletePostFormAction} className="inline">
                        <input type="hidden" name="id" value={post.id} />
                        <button
                          type="submit"
                          className="p-1.5 rounded hover:bg-rose-500/10 text-theme-card-subtext hover:text-rose-500 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
