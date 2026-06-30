import { CreateProjectImageDto } from "../dto/CreateProjectImageDto";
import { PrismaProjectImageRepository } from "../../infrastructure/repositories/PrismaProjectImageRepository";

export class CreateProjectImageUseCase {
  private readonly repository =
    new PrismaProjectImageRepository();

  async execute(
    data: CreateProjectImageDto
  ) {
    return this.repository.create(
      data
    );
  }
}