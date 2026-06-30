import { PrismaExperienceRepository } from "../../infrastructure/repositories/PrismaExperienceRepository";

export class DeleteExperienceUseCase {
  private readonly repository =
    new PrismaExperienceRepository();

  async execute(
    id: number
  ) {
    await this.repository.delete(
      id
    );
  }
}