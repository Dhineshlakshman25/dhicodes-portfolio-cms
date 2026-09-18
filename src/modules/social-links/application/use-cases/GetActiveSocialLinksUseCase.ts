import { PrismaSocialLinkRepository } from "../../infrastructure/repositories/PrismaSocialLinkRepository";

export class GetActiveSocialLinksUseCase {
  private readonly repository = new PrismaSocialLinkRepository();

  async execute() {
    return this.repository.getAllActive();
  }
}
