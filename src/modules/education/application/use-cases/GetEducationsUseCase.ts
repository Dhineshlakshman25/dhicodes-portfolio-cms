import { PrismaEducationRepository } from "../../infrastructure/repositories/PrismaEducationRepository";

export class GetEducationsUseCase {
  private readonly repository =
    new PrismaEducationRepository();

  async execute() {
    return this.repository.getAll();
  }
}