# Layer Guide — รายละเอียดแต่ละชั้นเวลาเขียน slice

> อ่านคู่กับ [SKILL.md](../SKILL.md) และ [rule 09](../../../rules/09-clean-architecture.md)
> เป้าหมาย: รู้ว่าแต่ละชั้น "เขียนอะไรได้/ห้ามเขียนอะไร" และ import จากไหนได้

## domain/ (ชั้นใน — pure TS)
- เก็บ: entity/type, value object (slug, email), domain invariant, domain error
- import ได้จาก: **ไม่มีเลย** (พึ่งตัวเองเท่านั้น)
- ❌ ห้าม import React / Next / Drizzle / NextAuth / zod runtime
- กฎธุรกิจที่เป็นฟังก์ชันบริสุทธิ์อยู่ที่นี่ (เช่น `isPublished(post)`); ห้ามมี side effect / fetch / DOM
- `value-objects/slug.ts` มี `slugify()` ใช้ซ้ำทั้งโปรเจกต์ — อย่าเขียน slug logic ใหม่

## application/ (use case + ports + dto)
- **dto**: zod schema input/output ที่ `dto/<noun>.dto.ts` — type มาจาก `z.infer<typeof schema>` และ reuse ทั้งฝั่งฟอร์มและ server action
- **ports**: interface ของ repository/gateway/hasher (เช่น `PostRepository`, `PasswordHasher`) — application นิยามเอง
- **use-cases**: 1 action = 1 class/function (`create-post.ts`) รับ port ผ่าน constructor (DI)
- import ได้จาก: `domain`, `shared`
- ❌ ห้าม import `infrastructure/` — ขึ้นต่อ port เท่านั้น
- ❌ ห้ามมี Drizzle query / fetch / DOM / React
- `id` สร้างที่นี่ (`crypto.randomUUID()`); business rule (gen slug, set status/publishedAt) อยู่ที่นี่

## infrastructure/ (adapters — ของจริง)
- implement port 1:1 (`DrizzlePostRepository implements PostRepository`)
- Drizzle schema + client, NextAuth config, bcrypt hasher, upload/mail service
- `di/container.ts` = **ที่เดียว** ที่ของจริงมาเจอ interface (composition root)
- import ได้จาก: `application`, `domain`, `shared`
- ❌ ห้าม import `presentation/`
- เข้าถึง `db` (Drizzle) ได้เฉพาะที่นี่

## presentation/ (UI adapters)
- **actions**: Server Action บาง — `requireAdmin → zod.parse → use case → revalidatePath` (ดู skill server-action)
- **components**: UI primitive จาก `components/ui` (shadcn); composed component ที่ `components/<feature>/`
- **hooks**: client hook เท่าที่จำเป็น
- import ได้จาก: `application`, `domain`, `shared`, DI container, `requireAdmin`
- ❌ ห้าม import `infrastructure/` ตรง (ยกเว้น `container` + `requireAdmin` helper)
- ❌ ห้าม Drizzle query / business logic / role check แบบ inline

## app/ (Next.js App Router — routes เท่านั้น)
- Server Component เรียก use case ผ่าน `container` ตรง (ไม่ต้อง `fetch('/api/...')` ตัวเอง)
- ฟอร์ม submit → เรียก Server Action จาก `presentation/actions`
- ทุกหน้า public ใส่ `generateMetadata`; หน้า content ใส่ JSON-LD (rule 05)
- `app/(admin)/admin/layout.tsx` ต้องเรียก `requireAdmin()`

## ลำดับ import ที่ใช้ได้ (สรุป)
```
app/ ─► presentation/ ─► application/ ─► domain/
                              ▲
        infrastructure/ ──────┘  (implements ports + wire ใน di/container.ts)
```

## ตัวอย่าง slice สมบูรณ์ที่ดูได้จริง
ดู "เฟส 4 — ระบบ Blog" ใน [roadmap.md](../../../../roadmap.md) — เป็น slice ที่ครบทุกชั้น ใช้เป็นแม่แบบเวลาไม่แน่ใจ
