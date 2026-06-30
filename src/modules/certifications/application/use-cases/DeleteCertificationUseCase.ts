import { PrismaCertificationRepository } from "../../infrastructure/repositories/PrismaCertificationRepository";

export class DeleteCertificationUseCase {
  private readonly repository =
    new PrismaCertificationRepository();

  async execute(
    id: number
  ) {
    await this.repository.delete(
      id
    );
  }
}