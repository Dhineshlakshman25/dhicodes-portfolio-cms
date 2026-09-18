import { SocialLinkController } from "@/modules/social-links/presentation/controllers/SocialLinkController";

const controller =
  new SocialLinkController();

export async function GET() {
  return controller.getActive();
}