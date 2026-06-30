import { ProjectFeatureController } from "@/modules/project-features/presentation/controllers/ProjectFeatureController";

const controller =
  new ProjectFeatureController();

export async function GET() {
  return controller.get();
}