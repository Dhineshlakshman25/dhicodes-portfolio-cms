import { ProjectController } from "@/modules/projects/presentation/controllers/ProjectController";

const controller =
  new ProjectController();

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  const { slug } =
    await params;

  return controller.getBySlug(
    slug
  );
}