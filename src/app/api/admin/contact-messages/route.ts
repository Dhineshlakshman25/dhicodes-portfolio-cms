import { ContactMessageController } from "@/modules/contact-messages/presentation/controllers/ContactMessageController";

const controller =
  new ContactMessageController();

export async function GET() {
  return controller.get();
}

export async function PUT(
  request: Request
) {
  const body =
    await request.json();

  return controller.update(body);
}