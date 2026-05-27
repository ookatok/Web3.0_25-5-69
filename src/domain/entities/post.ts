/**
 * @file post.ts
 * @path src/domain/entities/post.ts
 * @description เอนทิตีบทความ (Post Entity) ในระดับ Domain Layer กำหนดข้อมูลและคุณลักษณะหลักของบทความบล็อก
 */

export interface PostProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string; // HTML content from Tiptap editor
  coverImage: string | null;
  category: string | null;
  tags: string[];
  status: "DRAFT" | "PUBLISHED";
  views: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Post {
  private constructor(private readonly props: PostProps) {}

  public static create(props: PostProps): Post {
    return new Post(props);
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

  public get excerpt(): string | null {
    return this.props.excerpt;
  }

  public get content(): string {
    return this.props.content;
  }

  public get coverImage(): string | null {
    return this.props.coverImage;
  }

  public get category(): string | null {
    return this.props.category;
  }

  public get tags(): string[] {
    return this.props.tags;
  }

  public get status(): "DRAFT" | "PUBLISHED" {
    return this.props.status;
  }

  public get views(): number {
    return this.props.views;
  }

  public get publishedAt(): Date | null {
    return this.props.publishedAt;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public isPublished(): boolean {
    if (this.status !== "PUBLISHED") {
      return false;
    }
    if (!this.publishedAt) {
      return false;
    }
    return this.publishedAt.getTime() <= Date.now();
  }

  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      excerpt: this.excerpt,
      content: this.content,
      coverImage: this.coverImage,
      category: this.category,
      tags: this.tags,
      status: this.status,
      views: this.views,
      publishedAt: this.publishedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
