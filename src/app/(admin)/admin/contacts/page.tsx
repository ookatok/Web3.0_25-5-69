/**
 * @file page.tsx
 * @path src/app/(admin)/admin/contacts/page.tsx
 * @description ตารางจัดการดูรายการข้อความติดต่อประเมินราคาที่ลูกค้าส่งเข้ามา พร้อมปุ่มลบข้อความ
 */

import React from "react";
import { cookies } from "next/headers";
import { container } from "@/infrastructure/di/container";
import { Trash2, MessageSquare, Calendar, User, Phone, Mail, Eye, EyeOff } from "lucide-react";
import { deleteContactFormAction } from "@/presentation/actions/contact.actions";
import { translations } from "@/shared/i18n/translations";

export const revalidate = 0; // Force dynamic page

export default async function AdminContactsPage() {
  const contacts = await container.listContacts.execute();

  const cookieStore = await cookies();
  const lang = (cookieStore.get("admin_lang")?.value || "th") as "th" | "en";
  const t = translations[lang];

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-theme-card-text">{t.admMessages}</h1>
        <p className="text-xs text-theme-card-subtext font-light mt-1">
          {t.admContactDesc}
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="border border-theme-card-border bg-theme-card-bg rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
          <div className="p-3.5 bg-theme-bg border border-theme-card-border rounded-2xl text-theme-card-subtext">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-theme-card-text">{t.admNoMsg}</h3>
          <p className="text-xs text-theme-card-subtext font-light max-w-xs leading-relaxed">
            {t.admNoMsgDesc}
          </p>
        </div>
      ) : (
        <div className="border border-theme-card-border bg-theme-card-bg rounded-xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="border-b border-theme-card-border bg-theme-bg text-[10px] uppercase font-bold text-theme-card-subtext tracking-wider">
                  <th className="py-4 px-6 whitespace-nowrap">{t.admTableContactDate}</th>
                  <th className="py-4 px-6 whitespace-nowrap">{t.admTableContactSender}</th>
                  <th className="py-4 px-6 whitespace-nowrap">{t.admContactChannel}</th>
                  <th className="py-4 px-6 min-w-[250px]">{t.admTableContactMessage}</th>
                  <th className="py-4 px-6 text-right whitespace-nowrap">{t.admActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-card-border text-xs">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-theme-bg/50 text-theme-card-text transition-colors">
                    <td className="py-4 px-6 font-light whitespace-nowrap text-theme-card-subtext">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-theme-card-subtext" />
                        {new Date(contact.createdAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-theme-card-text whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-theme-card-subtext" />
                        {contact.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 space-y-1 whitespace-nowrap">
                      {contact.phone && (
                        <div className="flex items-center gap-1 text-[11px] text-theme-card-text">
                          <Phone className="w-3 h-3 text-theme-card-subtext" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center gap-1 text-[11px] text-theme-card-subtext">
                          <Mail className="w-3 h-3 text-theme-card-subtext" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 font-light max-w-md break-words leading-relaxed text-theme-card-text">
                      <details className="group">
                        <summary className="font-mono text-[10px] font-bold tracking-widest text-indigo-400 hover:text-indigo-300 list-none flex items-center gap-1.5 [&::-webkit-details-marker]:hidden cursor-pointer select-none outline-none">
                          <Eye className="w-3.5 h-3.5 group-open:hidden" />
                          <EyeOff className="w-3.5 h-3.5 hidden group-open:inline" />
                          <span className="group-open:hidden">
                            {lang === "th" ? "เปิดดูเนื้อหา" : "VIEW CONTENT"}
                          </span>
                          <span className="hidden group-open:inline">
                            {lang === "th" ? "ปิดเนื้อหา" : "HIDE CONTENT"}
                          </span>
                        </summary>
                        <div className="mt-2.5 pl-3 border-l-2 border-theme-card-border whitespace-pre-line text-xs font-light text-theme-card-text">
                          {contact.message}
                        </div>
                      </details>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <form action={deleteContactFormAction} className="inline">
                        <input type="hidden" name="id" value={contact.id} />
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
