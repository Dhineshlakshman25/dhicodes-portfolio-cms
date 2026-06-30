import { PrismaSkillRepository } from "../../infrastructure/repositories/PrismaSkillRepository";

export class GetSkillsUseCase {
  private readonly repository =
    new PrismaSkillRepository();

  async execute() {
    return this.repository.getAll();
  }
}