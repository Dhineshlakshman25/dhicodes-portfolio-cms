import { CreateProjectDto } from "../dto/CreateProjectDto";
import { PrismaProjectRepository } from "../../infrastructure/repositories/PrismaProjectRepository";

export class CreateProjectUseCase {
  private readonly repository =
    new PrismaProjectRepository();

  async execute(
    data: CreateProjectDto
  ) {
    return this.repository.create(
      data
    );
  }
}