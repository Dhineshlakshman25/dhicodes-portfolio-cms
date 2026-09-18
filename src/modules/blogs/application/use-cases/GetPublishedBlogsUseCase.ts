import { PrismaBlogRepository } from "../../infrastructure/repositories/PrismaBlogRepository";

export class GetPublishedBlogsUseCase {
  private readonly repository = new PrismaBlogRepository();

  async execute() {
    return this.repository.getAllPublished();
  }
}
