"use server";

/**
 * @file contact.actions.ts
 * @path src/presentation/actions/contact.actions.ts
 * @description Server Actions สำหรับการส่งข้อมูลติดต่อของฝั่งผู้ใช้ทั่วไป และลบข้อความกล่องจดหมายของฝั่งผู้ดูแลระบบ
 */


import { requireAdmin } from "@/infrastructure/auth/require-admin";
import { createContactSchema } from "@/application/dto/contact.dto";
import { container } from "@/infrastructure/di/container";
import { revalidatePath } from "next/cache";

import { ZodError } from "zod";

export async function createContactAction(input: unknown) {
  try {
    // 1. Validate inputs via Zod
    const data = createContactSchema.parse(input);

    // 2. Execute usecase
    const contact = await container.createContact.execute(data);

    // 3. Revalidate admin messages list
    revalidatePath("/admin/contacts");

    return { success: true, data: contact.toJSON() };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues[0]?.message || "ข้อมูลไม่ถูกต้อง" };
    }
    const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการส่งข้อความ";
    return { success: false, error: message };
  }
}

export async function deleteContactAction(id: string) {
  // 1. Auth check
  await requireAdmin();

  // 2. Execute repository delete
  await container.contactRepository.delete(id);

  // 3. Revalidate admin messages list
  revalidatePath("/admin/contacts");

  return { success: true };
}

export async function deleteContactFormAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;
  await deleteContactAction(id);
}
