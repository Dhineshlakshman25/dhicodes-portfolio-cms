import { UpdateContactMessageDto } from "../dto/UpdateContactMessageDto";
import { PrismaContactMessageRepository } from "../../infrastructure/repositories/PrismaContactMessageRepository";

export class UpdateContactMessageUseCase {
  private readonly repository =
    new PrismaContactMessageRepository();

  async execute(
    id: number,
    data: UpdateContactMessageDto
  ) {
    return this.repository.update(
      id,
      data
    );
  }
}