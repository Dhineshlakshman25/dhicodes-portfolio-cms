import { PrismaProjectSkillRepository } from "../../infrastructure/repositories/PrismaProjectSkillRepository";

export class DeleteProjectSkillUseCase {
  private readonly repository =
    new PrismaProjectSkillRepository();

  async execute(
    project_id: string,
    skill_id: number
  ) {
    await this.repository.delete(
      project_id,
      skill_id
    );
  }
}