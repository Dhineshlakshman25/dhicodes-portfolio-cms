import { ProjectSkillController } from "@/modules/project-skills/presentation/controllers/ProjectSkillController";

const controller =
  new ProjectSkillController();

export async function GET() {
  return controller.get();
}