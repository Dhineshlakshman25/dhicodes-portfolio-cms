import { UpdateProfileDto } from "../dto/UpdateProfileDto";
import { PrismaProfileRepository } from "../../infrastructure/repositories/PrismaProfileRepository";

export class UpdateProfileUseCase {
  private readonly repository =
    new PrismaProfileRepository();

  async execute(
    id: string,
    data: UpdateProfileDto
  ) {
    return this.repository.updateProfile(
      id,
      data
    );
  }
}