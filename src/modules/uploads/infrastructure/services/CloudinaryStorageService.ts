import { UploadApiResponse } from "cloudinary";

import cloudinary from "@/infrastructure/cloudinary/cloudinary";

import { Upload } from "../../domain/entities/Upload";
import { IStorageService } from "../../domain/services/IStorageService";

export class CloudinaryStorageService
  implements IStorageService
{
  async upload(
    file: Buffer,
    fileName: string,
    folder: string,
    mimeType: string
  ): Promise<Upload> {

    const base64 =
      `data:${mimeType};base64,${file.toString("base64")}`;

    const isPdf = mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
    const resourceType = mimeType.startsWith("image/") || isPdf ? "auto" : "raw";
    const cleanPublicId = isPdf && !fileName.toLowerCase().endsWith(".pdf") ? `${fileName}.pdf` : fileName;

    const result: UploadApiResponse =
      await cloudinary.uploader.upload(base64, {
        folder: `portfolio/${folder}`,
        public_id: cleanPublicId,
        resource_type: resourceType,
      });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    };
  }

  async delete(
    publicId: string,
    resourceType: string = "image"
  ): Promise<void> {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  }
}