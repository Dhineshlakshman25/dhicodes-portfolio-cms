import { NextResponse } from "next/server";

import { GetContactMessagesUseCase } from "../../application/use-cases/GetContactMessagesUseCase";
import { CreateContactMessageUseCase } from "../../application/use-cases/CreateContactMessageUseCase";
import { UpdateContactMessageUseCase } from "../../application/use-cases/UpdateContactMessageUseCase";
import { DeleteContactMessageUseCase } from "../../application/use-cases/DeleteContactMessageUseCase";

import { UpdateContactMessageDto } from "../../application/dto/UpdateContactMessageDto";

export class ContactMessageController {
  async get() {
    const data =
      await new GetContactMessagesUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(
    body: Record<string, unknown>
  ) {
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

    if (!name || name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid name (at least 2 characters).",
        },
        {
          status: 400,
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    if (!message || message.length < 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Message must be at least 5 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message: "Message cannot exceed 5,000 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const data =
      await new CreateContactMessageUseCase().execute({
        name,
        email,
        message,
        subject: subject || undefined,
        phone: phone || undefined,
      } as never);

    return NextResponse.json(
      {
        success: true,
        message:
          "Message sent successfully.",
        data,
      },
      {
        status: 201,
      }
    );
  }

  async update(
    body: UpdateContactMessageDto & {
      id: number;
    }
  ) {
    const { id, ...payload } =
      body;

    const data =
      await new UpdateContactMessageUseCase().execute(
        Number(id),
        payload
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async delete(
    id: number
  ) {
    await new DeleteContactMessageUseCase().execute(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Contact message deleted successfully.",
    });
  }
}