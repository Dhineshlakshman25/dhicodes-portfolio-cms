import { NextResponse } from "next/server";
import { AuthController } from "@/modules/auth/presentation/controllers/AuthController";

const controller = new AuthController();

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    return await controller.login(body);
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