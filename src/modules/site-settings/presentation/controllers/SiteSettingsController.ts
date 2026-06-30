import { NextResponse } from "next/server";

import { GetSiteSettingsUseCase } from "../../application/use-cases/GetSiteSettingsUseCase";
import { CreateSiteSettingsUseCase } from "../../application/use-cases/CreateSiteSettingsUseCase";
import { UpdateSiteSettingsUseCase } from "../../application/use-cases/UpdateSiteSettingsUseCase";

export class SiteSettingsController {
  async get() {
    const data =
      await new GetSiteSettingsUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(
    body: Record<string, unknown>
  ) {
    const existing =
      await new GetSiteSettingsUseCase().execute();

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Site settings already exist.",
        },
        {
          status: 400,
        }
      );
    }

    const data =
      await new CreateSiteSettingsUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async update(
    body: Record<string, unknown>
  ) {
    const data =
      await new UpdateSiteSettingsUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }
}