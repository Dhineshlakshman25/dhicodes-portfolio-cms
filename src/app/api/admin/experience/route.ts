import { ExperienceController } from "@/modules/experience/presentation/controllers/ExperienceController";

const controller =
  new ExperienceController();

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