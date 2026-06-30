import { ContactMessageController } from "@/modules/contact-messages/presentation/controllers/ContactMessageController";

const controller =
  new ContactMessageController();

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  return controller.create(body);
}