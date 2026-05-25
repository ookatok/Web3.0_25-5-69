import React from "react";
import { container } from "@/infrastructure/di/container";
import { Trash2, MessageSquare, Calendar, User, Phone, Mail } from "lucide-react";
import { deleteContactFormAction } from "@/presentation/actions/contact.actions";

export const revalidate = 0; // Force dynamic page

export default async function AdminContactsPage() {
  const contacts = await container.listContacts.execute();

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-white">ข้อความติดต่อ (Contact Messages)</h1>
        <p className="text-xs text-slate-400 font-light mt-1">
          ดูข้อความและข้อมูลการติดต่อกลับของลูกค้าที่สนใจบริการสั่งผลิตเสื้อผ้า/สินค้าพรีเมียม
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="border border-slate-900 bg-slate-900/30 rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="p-3.5 bg-slate-950/40 border border-slate-800 rounded-2xl text-slate-500">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-slate-300">ยังไม่มีข้อความติดต่อใดๆ</h3>
          <p className="text-xs text-slate-500 font-light max-w-xs leading-relaxed">
            เมื่อมีลูกค้ากรอกข้อมูลติดต่อเสนอราคาที่หน้าเว็บสาธารณะ ข้อความทั้งหมดจะปรากฏในหน้านี้
          </p>
        </div>
      ) : (
        <div className="border border-slate-900 bg-slate-900/10 rounded-xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-900/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-4 px-6">วันที่</th>
                  <th className="py-4 px-6">ผู้ติดต่อ</th>
                  <th className="py-4 px-6">ช่องทางติดต่อกลับ</th>
                  <th className="py-4 px-6">ข้อความ / รายละเอียดความสนใจ</th>
                  <th className="py-4 px-6 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-900/20 text-slate-300 transition-colors">
                    <td className="py-4 px-6 font-light whitespace-nowrap text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(contact.createdAt).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-white whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        {contact.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 space-y-1">
                      {contact.phone && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-200">
                          <Phone className="w-3 h-3 text-indigo-400" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-300">
                          <Mail className="w-3 h-3 text-indigo-400" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 font-light max-w-md break-words whitespace-pre-line leading-relaxed text-slate-300">
                      {contact.message}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <form action={deleteContactFormAction} className="inline">
                        <input type="hidden" name="id" value={contact.id} />
                        <button
                          type="submit"
                          className="p-1.5 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
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
