import { UpdateExperienceDto } from "../dto/UpdateExperienceDto";
import { PrismaExperienceRepository } from "../../infrastructure/repositories/PrismaExperienceRepository";

export class UpdateExperienceUseCase {
  private readonly repository =
    new PrismaExperienceRepository();

  async execute(
    id: number,
    data: UpdateExperienceDto
  ) {
    return this.repository.update(
      id,
      data
    );
  }
}