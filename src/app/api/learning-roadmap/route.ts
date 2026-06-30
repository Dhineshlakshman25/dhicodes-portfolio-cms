import { LearningRoadmapController } from "@/modules/learning-roadmap/presentation/controllers/LearningRoadmapController";

const controller =
  new LearningRoadmapController();

export async function GET() {
  return controller.get();
}