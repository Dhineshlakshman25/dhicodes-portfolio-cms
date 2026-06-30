import { ExperienceController } from "@/modules/experience/presentation/controllers/ExperienceController";

const controller =
  new ExperienceController();

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