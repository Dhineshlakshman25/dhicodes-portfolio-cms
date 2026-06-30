import { CreateSkillCategoryDto } from "../dto/CreateSkillCategoryDto";
import { PrismaSkillCategoryRepository } from "../../infrastructure/repositories/PrismaSkillCategoryRepository";

export class CreateSkillCategoryUseCase {
  private readonly repository =
    new PrismaSkillCategoryRepository();

  async execute(
    data: CreateSkillCategoryDto
  ) {
    return this.repository.create(
      data
    );
  }
}