import { CreateSocialLinkDto } from "../dto/CreateSocialLinkDto";
import { PrismaSocialLinkRepository } from "../../infrastructure/repositories/PrismaSocialLinkRepository";

export class CreateSocialLinkUseCase {
  private readonly repository =
    new PrismaSocialLinkRepository();

  async execute(
    data: CreateSocialLinkDto
  ) {
    return this.repository.create(
      data
    );
  }
}