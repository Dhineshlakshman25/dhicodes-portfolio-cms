import { NextResponse } from "next/server";

import { LoginUseCase } from "../../application/use-cases/LoginUseCase";
import { LogoutUseCase } from "../../application/use-cases/LogoutUseCase";
import { GetCurrentUserUseCase } from "../../application/use-cases/GetCurrentUserUseCase";

import {
  setSession,
  removeSession,
  getSessionToken,
} from "@/infrastructure/auth/session";

export class AuthController {
  async login(body: {
    email: string;
    password: string;
  }) {
    const result = await new LoginUseCase().execute(
      body.email,
      body.password
    );

    await setSession(result.token);

    return NextResponse.json({
      success: true,
      data: result,
    });
  }

  async logout() {
    await new LogoutUseCase().execute();

    await removeSession();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  }

  async me() {
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const user =
      await new GetCurrentUserUseCase().execute(
        token
      );

    return NextResponse.json({
      success: true,
      data: user,
    });
  }
}