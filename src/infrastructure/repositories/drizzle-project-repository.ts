import { ProjectRepository, ProjectRepositoryOptions } from "@/application/ports/project-repository";
import { Project } from "@/domain/entities/project";
import { DbType } from "@/infrastructure/db/client";
import { projects } from "@/infrastructure/db/schema/projects";
import { eq, desc, and, like, sql } from "drizzle-orm";

export class DrizzleProjectRepository implements ProjectRepository {
  constructor(private readonly db: DbType) {}

  private mapToDomain(row: typeof projects.$inferSelect): Project {
    let parsedImages: string[] = [];
    if (typeof row.images === "string") {
      try {
        parsedImages = JSON.parse(row.images);
      } catch {
        parsedImages = [];
      }
    } else if (Array.isArray(row.images)) {
      parsedImages = row.images;
    }

    return Project.create({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      client: row.client,
      category: row.category,
      images: parsedImages,
      coverImage: row.coverImage,
      date: row.date,
      status: row.status as "DRAFT" | "PUBLISHED",
      createdAt: row.createdAt,
    });
  }

  async findById(id: string): Promise<Project | null> {
    const result = await this.db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }
    return this.mapToDomain(result[0]);
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const result = await this.db
      .select()
      .from(projects)
      .where(eq(projects.slug, slug))
      .limit(1);

    if (result.length === 0) {
      return null;
    }
    return this.mapToDomain(result[0]);
  }

  async save(project: Project): Promise<void> {
    await this.db
      .insert(projects)
      .values({
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        client: project.client,
        category: project.category,
        images: project.images,
        coverImage: project.coverImage,
        date: project.date,
        status: project.status,
        createdAt: project.createdAt,
      })
      .onDuplicateKeyUpdate({
        set: {
          title: project.title,
          slug: project.slug,
          description: project.description,
          client: project.client,
          category: project.category,
          images: project.images,
          coverImage: project.coverImage,
          date: project.date,
          status: project.status,
        },
      });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(projects).where(eq(projects.id, id));
  }

  async findAll(options: ProjectRepositoryOptions): Promise<{ projects: Project[]; total: number }> {
    const whereClauses = [];

    if (options.status) {
      whereClauses.push(eq(projects.status, options.status));
    }
    if (options.category) {
      whereClauses.push(eq(projects.category, options.category));
    }
    if (options.search) {
      whereClauses.push(like(projects.title, `%${options.search}%`));
    }

    const where = whereClauses.length > 0 ? and(...whereClauses) : undefined;

    // Fetch total count
    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(where);
    
    const total = Number(countResult[0]?.count || 0);

    // Fetch paginated results
    const query = this.db
      .select()
      .from(projects)
      .where(where)
      .orderBy(desc(projects.createdAt));

    if (options.limit !== undefined) {
      query.limit(options.limit);
    }
    if (options.offset !== undefined) {
      query.offset(options.offset);
    }

    const rows = await query;
    return {
      projects: rows.map((row) => this.mapToDomain(row)),
      total,
    };
  }
}
