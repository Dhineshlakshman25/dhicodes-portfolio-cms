import { PrismaBlogRepository } from "../../infrastructure/repositories/PrismaBlogRepository";

export class DeleteBlogUseCase {
  private readonly repository =
    new PrismaBlogRepository();

  async execute(
    id: number
  ) {
    await this.repository.delete(
      id
    );
  }
}