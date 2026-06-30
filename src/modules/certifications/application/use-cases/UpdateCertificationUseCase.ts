import { UpdateCertificationDto } from "../dto/UpdateCertificationDto";
import { PrismaCertificationRepository } from "../../infrastructure/repositories/PrismaCertificationRepository";

export class UpdateCertificationUseCase {
  private readonly repository =
    new PrismaCertificationRepository();

  async execute(
    id: number,
    data: UpdateCertificationDto
  ) {
    return this.repository.update(
      id,
      data
    );
  }
}