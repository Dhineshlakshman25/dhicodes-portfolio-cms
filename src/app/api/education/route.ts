import { EducationController } from "@/modules/education/presentation/controllers/EducationController";

const controller =
  new EducationController();

export async function GET() {
  return controller.get();
}