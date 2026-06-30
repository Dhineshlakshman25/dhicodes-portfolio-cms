import { BlogController } from "@/modules/blogs/presentation/controllers/BlogController";

const controller =
  new BlogController();

export async function GET() {
  return controller.get();
}