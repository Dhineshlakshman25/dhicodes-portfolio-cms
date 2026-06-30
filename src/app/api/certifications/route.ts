import { CertificationController } from "@/modules/certifications/presentation/controllers/CertificationController";

const controller =
  new CertificationController();

export async function GET() {
  return controller.get();
}