import { BlogController } from "@/modules/blogs/presentation/controllers/BlogController";

const controller = new BlogController();

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
  const { slug } = await params;

  return controller.getPublishedBySlug(slug);
}
