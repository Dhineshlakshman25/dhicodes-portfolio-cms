import { PrismaSkillCategoryRepository } from "../../infrastructure/repositories/PrismaSkillCategoryRepository";

export class GetSkillCategoriesUseCase {
  private readonly repository =
    new PrismaSkillCategoryRepository();

  async execute() {
    return this.repository.getAll();
  }
}