import { PrismaBlogRepository } from "../../infrastructure/repositories/PrismaBlogRepository";

export class GetPublishedBlogBySlugUseCase {
  private readonly repository = new PrismaBlogRepository();

  async execute(slug: string) {
    return this.repository.getBySlugPublished(slug);
  }
}
