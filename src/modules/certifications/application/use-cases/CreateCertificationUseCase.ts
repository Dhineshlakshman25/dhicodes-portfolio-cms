import { CreateCertificationDto } from "../dto/CreateCertificationDto";
import { PrismaCertificationRepository } from "../../infrastructure/repositories/PrismaCertificationRepository";

export class CreateCertificationUseCase {
  private readonly repository =
    new PrismaCertificationRepository();

  async execute(
    data: CreateCertificationDto
  ) {
    return this.repository.create(
      data
    );
  }
}