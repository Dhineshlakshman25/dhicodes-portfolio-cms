import { PrismaSkillCategoryRepository } from "../../infrastructure/repositories/PrismaSkillCategoryRepository";

export class DeleteSkillCategoryUseCase {
  private readonly repository =
    new PrismaSkillCategoryRepository();

  async execute(
    id: number
  ) {
    await this.repository.delete(
      id
    );
  }
}