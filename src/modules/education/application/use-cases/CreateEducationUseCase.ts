import { CreateEducationDto } from "../dto/CreateEducationDto";
import { PrismaEducationRepository } from "../../infrastructure/repositories/PrismaEducationRepository";

export class CreateEducationUseCase {
  private readonly repository =
    new PrismaEducationRepository();

  async execute(
    data: CreateEducationDto
  ) {
    return this.repository.create(
      data
    );
  }
}