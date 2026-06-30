import { ProjectController } from "@/modules/projects/presentation/controllers/ProjectController";

const controller =
  new ProjectController();

export async function GET() {
  return controller.get();
}