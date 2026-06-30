import { UpdateSkillDto } from "../dto/UpdateSkillDto";
import { PrismaSkillRepository } from "../../infrastructure/repositories/PrismaSkillRepository";

export class UpdateSkillUseCase {
  private readonly repository =
    new PrismaSkillRepository();

  async execute(
    id: number,
    data: UpdateSkillDto
  ) {
    return this.repository.update(
      id,
      data
    );
  }
}