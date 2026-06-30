import { CreateSkillDto } from "../dto/CreateSkillDto";
import { PrismaSkillRepository } from "../../infrastructure/repositories/PrismaSkillRepository";

export class CreateSkillUseCase {
  private readonly repository =
    new PrismaSkillRepository();

  async execute(
    data: CreateSkillDto
  ) {
    return this.repository.create(
      data
    );
  }
}