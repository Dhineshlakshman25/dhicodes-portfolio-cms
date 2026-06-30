import { CreateExperienceDto } from "../dto/CreateExperienceDto";
import { PrismaExperienceRepository } from "../../infrastructure/repositories/PrismaExperienceRepository";

export class CreateExperienceUseCase {
  private readonly repository =
    new PrismaExperienceRepository();

  async execute(
    data: CreateExperienceDto
  ) {
    return this.repository.create(
      data
    );
  }
}