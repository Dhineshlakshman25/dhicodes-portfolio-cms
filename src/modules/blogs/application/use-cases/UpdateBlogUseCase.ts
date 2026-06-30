import { UpdateBlogDto } from "../dto/UpdateBlogDto";
import { PrismaBlogRepository } from "../../infrastructure/repositories/PrismaBlogRepository";

export class UpdateBlogUseCase {
  private readonly repository =
    new PrismaBlogRepository();

  async execute(
    id: number,
    data: UpdateBlogDto
  ) {
    return this.repository.update(
      id,
      data
    );
  }
}