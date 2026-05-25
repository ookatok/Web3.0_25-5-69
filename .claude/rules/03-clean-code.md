---
name: rule-clean-code
description: กฏ Clean Code — naming, function size, types, comments, dead code
---

# 3. Clean Code

## TypeScript
- `strict: true` — ห้าม `any`, ห้าม `// @ts-ignore`/`// @ts-expect-error` โดยไม่อธิบายเหตุผล
- ใช้ `unknown` แทน `any` เมื่อยังไม่รู้ type
- Type source of truth ตามลำดับ: `z.infer<typeof schema>` (จาก dto) > Drizzle inferred (`typeof posts.$inferSelect` / `$inferInsert`) > hand-rolled
- ห้าม non-null assertion `!` กับค่าที่อาจ null จริง — ใช้ guard
- Type ที่ใช้ข้ามชั้นวางที่ `domain/` (entity) หรือ `application/dto`

## Naming
- ตัวแปร/ฟังก์ชัน: `camelCase` ความหมายชัด — `postList` ดีกว่า `arr`, `publishedPosts` ดีกว่า `data`
- Boolean: `is`/`has`/`can`/`should` — `isPublished`, `canEdit`
- Component & class: `PascalCase`; constant module-level: `UPPER_SNAKE_CASE` เฉพาะ true constant
- ห้ามย่อจนไม่เข้าใจ (`pst` ❌ `post` ✅)

## Function & Component
- ฟังก์ชันทำหน้าที่เดียว — ยาวเกิน ~60 บรรทัดพิจารณา split
- Argument > 3 ตัว → รวมเป็น object พร้อม type
- Component ที่มี state หลายก้อน → split เป็น sub-component หรือ extract hook
- เห็น `useEffect` ซ้อนหลายก้อน = สัญญาณควร extract hook

## Comments
- Default = ไม่เขียนถ้าโค้ดอ่านเข้าใจอยู่แล้ว
- เขียนเฉพาะ **WHY** ที่ไม่ชัด: constraint, workaround, bug reference, business rule
- ห้ามคอมเมนต์บอก **WHAT** (`// loop posts` แล้ว `posts.forEach`)
- ห้ามทิ้ง `// TODO` ลอย ๆ ไม่มี context, ห้ามทิ้งโค้ด comment-out — ใช้ git log
- ภาษา: ตามไฟล์เดิม (โปรเจกต์นี้ business note ภาษาไทยเป็นหลัก)

## Error Handling
- ห้าม `catch (e) {}` แบบ swallow — log หรือ rethrow
- ห้าม throw string — throw `Error` หรือ custom domain error (`domain/errors`)
- ที่ขอบระบบ (Server Action / route) แปลง error เป็น `{ error: "..." }` พร้อม status เหมาะสม
- validate ที่ boundary เท่านั้น — trust internal code, อย่า validate กรณีที่เป็นไปไม่ได้

## Dead Code & Bloat
- ลบ import/var/function ที่ไม่ใช้ทันที — ห้ามใส่ `_` prefix เลี่ยง warning
- ห้ามคงโค้ด comment-out
- ห้าม abstraction ล่วงหน้าสำหรับ requirement สมมุติ — ซ้ำ 3 ครั้งค่อย extract (ดู rule 7)
- ห้าม backward-compat shim ถ้ายังไม่ release

## React Specific
- Key ใน list ใช้ stable id ห้ามใช้ index ถ้า order เปลี่ยนได้
- `useEffect` dependency array ครบ (ตาม `react-hooks/exhaustive-deps`)
- ห้าม mutate state object/array ตรง — สร้างใหม่
- State ที่ derive ได้ ห้ามเก็บใน `useState` — คำนวณตอน render

## Testing
- ถ้ายังไม่มี test framework — เมื่อแก้ logic สำคัญต้องทดสอบด้วยมือผ่าน browser และระบุใน end-of-turn summary
