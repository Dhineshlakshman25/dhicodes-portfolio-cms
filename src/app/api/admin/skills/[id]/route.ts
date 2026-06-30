import { SkillController } from "@/modules/skills/presentation/controllers/SkillController";

const controller =
  new SkillController();

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