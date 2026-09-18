import { PrismaBlogRepository } from "../../infrastructure/repositories/PrismaBlogRepository";

export class GetBlogBySlugUseCase {
  private readonly repository = new PrismaBlogRepository();

  async execute(slug: string) {
    return this.repository.getBySlug(slug);
  }
}
