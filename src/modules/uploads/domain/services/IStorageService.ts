import { Upload } from "../entities/Upload";

export interface IStorageService {
  upload(
    file: Buffer,
    fileName: string,
    folder: string,
    mimeType: string
  ): Promise<Upload>;

  delete(
    publicId: string
  ): Promise<void>;
}