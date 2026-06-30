import { PrismaDashboardRepository } from "../../infrastructure/repositories/PrismaDashboardRepository";

export class GetDashboardUseCase {
  private readonly repository =
    new PrismaDashboardRepository();

  async execute() {
    return this.repository.getDashboard();
  }
}