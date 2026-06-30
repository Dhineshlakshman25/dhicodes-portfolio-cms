import { EducationController } from "@/modules/education/presentation/controllers/EducationController";

const controller =
  new EducationController();

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