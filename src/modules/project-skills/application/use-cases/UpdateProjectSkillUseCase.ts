import { UpdateProjectSkillDto } from "../dto/UpdateProjectSkillDto";
import { PrismaProjectSkillRepository } from "../../infrastructure/repositories/PrismaProjectSkillRepository";

export class UpdateProjectSkillUseCase {
  private readonly repository =
    new PrismaProjectSkillRepository();

  async execute(
    project_id: string,
    skill_id: number,
    data: UpdateProjectSkillDto
  ) {
    return this.repository.update(
      project_id,
      skill_id,
      data
    );
  }
}