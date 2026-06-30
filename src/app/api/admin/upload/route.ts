import { UploadController } from "@/modules/uploads/presentation/controllers/UploadController";

const controller =
  new UploadController();

export async function POST(
  request: Request
) {
  return controller.upload(request);
}