/**
 * @file project.ts
 * @path src/domain/entities/project.ts
 * @description เอนทิตีโครงการผลงาน (Project Entity) ในระดับ Domain Layer กำหนดคุณลักษณะข้อมูลของผลงานของร้าน
 */

export interface ProjectProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  client: string | null;
  category: string | null;
  images: string[];
  coverImage: string | null;
  date: Date | null;
  status: "DRAFT" | "PUBLISHED";
  createdAt: Date;
}

export class Project {
  private constructor(private readonly props: ProjectProps) {}

  public static create(props: ProjectProps): Project {
    return new Project(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get title(): string {
    return this.props.title;
  }

  public get slug(): string {
    return this.props.slug;
  }

  public get description(): string {
    return this.props.description;
  }

  public get client(): string | null {
    return this.props.client;
  }

  public get category(): string | null {
    return this.props.category;
  }

  public get images(): string[] {
    return this.props.images;
  }

  public get coverImage(): string | null {
    return this.props.coverImage;
  }

  public get date(): Date | null {
    return this.props.date;
  }

  public get status(): "DRAFT" | "PUBLISHED" {
    return this.props.status;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public isPublished(): boolean {
    return this.status === "PUBLISHED";
  }

  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      description: this.description,
      client: this.client,
      category: this.category,
      images: this.images,
      coverImage: this.coverImage,
      date: this.date,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
