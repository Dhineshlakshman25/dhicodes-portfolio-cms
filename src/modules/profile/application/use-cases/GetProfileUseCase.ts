import { PrismaProfileRepository } from "../../infrastructure/repositories/PrismaProfileRepository";

export class GetProfileUseCase {
  private readonly repository =
    new PrismaProfileRepository();

  async execute() {
    return this.repository.findProfile();
  }
}