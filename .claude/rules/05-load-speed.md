---
name: rule-load-speed
description: กฏ load speed — bundle size, code split, caching, SSR/ISR, Drizzle query, SEO
---

# 5. Load Speed

## Bundle Size
- ก่อน import library ใหม่ เช็กขนาดที่ https://bundlephobia.com — > 50KB gzipped ต้องคิดทบทวน
- ใช้ named import เสมอ — tree-shake ดีกว่า
- ห้าม `import _ from 'lodash'` ทั้งก้อน — ใช้ `lodash-es` named import หรือเขียนเองถ้าไม่กี่บรรทัด
- icon ใช้ `lucide-react` named import ทีละตัว (เข้ากับ shadcn) — ห้าม import ทั้งชุด
- **bcrypt / Drizzle / NextAuth server config ห้ามหลุดเข้า client bundle** — เก็บใน server-only modules

## Code Splitting
- Component หนัก/นาน ๆ ใช้ที (Tiptap editor, modal, chart) → `dynamic(() => import('...'))` ตามเหมาะสม
- Route-based split เกิดอัตโนมัติจาก App Router — ห้ามรวมหลาย route เป็นไฟล์เดียว

## Server Components & Streaming
- Default = Server Component → ไม่ส่ง JS ของ component นั้นไป client
- Suspense + `loading.tsx` ทำ streaming ให้ TTFB ดีขึ้น
- ใน Server Component เรียก use case ตรง (ผ่าน DI) — **ไม่ต้อง** `fetch('/api/...')` ตัวเอง (เลี่ยง waterfall)

## Caching & Rendering Strategy
- หน้า public ที่เปลี่ยนช้า (blog, portfolio, services) → static/ISR ด้วย `revalidate` หรือ tag-based revalidate
- หลัง mutation (Server Action) เรียก `revalidatePath()` / `revalidateTag()` ให้หน้า public อัปเดต
- ถ้าใช้ TanStack Query (เฉพาะ admin ฝั่ง client) ตั้ง `staleTime`/`gcTime` ให้สมเหตุสมผล (default v5 = 0)

## Database Query (Drizzle + MariaDB)
- N+1: ใช้ relational query / join — ห้าม loop query
- หน้ารายการ → pagination เสมอ (`limit`/`offset` หรือ cursor) ห้ามดึงทั้งตาราง
- เลือกเฉพาะ column ที่ใช้จริง (`columns: {...}` / `.select({...})`) ลด payload
- ใส่ index ที่ column ที่ใช้ filter/sort บ่อย (slug, status, publishedAt) ใน schema

## CSS & Tailwind v4
- Tailwind v4 ตัด unused อัตโนมัติ — ห้าม `safelist` รวมทั้งโลก
- ห้าม inline style สำหรับสิ่งที่ทำด้วย utility ได้; หลีกเลี่ยง global CSS ใหญ่

## Fonts
- `next/font` เท่านั้น, `display: 'swap'`, โหลดเฉพาะ weight ที่ใช้จริง

## Third-party Scripts
- โหลดผ่าน `next/script` ด้วย strategy `lazyOnload`/`afterInteractive`; analytics/chat widget ห้ามใส่ `<head>` แบบ sync

## SEO (สำคัญสำหรับเว็บธุรกิจ)
- ทุกหน้า public ใส่ `generateMetadata` (title/description/canonical/OG image)
- มี `app/sitemap.ts` + `app/robots.ts`
- หน้า blog/portfolio ใส่ JSON-LD structured data ที่เหมาะสม (Article / CreativeWork)

## Network
- หลีกเลี่ยง redirect chain — ทำ canonical ให้จบ hop เดียว

## Build Verify
- หลังแก้ที่กระทบ import structure: รัน `npm run build` ตรวจ bundle + error
