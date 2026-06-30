import { UpdateSkillCategoryDto } from "../dto/UpdateSkillCategoryDto";
import { PrismaSkillCategoryRepository } from "../../infrastructure/repositories/PrismaSkillCategoryRepository";

export class UpdateSkillCategoryUseCase {
  private readonly repository =
    new PrismaSkillCategoryRepository();

  async execute(
    id: number,
    data: UpdateSkillCategoryDto
  ) {
    return this.repository.update(
      id,
      data
    );
  }
}