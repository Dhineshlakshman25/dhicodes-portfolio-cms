import { LearningRoadmapController } from "@/modules/learning-roadmap/presentation/controllers/LearningRoadmapController";

const controller =
  new LearningRoadmapController();

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } =
    await params;

  return controller.delete(
    Number(id)
  );
}