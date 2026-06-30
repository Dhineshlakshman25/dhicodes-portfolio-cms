import { PrismaThemeRepository } from "../../infrastructure/repositories/PrismaThemeRepository";

export class DeleteThemeUseCase {
  private readonly repository =
    new PrismaThemeRepository();

  async execute(
    id: string
  ) {
    await this.repository.delete(
      id
    );
  }
}