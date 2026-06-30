import { SkillCategoryController } from "@/modules/skill-categories/presentation/controllers/SkillCategoryController";

const controller =
  new SkillCategoryController();

export async function GET() {
  return controller.get();
}