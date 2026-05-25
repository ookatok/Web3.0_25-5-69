import { ProjectRepository } from "@/application/ports/project-repository";

export class DeleteProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
