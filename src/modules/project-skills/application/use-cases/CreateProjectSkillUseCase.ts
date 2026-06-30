import { CreateProjectSkillDto } from "../dto/CreateProjectSkillDto";
import { PrismaProjectSkillRepository } from "../../infrastructure/repositories/PrismaProjectSkillRepository";

export class CreateProjectSkillUseCase {
  private readonly repository =
    new PrismaProjectSkillRepository();

  async execute(
    data: CreateProjectSkillDto
  ) {
    return this.repository.create(
      data
    );
  }
}