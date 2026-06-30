import { SkillController } from "@/modules/skills/presentation/controllers/SkillController";

const controller =
  new SkillController();

export async function GET() {
  return controller.get();
}