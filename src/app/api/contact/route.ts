import { NextResponse } from "next/server";
import { ContactMessageController } from "@/modules/contact-messages/presentation/controllers/ContactMessageController";

const controller =
  new ContactMessageController();

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    return await controller.create(body);
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or malformed JSON payload.",
      },
      {
        status: 400,
      }
    );
  }
}