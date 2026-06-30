import { PrismaProjectSkillRepository } from "../../infrastructure/repositories/PrismaProjectSkillRepository";

export class GetProjectSkillsUseCase {
  private readonly repository =
    new PrismaProjectSkillRepository();

  async execute() {
    return this.repository.getAll();
  }
}