import { PrismaCertificationRepository } from "../../infrastructure/repositories/PrismaCertificationRepository";

export class GetCertificationsUseCase {
  private readonly repository =
    new PrismaCertificationRepository();

  async execute() {
    return this.repository.getAll();
  }
}