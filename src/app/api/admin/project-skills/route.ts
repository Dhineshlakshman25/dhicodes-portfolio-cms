import { ProjectSkillController } from "@/modules/project-skills/presentation/controllers/ProjectSkillController";

const controller =
  new ProjectSkillController();

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

export async function DELETE(
  request: Request
) {
  const body =
    await request.json();

  return controller.delete(
    body.project_id,
    body.skill_id
  );
}