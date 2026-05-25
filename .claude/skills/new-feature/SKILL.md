---
name: new-feature
description: สร้าง feature/slice ใหม่แบบครบ 4 ชั้นตาม Clean Architecture ของโปรเจกต์ web3.0 (domain → application → infrastructure → presentation → app). ใช้ skill นี้ทุกครั้งที่ผู้ใช้ขอ "เพิ่มระบบ X", "ทำ CRUD Y", "สร้าง entity / use case / repository / server action ใหม่", หรือแก้ feature ที่กระทบตั้งแต่ 2 ชั้นขึ้นไป แม้ผู้ใช้จะไม่พูดคำว่า "slice" หรือ "clean architecture" ตรง ๆ ก็ตาม. ใช้คู่กับ rule 09 (clean-architecture) และ rule 10 (feature-change-protocol) เสมอ
---

# New Feature — Vertical Slice (Clean Architecture)

สร้าง/แก้ feature โดยไล่ทั้ง slice เป็นเส้นเดียว: **domain → application → infrastructure → presentation → app**
และ **ห้ามทิ้ง dead code** (กวาดทั้ง BE + FE ก่อนจบ)

> อ้างอิงกฏหลัก: [rule 09](../../rules/09-clean-architecture.md) (โครงสร้าง/ทิศทาง dependency), [rule 10](../../rules/10-feature-change-protocol.md) (protocol แก้ feature), [rule 07](../../rules/07-reusability.md) (Rule of Three), [ARCHITECTURE.md](../../../ARCHITECTURE.md), [roadmap.md](../../../roadmap.md) (data model + เฟส)

## เมื่อไหร่ใช้ skill นี้
- ผู้ใช้ขอเพิ่มระบบ/โมดูลใหม่ (เช่น "เพิ่มระบบรีวิว", "ทำหน้า service CRUD")
- ผู้ใช้ขอเพิ่ม use case / repository / server action / หน้า admin ที่ผูกกับ entity หนึ่ง
- การแก้ที่กระทบตั้งแต่ 2 ชั้นขึ้นไป (เช่น เพิ่ม field ที่ต้องไหลจาก form → DB)

ข้ามได้เฉพาะ: bug fix 1–2 บรรทัด, เปลี่ยนสี/typo (ดูข้อยกเว้น rule 10)

## หลักการที่ห้ามพลาด (จาก rule 09)
- **Dependency ชี้เข้าด้านในเท่านั้น**: `app → presentation → application → domain`; `infrastructure` implement port แล้ว wire ที่ `di/container.ts`
- `domain/` = pure TS — ห้าม import React / Next / Drizzle / NextAuth / zod runtime
- `application/` ขึ้นต่อ **port (interface)** ไม่ใช่ Drizzle concrete
- `presentation/` / `app/` **ห้ามเรียก `db` ตรง** — ผ่าน use case ที่ดึงจาก DI container
- Server Action **บาง**: `requireAdmin → zod.parse → use case → revalidatePath` (business logic อยู่ใน use case)
- `id` เป็น `varchar(36)` (uuid/cuid) **สร้างใน use case** ไม่ใช่ใน DB
- ทุก boundary มี zod dto; ทุก mutation ต้อง `revalidatePath`/`revalidateTag`

## Workflow (ทำตามลำดับ — อย่าข้าม)

### Phase 0 — Map the slice (ก่อนแตะโค้ด)
ใช้ Grep/Glob/Read (หรือ subagent `Explore`) ตอบให้ครบก่อนเขียน — **ห้ามเดา**:
1. มี entity/value-object เดิมที่เกี่ยวไหม? (`src/domain/`)
2. มี port / use case / zod dto เดิมที่ reuse ได้ไหม? (rule 07: ค้นก่อนสร้าง)
3. ตาราง Drizzle ที่เกี่ยว: column ไหนถูกอ่าน/เขียน? (`src/infrastructure/db/schema/`)
4. entry point ฝั่งเขียนคือ Server Action ตัวไหน? มี `requireAdmin()` แล้วหรือยัง?
5. ฝั่งอ่าน: หน้าไหน render (`app/(public)/...` หรือ `app/(admin)/admin/...`)? หลัง mutation ต้อง revalidate หน้าไหน?

ดูรายละเอียด Phase 0 เต็มใน [rule 10](../../rules/10-feature-change-protocol.md)

### Phase 1 — Plan
- กระทบชั้นไหนบ้าง? extend use case/port เดิมได้ หรือต้องตัวใหม่?
- เปลี่ยน zod dto → Grep หา caller ก่อน
- ตาราง DB เปลี่ยนไหม? ถ้าใช่ → ใช้ skill **db-migration** (แก้ schema แล้วหยุด ให้ user รัน drizzle-kit เอง)
- component ใหม่เป็น Server หรือ Client? (default = Server, ดู rule 04)

### Phase 2 — Implement (ไล่จากในออกนอก)
คัดลอกแม่แบบจาก `templates/` แล้วแทนที่ placeholder (ดูตารางด้านล่าง). รายละเอียดแต่ละชั้นอยู่ใน [references/layer-guide.md](references/layer-guide.md)

1. **domain** — `templates/entity.ts.tmpl` → `src/domain/entities/{{entity-kebab}}.ts` (reuse `value-objects/slug.ts`)
2. **application/dto** — `templates/dto.ts.tmpl` → `src/application/dto/{{entity-kebab}}.dto.ts`
3. **application/ports** — `templates/port.ts.tmpl` → `src/application/ports/{{entity-kebab}}-repository.ts`
4. **application/use-cases** — `templates/use-case.ts.tmpl` → `src/application/use-cases/{{feature}}/create-{{entity-kebab}}.ts` (ทำซ้ำสำหรับ update/delete/list/get)
5. **infrastructure/db/schema** — แก้ schema ผ่าน skill **db-migration** → **หยุด แจ้ง user รัน migrate**
6. **infrastructure/repositories** — `templates/drizzle-repository.ts.tmpl` → `src/infrastructure/repositories/drizzle-{{entity-kebab}}-repository.ts`
7. **infrastructure/di** — wire ใน `src/infrastructure/di/container.ts` (ดู `templates/container-wiring.ts.tmpl`)
8. **presentation/actions** — `templates/actions.ts.tmpl` → `src/presentation/actions/{{feature}}.actions.ts` (หรือใช้ skill **server-action**)
9. **presentation/components** — UI primitive จาก shadcn (ใช้ skill **add-shadcn-ui**); form = `react-hook-form + zod` reuse dto จากข้อ 2
10. **app** — route page ใน `app/(public)/...` และ/หรือ `app/(admin)/admin/...` (Server Component เรียก use case ผ่าน container)

### Phase 3 — Sweep dead code (บังคับ)
หลังเขียนเสร็จ **ต้อง** กวาด dead code ของ slice ที่แตะ ก่อน mark task เสร็จ:
- use case / port method / repo method / route / dto / hook / component ที่ Grep แล้วไม่มี caller → ลบ
- unused import ทุกตัวที่ ESLint เตือน → ลบ (ห้ามใส่ `_` prefix หรือ `eslint-disable` กลบ)
- Drizzle column ที่ไม่มีใครอ้างถึง → **แจ้ง user** (อย่ารัน drizzle-kit เอง)
- ดูเช็กลิสต์ Phase 3 เต็มใน [rule 10](../../rules/10-feature-change-protocol.md)

### Phase 4 — Verify
- `npm run build` (type + build ผ่าน) และ `npm run lint`
- UI เปลี่ยน → `npm run dev` ทดสอบ golden path + edge case ใน browser
- DB schema เปลี่ยน → **แจ้งคำสั่ง drizzle-kit ให้ user รันเอง** (`npm run db:generate` → `npm run db:migrate`)
- สรุป end-of-turn 1–2 ประโยค: เปลี่ยนอะไร + กวาด dead code อะไรไป

## ตาราง Placeholder (แทนที่ในทุก template)

| token | ความหมาย | ตัวอย่าง (entity = Service) |
|-------|----------|----------------------------|
| `{{Entity}}` | PascalCase เอกพจน์ | `Service` |
| `{{entity}}` | camelCase เอกพจน์ | `service` |
| `{{entity-kebab}}` | kebab ชื่อไฟล์/slug | `service` |
| `{{entities}}` | plural (ชื่อตาราง Drizzle + path public) | `services` |
| `{{feature}}` | โฟลเดอร์ use-case (กลุ่มงาน) | `services` |

> แม่แบบจริงในโปรเจกต์ = ระบบ **Blog** (เฟส 4 ใน roadmap) — entity `Post`, feature `blog`, ตาราง `posts`

## Checklist ปิด slice (ต้อง "ใช่" ทุกข้อ — จาก rule 09)
- [ ] `domain/` ไม่ import React/Next/Drizzle/NextAuth/zod runtime
- [ ] `application/` ขึ้นต่อ port ไม่ใช่ Drizzle concrete
- [ ] `infrastructure/` implement port 1:1 + wire ใน `di/container.ts`
- [ ] `presentation/`/`app/` ไม่ import `infrastructure/` ตรง (ยกเว้น `requireAdmin` + `container`); Server Action บาง
- [ ] มี zod dto ทุก boundary
- [ ] mutation เรียก `revalidatePath`/`revalidateTag`
- [ ] กวาด dead code (BE + FE) แล้ว
- [ ] `npm run build` + `npm run lint` ผ่าน + ทดสอบ browser
