/**
 * @file list-projects.ts
 * @path src/application/use-cases/portfolio/list-projects.ts
 * @description ยูสเคส (Use Case) แสดงรายการผลงานโครงการทั้งหมด สามารถกรองแยกประเภทหมวดหมู่ได้
 */

import { ProjectRepository, ProjectRepositoryOptions } from "@/application/ports/project-repository";
import { Project } from "@/domain/entities/project";

export class ListProjects {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(options: ProjectRepositoryOptions): Promise<{ projects: Project[]; total: number }> {
    return this.projectRepository.findAll(options);
  }
}
