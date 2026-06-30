import { NextResponse } from "next/server";

import { GetSocialLinksUseCase } from "../../application/use-cases/GetSocialLinksUseCase";
import { CreateSocialLinkUseCase } from "../../application/use-cases/CreateSocialLinkUseCase";
import { UpdateSocialLinkUseCase } from "../../application/use-cases/UpdateSocialLinkUseCase";
import { DeleteSocialLinkUseCase } from "../../application/use-cases/DeleteSocialLinkUseCase";

import { UpdateSocialLinkDto } from "../../application/dto/UpdateSocialLinkDto";

export class SocialLinkController {
  async get() {
    const data =
      await new GetSocialLinksUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(
    body: Record<string, unknown>
  ) {
    const data =
      await new CreateSocialLinkUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async update(
    body: UpdateSocialLinkDto & {
      id: number;
    }
  ) {
    const { id, ...payload } =
      body;

    const data =
      await new UpdateSocialLinkUseCase().execute(
        id,
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
    await new DeleteSocialLinkUseCase().execute(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Social link deleted successfully",
    });
  }
}