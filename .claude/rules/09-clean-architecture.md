---
name: rule-clean-architecture
description: Clean Architecture 4 ชั้น (domain/application/infrastructure/presentation) + ports + DI
---

# 9. Clean Architecture (4-layer + Ports)

โปรเจกต์นี้ใช้ **Clean Architecture แบบ layer-first 4 ชั้น** ตาม [../../ARCHITECTURE.md](../../ARCHITECTURE.md)
ทุก feature ใหม่ **ต้อง** ทำตาม pattern นี้ ห้ามเขียน logic ปนกันเป็น god file/god action

## โครงสร้างมาตรฐาน
```
src/
  domain/            # entity, value object, domain error — pure TS
  application/
    ports/           # interface ของ repository/gateway/hasher
    dto/             # zod schema (input/output)
    use-cases/       # 1 action = 1 use case (blog/, portfolio/, auth/)
  infrastructure/
    db/              # drizzle schema + client + seed
    repositories/    # implement ports ด้วย Drizzle
    auth/            # auth.config.ts (edge), auth.ts (node+bcrypt), bcrypt-password-hasher.ts
    services/        # upload, mail
    di/container.ts  # composition root: ผูก port -> impl
  presentation/
    actions/         # Server Actions ("use server") = controller บาง ๆ
    components/      # ui/ (shadcn) + <feature>/
    hooks/
  shared/            # config/env (zod), utils, result
  app/               # routes เท่านั้น
```

## Dependency Rule (เข้มงวด — ตรวจทุก PR)
**ทิศทาง import ชี้เข้าด้านในเท่านั้น ห้ามย้อน**
```
app/ ─► presentation/ ─► application/ ─► domain/
                              ▲
        infrastructure/ ──────┘  (implements ports จาก application/)
        di/container.ts  ผูก infrastructure เข้ากับ application ที่ชั้น app/presentation
```

กฏห้าม (เด็ดขาด):
- ❌ `domain/` import จาก `application/`/`infrastructure/`/`presentation/` หรือ external lib (React, Next, Drizzle, NextAuth, zod runtime) — **pure TS เท่านั้น**
- ❌ `application/` import จาก `infrastructure/` — ต้อง depend บน **port (interface)** ที่ตัวเองนิยาม
- ❌ `infrastructure/` import จาก `presentation/`
- ❌ `presentation/`/`app/` เรียก `db` (Drizzle) หรือ repository concrete ตรง — ผ่าน use case (ดึงจาก DI container)
- ❌ Server Action / route handler ใส่ business logic, Drizzle query, หรือ role check แบบ inline

## หน้าที่แต่ละชั้น
### `domain/`
- entity/type, value object (slug, email), domain invariant, domain error
- pure TypeScript — copy ไป Node/browser ก็รันได้

### `application/`
- **use case**: 1 function/class ต่อ 1 action (`create-post.ts`, `verify-credentials.ts`)
- **ports**: interface ของ repository/gateway/hasher (`PostRepository`, `PasswordHasher`)
- **dto**: zod schema input/output
- ห้ามมี Drizzle query / fetch / DOM / React

### `infrastructure/`
- implement port 1:1 (`DrizzlePostRepository implements PostRepository`)
- Drizzle schema + client, NextAuth config, bcrypt hasher, upload/mail service
- `di/container.ts` คือ **ที่เดียว** ที่ของจริงมาเจอ interface

### `presentation/`
- **actions**: Server Action บาง — `เช็ก session → zod parse → use case → revalidatePath`
- **components**: Server/Client component (UI primitive จาก `components/ui` = shadcn)
- **hooks**: client hook เท่าที่จำเป็น
- ห้าม import `infrastructure/` ตรง

## Server Action Pattern (ตัวเขียนหลักของโปรเจกต์)
```ts
// presentation/actions/blog.actions.ts
"use server";
import { requireAdmin } from "@/infrastructure/auth/require-admin";
import { createPostSchema } from "@/application/dto/post.dto";
import { container } from "@/infrastructure/di/container";
import { revalidatePath } from "next/cache";

export async function createPostAction(input: unknown) {
  await requireAdmin();                          // 1) auth
  const data = createPostSchema.parse(input);    // 2) validate
  const post = await container.createPost.execute(data); // 3) use case
  revalidatePath("/blog");                        // 4) revalidate
  return { data: post };
}
```
ห้าม: business logic / Drizzle / role check แบบ ad-hoc ในไฟล์นี้

## Server Component Pattern (อ่าน)
```tsx
// app/(public)/blog/[slug]/page.tsx
import { container } from "@/infrastructure/di/container";
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await container.getPostBySlug.execute(params.slug);
  return <ArticleView post={post} />;
}
```

## Use Case + DI
```ts
// application/use-cases/blog/create-post.ts
import type { PostRepository } from "@/application/ports/post-repository";
export class CreatePost {
  constructor(private readonly posts: PostRepository) {}
  async execute(input: CreatePostInput) { /* gen slug, set status, posts.save(...) */ }
}
// infrastructure/di/container.ts
const postRepo = new DrizzlePostRepository(db);
export const container = { createPost: new CreatePost(postRepo) /* ... */ };
```

## Naming
- Use case: verb-noun → `create-post.ts`, `delete-project.ts`
- Port: noun + `Repository`/`Gateway`/`Hasher`
- Adapter: `Drizzle` + ชื่อ port → `DrizzlePostRepository`
- Schema: noun + `Schema` → `createPostSchema`
- Server Action: verb + `Action` → `createPostAction`

## Checklist ก่อนสร้าง/รีวิว feature (ต้อง "ใช่" ทุกข้อ)
- [ ] `domain/` ไม่ import React/Next/Drizzle/NextAuth/zod runtime
- [ ] `application/` ขึ้นต่อ port (interface) ไม่ขึ้นต่อ Drizzle concrete
- [ ] `infrastructure/` implement port 1:1 และ wire ใน `di/container.ts`
- [ ] `presentation/` ไม่ import `infrastructure/` ตรง; Server Action บางตาม pattern
- [ ] มี zod dto สำหรับ input/output ทุกขอบ
- [ ] mutation เรียก `revalidatePath`/`revalidateTag` ที่เกี่ยว

## ข้อยกเว้น (เมื่อ pattern หนักเกิน)
- หน้า public read-only ที่ดึง config ง่าย ๆ → อาจมีแค่ Server Component + use case บาง
- one-off script → อยู่ `scripts/` ไม่ต้องเข้า layer
- pure UI component ข้าม feature → `presentation/components/`
ถ้าไม่แน่ใจ → ทำเต็ม pattern ก่อน

## ห้ามทำ
- ❌ business logic ใน Server Action / route handler
- ❌ import `db` ใน `domain/`/`presentation/`
- ❌ re-export `db`/Drizzle model ออกนอก infrastructure
- ❌ ใส่ React component ใน `domain/`/`application/`
- ❌ Drizzle query ใน `application/` (ต้องผ่าน port)
