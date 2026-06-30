import { ProfileController } from "@/modules/profile/presentation/controllers/ProfileController";

const controller = new ProfileController();

export async function GET() {
  return controller.get();
}