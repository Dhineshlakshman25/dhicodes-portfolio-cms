import { ProjectImageController } from "@/modules/project-images/presentation/controllers/ProjectImageController";

const controller =
  new ProjectImageController();

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