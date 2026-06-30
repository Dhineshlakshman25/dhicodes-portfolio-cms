import { CloudinaryStorageService } from "../../infrastructure/services/CloudinaryStorageService";

export class UploadFileUseCase {
  private readonly storage =
    new CloudinaryStorageService();

  async execute(
    file: Buffer,
    fileName: string,
    folder: string,
    mimeType: string
  ) {
    return this.storage.upload(
      file,
      fileName,
      folder,
      mimeType
    );
  }
}