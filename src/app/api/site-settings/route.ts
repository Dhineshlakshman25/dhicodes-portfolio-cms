import { SiteSettingsController } from "@/modules/site-settings/presentation/controllers/SiteSettingsController";

const controller =
  new SiteSettingsController();

export async function GET() {
  return controller.get();
}