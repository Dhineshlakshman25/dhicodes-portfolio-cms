import { PrismaSocialLinkRepository } from "../../infrastructure/repositories/PrismaSocialLinkRepository";

export class GetSocialLinksUseCase {
  private readonly repository =
    new PrismaSocialLinkRepository();

  async execute() {
    return this.repository.getAll();
  }
}