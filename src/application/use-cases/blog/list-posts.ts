import { PostRepository, PostRepositoryOptions } from "@/application/ports/post-repository";
import { Post } from "@/domain/entities/post";

export class ListPosts {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(options: PostRepositoryOptions): Promise<{ posts: Post[]; total: number }> {
    return this.postRepository.findAll(options);
  }
}
