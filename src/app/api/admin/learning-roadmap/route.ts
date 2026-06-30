import { LearningRoadmapController } from "@/modules/learning-roadmap/presentation/controllers/LearningRoadmapController";

const controller =
  new LearningRoadmapController();

export async function GET() {
  return controller.get();
}

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  return controller.create(body);
}

export async function PUT(
  request: Request
) {
  const body =
    await request.json();

  return controller.update(body);
}