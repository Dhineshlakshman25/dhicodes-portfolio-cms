import { ProjectFeatureController } from "@/modules/project-features/presentation/controllers/ProjectFeatureController";

const controller =
  new ProjectFeatureController();

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