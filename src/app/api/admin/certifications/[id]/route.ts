import { CertificationController } from "@/modules/certifications/presentation/controllers/CertificationController";

const controller =
  new CertificationController();

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } =
    await params;

  return controller.delete(
    Number(id)
  );
}