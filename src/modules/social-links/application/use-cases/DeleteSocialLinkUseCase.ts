import { PrismaSocialLinkRepository } from "../../infrastructure/repositories/PrismaSocialLinkRepository";

export class DeleteSocialLinkUseCase {
  private readonly repository =
    new PrismaSocialLinkRepository();

  async execute(
    id: number
  ) {
    await this.repository.delete(id);
  }
}