import { PrismaProjectRepository } from "../../infrastructure/repositories/PrismaProjectRepository";

export class GetPublishedProjectBySlugUseCase {
  private readonly repository = new PrismaProjectRepository();

  async execute(slug: string) {
    return this.repository.getBySlugPublished(slug);
  }
}
