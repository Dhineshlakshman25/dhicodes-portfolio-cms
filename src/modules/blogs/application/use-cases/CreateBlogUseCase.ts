import { CreateBlogDto } from "../dto/CreateBlogDto";
import { PrismaBlogRepository } from "../../infrastructure/repositories/PrismaBlogRepository";

export class CreateBlogUseCase {
  private readonly repository =
    new PrismaBlogRepository();

  async execute(
    data: CreateBlogDto
  ) {
    return this.repository.create(
      data
    );
  }
}