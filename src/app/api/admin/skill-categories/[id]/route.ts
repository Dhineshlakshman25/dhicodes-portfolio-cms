import { SkillCategoryController } from "@/modules/skill-categories/presentation/controllers/SkillCategoryController";

const controller =
  new SkillCategoryController();

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