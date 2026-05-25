import { PostRepository } from "@/application/ports/post-repository";
import { UpdatePostInput } from "@/application/dto/post.dto";
import { Post } from "@/domain/entities/post";

export class UpdatePost {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(input: UpdatePostInput): Promise<Post> {
    const existing = await this.postRepository.findById(input.id);
    if (!existing) {
      throw new Error("Post not found");
    }

    let publishedAt = existing.publishedAt;
    if (input.status === "PUBLISHED" && !existing.publishedAt) {
      publishedAt = new Date();
    } else if (input.status === "DRAFT") {
      publishedAt = null; // Revert to draft
    }

    const updatedPost = Post.create({
      id: existing.id,
      title: input.title !== undefined ? input.title : existing.title,
      slug: existing.slug, // Keep slug stable
      excerpt: input.excerpt !== undefined ? input.excerpt : existing.excerpt,
      content: input.content !== undefined ? input.content : existing.content,
      coverImage: input.coverImage !== undefined ? input.coverImage : existing.coverImage,
      category: input.category !== undefined ? input.category : existing.category,
      tags: input.tags !== undefined ? input.tags : existing.tags,
      status: input.status !== undefined ? input.status : existing.status,
      views: existing.views,
      publishedAt,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.postRepository.save(updatedPost);
    return updatedPost;
  }
}
