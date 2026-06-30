import { AuthController } from "@/modules/auth/presentation/controllers/AuthController";

const controller = new AuthController();

export async function POST(
  request: Request
) {
  const body = await request.json();

  return controller.login(body);
}