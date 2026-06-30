import { PrismaEducationRepository } from "../../infrastructure/repositories/PrismaEducationRepository";

export class DeleteEducationUseCase {
  private readonly repository =
    new PrismaEducationRepository();

  async execute(
    id: number
  ) {
    await this.repository.delete(
      id
    );
  }
}