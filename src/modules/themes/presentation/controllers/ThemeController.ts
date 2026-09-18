import { NextResponse } from "next/server";

import { GetThemesUseCase } from "../../application/use-cases/GetThemesUseCase";
import { GetActiveThemesUseCase } from "../../application/use-cases/GetActiveThemesUseCase";
import { CreateThemeUseCase } from "../../application/use-cases/CreateThemeUseCase";
import { UpdateThemeUseCase } from "../../application/use-cases/UpdateThemeUseCase";
import { DeleteThemeUseCase } from "../../application/use-cases/DeleteThemeUseCase";

import { UpdateThemeDto } from "../../application/dto/UpdateThemeDto";

export class ThemeController {
  async get() {
    const data =
      await new GetThemesUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async getActive() {
    const data =
      await new GetActiveThemesUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(
    body: Record<string, unknown>
  ) {
    const data =
      await new CreateThemeUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async update(
    body: UpdateThemeDto & {
      id: string;
    }
  ) {
    const { id, ...payload } =
      body;

    const data =
      await new UpdateThemeUseCase().execute(
        id,
        payload
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async delete(
    id: string
  ) {
    await new DeleteThemeUseCase().execute(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Theme deleted successfully",
    });
  }
}