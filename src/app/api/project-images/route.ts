import { ProjectImageController } from "@/modules/project-images/presentation/controllers/ProjectImageController";

const controller =
  new ProjectImageController();

export async function GET() {
  return controller.get();
}