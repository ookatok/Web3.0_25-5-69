import React from "react";
import Link from "next/link";
import { container } from "@/infrastructure/di/container";
import { Plus, Edit, Trash2, BookOpen, Eye } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { deletePostFormAction } from "@/presentation/actions/blog.actions";

export const revalidate = 0; // Force dynamic page

export default async function AdminBlogListPage() {
  const { posts } = await container.listPosts.execute({});

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">จัดการบทความ (Blog)</h1>
          <p className="text-xs text-slate-400 font-light mt-1">
            สร้าง แก้ไข เผยแพร่ หรือลบบทความและข่าวสารบนเว็บไซต์ของคุณ
          </p>
        </div>

        <Link href="/admin/blog/new">
          <Button className="bg-white hover:bg-neutral-200 text-black font-semibold flex items-center gap-1 text-xs rounded-lg py-4 px-5 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" />
            เขียนบทความใหม่
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="border border-slate-900 bg-slate-900/30 rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="p-3.5 bg-slate-950/40 border border-slate-800 rounded-2xl text-slate-500">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-slate-300">ยังไม่มีบทความใดๆ</h3>
          <p className="text-xs text-slate-500 font-light max-w-xs leading-relaxed">
            เริ่มต้นแชร์ข้อมูล ความรู้เรื่องผ้าสกรีนเสื้อ หรือข่าวสารกิจการของคุณเพื่อช่วยเรื่อง SEO โดยกดปุ่มเขียนบทความใหม่ด้านบน
          </p>
        </div>
      ) : (
        <div className="border border-slate-900 bg-slate-900/10 rounded-xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-900/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-4 px-6">รูปปก</th>
                  <th className="py-4 px-6">หัวข้อบทความ</th>
                  <th className="py-4 px-6">หมวดหมู่</th>
                  <th className="py-4 px-6">สถานะ</th>
                  <th className="py-4 px-6 text-center">ยอดเข้าชม</th>
                  <th className="py-4 px-6 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-900/20 text-slate-300 transition-colors">
                    <td className="py-4 px-6">
                      <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-md overflow-hidden flex items-center justify-center font-bold text-[9px] text-slate-600">
                        {post.coverImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          "No Cover"
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-white max-w-xs truncate">
                      {post.title}
                    </td>
                    <td className="py-4 px-6 font-light">
                      {post.category || "ไม่มีหมวดหมู่"}
                    </td>
                    <td className="py-4 px-6">
                      {post.status === "PUBLISHED" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          เผยแพร่แล้ว
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 border border-slate-700 text-slate-400">
                          ฉบับร่าง
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center font-semibold">
                      <span className="inline-flex items-center gap-1 text-[10px]">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        {post.views}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <button className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </Link>

                      <form action={deletePostFormAction} className="inline">
                        <input type="hidden" name="id" value={post.id} />
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
