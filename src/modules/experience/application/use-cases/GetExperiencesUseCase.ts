import { PrismaExperienceRepository } from "../../infrastructure/repositories/PrismaExperienceRepository";

export class GetExperiencesUseCase {
  private readonly repository =
    new PrismaExperienceRepository();

  async execute() {
    return this.repository.getAll();
  }
}