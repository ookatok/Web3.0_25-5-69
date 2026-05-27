/**
 * @file update-project.ts
 * @path src/application/use-cases/portfolio/update-project.ts
 * @description ยูสเคส (Use Case) อัปเดตรายละเอียดของโครงการผลงานที่มีอยู่ในฐานข้อมูล
 */

import { ProjectRepository } from "@/application/ports/project-repository";
import { Project } from "@/domain/entities/project";
import { UpdateProjectInput } from "@/application/dto/project.dto";
import crypto from "crypto";

export class UpdateProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: UpdateProjectInput): Promise<Project> {
    const project = await this.projectRepository.findById(input.id);
    if (!project) {
      throw new Error("ไม่พบข้อมูลผลงานที่ต้องการแก้ไข");
    }

    let slug = project.slug;
    if (input.title && input.title !== project.title) {
      slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9\u0e00-\u0e7f]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      
      if (!slug) {
        slug = crypto.randomUUID();
      }

      let existing = await this.projectRepository.findBySlug(slug);
      let count = 1;
      const baseSlug = slug;
      while (existing && existing.id !== project.id) {
        slug = `${baseSlug}-${count}`;
        existing = await this.projectRepository.findBySlug(slug);
        count++;
      }
    }

    const updatedProject = Project.create({
      id: project.id,
      title: input.title ?? project.title,
      slug: slug,
      description: input.description ?? project.description,
      client: input.client !== undefined ? input.client : project.client,
      category: input.category !== undefined ? input.category : project.category,
      images: input.images ?? project.images,
      coverImage: input.coverImage !== undefined ? input.coverImage : project.coverImage,
      date: input.date !== undefined ? input.date : project.date,
      status: input.status ?? project.status,
      createdAt: project.createdAt,
    });

    await this.projectRepository.save(updatedProject);
    return updatedProject;
  }
}
