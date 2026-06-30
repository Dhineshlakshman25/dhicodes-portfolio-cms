import { CloudinaryStorageService } from "../../infrastructure/services/CloudinaryStorageService";

export class DeleteFileUseCase {
  private readonly storage =
    new CloudinaryStorageService();

  async execute(
    publicId: string
  ) {
    return this.storage.delete(
      publicId
    );
  }
}