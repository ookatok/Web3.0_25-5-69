/**
 * @file delete-project.ts
 * @path src/application/use-cases/portfolio/delete-project.ts
 * @description ยูสเคส (Use Case) สำหรับลบข้อมูลโครงการผลงานออกจากระบบด้วยไอดี
 */

import { ProjectRepository } from "@/application/ports/project-repository";

export class DeleteProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
