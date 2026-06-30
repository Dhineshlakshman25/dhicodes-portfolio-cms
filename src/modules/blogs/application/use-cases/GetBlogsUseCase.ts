import { PrismaBlogRepository } from "../../infrastructure/repositories/PrismaBlogRepository";

export class GetBlogsUseCase {
  private readonly repository =
    new PrismaBlogRepository();

  async execute() {
    return this.repository.getAll();
  }
}