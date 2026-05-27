/**
 * @file project-repository.ts
 * @path src/application/ports/project-repository.ts
 * @description อินเตอร์เฟสพอร์ต (Port Interface) สำหรับกระบวนการเข้าถึงฐานข้อมูลของผลงานโครงการ (Project)
 */

import { Project } from "@/domain/entities/project";

export interface ProjectRepositoryOptions {
  limit?: number;
  offset?: number;
  status?: "DRAFT" | "PUBLISHED";
  category?: string;
  search?: string;
}

export interface ProjectRepository {
  findById(id: string): Promise<Project | null>;
  findBySlug(slug: string): Promise<Project | null>;
  save(project: Project): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(options: ProjectRepositoryOptions): Promise<{ projects: Project[]; total: number }>;
}
