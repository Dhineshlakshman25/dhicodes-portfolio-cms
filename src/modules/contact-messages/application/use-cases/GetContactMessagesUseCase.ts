import { PrismaContactMessageRepository } from "../../infrastructure/repositories/PrismaContactMessageRepository";

export class GetContactMessagesUseCase {
  private readonly repository =
    new PrismaContactMessageRepository();

  async execute() {
    return this.repository.getAll();
  }
}