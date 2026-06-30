import { ThemeController } from "@/modules/themes/presentation/controllers/ThemeController";

const controller =
  new ThemeController();

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

  return controller.delete(id);
}