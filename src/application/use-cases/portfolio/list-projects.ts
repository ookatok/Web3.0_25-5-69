import { ProjectRepository, ProjectRepositoryOptions } from "@/application/ports/project-repository";
import { Project } from "@/domain/entities/project";

export class ListProjects {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(options: ProjectRepositoryOptions): Promise<{ projects: Project[]; total: number }> {
    return this.projectRepository.findAll(options);
  }
}
