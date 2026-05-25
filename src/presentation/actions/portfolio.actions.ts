"use server";

import { requireAdmin } from "@/infrastructure/auth/require-admin";
import { createProjectSchema, updateProjectSchema } from "@/application/dto/project.dto";
import { container } from "@/infrastructure/di/container";
import { uploadService } from "@/infrastructure/services/upload-service";
import { revalidatePath } from "next/cache";

export async function createProjectAction(input: unknown) {
  // 1. Auth check
  await requireAdmin();

  // 2. Validate input
  const data = createProjectSchema.parse(input);

  // 3. Execute use case
  const project = await container.createProject.execute(data);

  // 4. Revalidate
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");

  return { success: true, data: project.toJSON() };
}

export async function updateProjectAction(input: unknown) {
  // 1. Auth check
  await requireAdmin();

  // 2. Validate input
  const data = updateProjectSchema.parse(input);

  // 3. Execute usecase
  const project = await container.updateProject.execute(data);

  // 4. Revalidate
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${project.slug}`);
  revalidatePath("/admin/portfolio");

  return { success: true, data: project.toJSON() };
}

export async function deleteProjectAction(id: string) {
  // 1. Auth check
  await requireAdmin();

  // 2. Execute usecase
  const project = await container.projectRepository.findById(id);
  if (project) {
    await container.deleteProject.execute(id);
    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${project.slug}`);
    revalidatePath("/admin/portfolio");
  }

  return { success: true };
}

export async function deleteProjectFormAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;
  await deleteProjectAction(id);
}

export async function uploadProjectImageAction(formData: FormData) {
  try {
    // 1. Auth check
    await requireAdmin();

    // 2. Get file
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "ไม่พบไฟล์ที่อัปโหลด" };
    }

    // 3. Upload
    const result = await uploadService.validateAndUpload(file);
    return { success: true, url: result.filePath };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอัปโหลดไฟล์";
    return { success: false, error: message };
  }
}
