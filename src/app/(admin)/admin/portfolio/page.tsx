/**
 * @file page.tsx
 * @path src/app/(admin)/admin/portfolio/page.tsx
 * @description ตารางจัดการข้อมูลผลงานแกลเลอรีฝั่งแอดมิน สามารถดู ค้นหา เพิ่ม ลบ และอัปเดตผลงานโครงการได้
 */

import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { container } from "@/infrastructure/di/container";
import { Plus, Edit, Trash2, Briefcase, Folder } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { deleteProjectFormAction } from "@/presentation/actions/portfolio.actions";
import { translations } from "@/shared/i18n/translations";

// 1. Force Next.js server runtime to fetch real-time items on table load
export const revalidate = 0;

export default async function AdminPortfolioListPage() {
  // 2. Fetch projects from database use case
  const { projects: projectItems } = await container.listProjects.execute({});

  // 3. Resolve active bilingual setting from client cookies
  const cookieStore = await cookies();
  const lang = (cookieStore.get("admin_lang")?.value || "th") as "th" | "en";
  const t = translations[lang];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 4. Page Header Block (Stacks vertically on mobile, renders inline on desktop screens) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-theme-card-text">{t.admManagePortfolio}</h1>
          <p className="text-xs text-theme-card-subtext font-light mt-1">
            {t.admPortfolioDesc}
          </p>
        </div>

        <Link href="/admin/portfolio/new" className="w-fit">
          <Button className="bg-theme-button-primary-bg hover:opacity-90 text-theme-button-primary-text font-semibold flex items-center gap-1 text-xs rounded-lg py-4 px-5 transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            {t.admAddNewPortfolio}
          </Button>
        </Link>
      </div>

      {/* 5. Empty State display (Triggers if there are no records) */}
      {projectItems.length === 0 ? (
        <div className="border border-theme-card-border bg-theme-card-bg rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
          <div className="p-3.5 bg-theme-bg border border-theme-card-border rounded-2xl text-theme-card-subtext">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-theme-card-text">{t.admNoPort}</h3>
          <p className="text-xs text-theme-card-subtext font-light max-w-xs leading-relaxed">
            {t.admNoPortDesc}
          </p>
        </div>
      ) : (
        <div className="border border-theme-card-border bg-theme-card-bg rounded-xl overflow-hidden shadow">
          {/* 6. Main showcase table block wrapped in overflow scrollbar container */}
          <div className="overflow-x-auto">
            {/* min-w-[750px] guarantees columns will have adequate space on small screens */}
            <table className="w-full min-w-[750px] text-left border-collapse">
              <thead>
                <tr className="border-b border-theme-card-border bg-theme-bg text-[10px] uppercase font-bold text-theme-card-subtext tracking-wider">
                  <th className="py-4 px-6 w-20 whitespace-nowrap">{t.admTablePortCover}</th>
                  <th className="py-4 px-6 min-w-[200px]">{t.admTablePortTitle}</th>
                  <th className="py-4 px-6 whitespace-nowrap">{t.admTablePortCategory}</th>
                  <th className="py-4 px-6 whitespace-nowrap">{t.admTablePortClient}</th>
                  <th className="py-4 px-6 whitespace-nowrap">{t.admStatus}</th>
                  <th className="py-4 px-6 text-right whitespace-nowrap">{t.admActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-card-border text-xs">
                {projectItems.map((project) => (
                  <tr key={project.id} className="hover:bg-theme-bg/50 text-theme-card-text transition-colors">
                    {/* Cover image preview cell */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="w-12 h-12 bg-theme-bg border border-theme-card-border rounded-md overflow-hidden flex items-center justify-center font-bold text-[9px] text-theme-card-subtext">
                        {project.coverImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          t.admNoCover
                        )}
                      </div>
                    </td>
                    
                    {/* Project Title cell */}
                    <td className="py-4 px-6 font-medium text-theme-card-text max-w-xs truncate">
                      {project.title}
                    </td>
                    
                    {/* Category cell (Uses nested div flex container to avoid row misalignment) */}
                    <td className="py-4 px-6 font-light whitespace-nowrap text-theme-card-subtext">
                      <div className="flex items-center gap-1.5">
                        <Folder className="w-3.5 h-3.5 text-theme-card-subtext shrink-0" />
                        <span>{project.category || (lang === "th" ? "ไม่ระบุประเภท" : "Unspecified")}</span>
                      </div>
                    </td>
                    
                    {/* Client Name cell */}
                    <td className="py-4 px-6 font-light whitespace-nowrap text-theme-card-subtext">
                      {project.client || (lang === "th" ? "ไม่ระบุลูกค้า" : "Unspecified")}
                    </td>
                    
                    {/* Status badge cell */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {project.status === "PUBLISHED" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          {t.admPublish}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-theme-bg border border-theme-card-border text-theme-card-subtext">
                          {t.admDraft}
                        </span>
                      )}
                    </td>
                    
                    {/* Action buttons (Edit / Delete) */}
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <Link href={`/admin/portfolio/${project.id}/edit`}>
                        <button className="p-1.5 rounded hover:bg-theme-bg text-theme-card-subtext hover:text-theme-card-text transition-all cursor-pointer">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </Link>
 
                      <form action={deleteProjectFormAction} className="inline">
                        <input type="hidden" name="id" value={project.id} />
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
