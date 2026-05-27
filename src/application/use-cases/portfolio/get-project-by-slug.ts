/**
 * @file get-project-by-slug.ts
 * @path src/application/use-cases/portfolio/get-project-by-slug.ts
 * @description ยูสเคส (Use Case) ดึงรายละเอียดของผลงานโครงการใดโครงการหนึ่งผ่าน URL Slug
 */

import { ProjectRepository } from "@/application/ports/project-repository";
import { Project } from "@/domain/entities/project";

export class GetProjectBySlug {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(slug: string): Promise<Project | null> {
    return this.projectRepository.findBySlug(slug);
  }
}
