import { ExperienceController } from "@/modules/experience/presentation/controllers/ExperienceController";

const controller =
  new ExperienceController();

export async function GET() {
  return controller.get();
}