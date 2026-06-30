import { NextResponse } from "next/server";

import { GetDashboardUseCase } from "../../application/use-cases/GetDashboardUseCase";

export class DashboardController {
  async get() {
    const data =
      await new GetDashboardUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }
}