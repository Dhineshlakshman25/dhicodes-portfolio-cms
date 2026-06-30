import { AuthController } from "@/modules/auth/presentation/controllers/AuthController";

const controller = new AuthController();

export async function POST() {
  return controller.logout();
}