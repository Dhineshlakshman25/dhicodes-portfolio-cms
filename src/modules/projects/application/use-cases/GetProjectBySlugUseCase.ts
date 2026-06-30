import { PrismaProjectRepository } from "../../infrastructure/repositories/PrismaProjectRepository";

export class GetProjectBySlugUseCase {
  private readonly repository =
    new PrismaProjectRepository();

  async execute(
    slug: string
  ) {
    return this.repository.getBySlug(
      slug
    );
  }
}