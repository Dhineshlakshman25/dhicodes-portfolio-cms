import { CreateProfileDto } from "../dto/CreateProfileDto";
import { PrismaProfileRepository } from "../../infrastructure/repositories/PrismaProfileRepository";

export class CreateProfileUseCase {
  private readonly repository =
    new PrismaProfileRepository();

  async execute(
    data: CreateProfileDto
  ) {
    return this.repository.createProfile({
      id: "profile-1",
      ...data,
    });
  }
}