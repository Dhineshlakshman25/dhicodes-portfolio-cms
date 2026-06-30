import { SocialLinkController } from "@/modules/social-links/presentation/controllers/SocialLinkController";

const controller =
  new SocialLinkController();

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