import { DashboardController } from "@/modules/dashboard/presentation/controllers/DashboardController";

const controller = new DashboardController();

export async function GET() {
  return controller.get();
}