/**
 * @file create-project.ts
 * @path src/application/use-cases/portfolio/create-project.ts
 * @description ยูสเคส (Use Case) สำหรับเพิ่มบันทึกผลงานโครงการใหม่เข้าสู่ระบบฐานข้อมูล
 */

import { ProjectRepository } from "@/application/ports/project-repository";
import { Project } from "@/domain/entities/project";
import { CreateProjectInput } from "@/application/dto/project.dto";
import crypto from "crypto";

export class CreateProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<Project> {
    // Generate slug from title
    let slug = input.title
      .toLowerCase()
      .replace(/[^a-z0-9\u0e00-\u0e7f]+/g, "-") // Allow Thai and alphanum
      .replace(/(^-|-$)+/g, "");
    
    if (!slug) {
      slug = crypto.randomUUID();
    }

    // Check uniqueness
    let existing = await this.projectRepository.findBySlug(slug);
    let count = 1;
    const baseSlug = slug;
    while (existing) {
      slug = `${baseSlug}-${count}`;
      existing = await this.projectRepository.findBySlug(slug);
      count++;
    }

    const project = Project.create({
      id: crypto.randomUUID(),
      title: input.title,
      slug,
      description: input.description,
      client: input.client ?? null,
      category: input.category ?? null,
      images: input.images || [],
      coverImage: input.coverImage ?? null,
      date: input.date ?? null,
      status: input.status || "DRAFT",
      createdAt: new Date(),
    });

    await this.projectRepository.save(project);
    return project;
  }
}
