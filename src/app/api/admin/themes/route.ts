import { ThemeController } from "@/modules/themes/presentation/controllers/ThemeController";

const controller =
  new ThemeController();

export async function GET() {
  return controller.get();
}

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  return controller.create(body);
}

export async function PUT(
  request: Request
) {
  const body =
    await request.json();

  return controller.update(body);
}