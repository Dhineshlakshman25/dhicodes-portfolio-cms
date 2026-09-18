import { ThemeController } from "@/modules/themes/presentation/controllers/ThemeController";

const controller =
  new ThemeController();

export async function GET() {
  return controller.getActive();
}