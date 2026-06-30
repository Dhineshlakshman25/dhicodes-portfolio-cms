import { PrismaSkillRepository } from "../../infrastructure/repositories/PrismaSkillRepository";

export class DeleteSkillUseCase {
  private readonly repository =
    new PrismaSkillRepository();

  async execute(
    id: number
  ) {
    await this.repository.delete(
      id
    );
  }
}