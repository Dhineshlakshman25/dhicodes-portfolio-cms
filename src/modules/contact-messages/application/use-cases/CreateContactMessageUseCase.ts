import { CreateContactMessageDto } from "../dto/CreateContactMessageDto";
import { PrismaContactMessageRepository } from "../../infrastructure/repositories/PrismaContactMessageRepository";

export class CreateContactMessageUseCase {
  private readonly repository =
    new PrismaContactMessageRepository();

  async execute(
    data: CreateContactMessageDto
  ) {
    return this.repository.create(
      data
    );
  }
}