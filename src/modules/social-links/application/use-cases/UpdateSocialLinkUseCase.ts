import { UpdateSocialLinkDto } from "../dto/UpdateSocialLinkDto";
import { PrismaSocialLinkRepository } from "../../infrastructure/repositories/PrismaSocialLinkRepository";

export class UpdateSocialLinkUseCase {
  private readonly repository =
    new PrismaSocialLinkRepository();

  async execute(
    id: number,
    data: UpdateSocialLinkDto
  ) {
    return this.repository.update(
      id,
      data
    );
  }
}