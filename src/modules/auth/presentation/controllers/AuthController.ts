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
    try {
      if (!body || !body.email || !body.password) {
        return NextResponse.json(
          {
            success: false,
            message: "Email and password are required",
          },
          {
            status: 400,
          }
        );
      }

      const result = await new LoginUseCase().execute(
        body.email,
        body.password
      );

      await setSession(result.token);

      const response = NextResponse.json({
        success: true,
        data: result,
      });

      response.cookies.set("portfolio_token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Invalid credentials";

      return NextResponse.json(
        {
          success: false,
          message,
        },
        {
          status: 401,
        }
      );
    }
  }


  async logout() {
    await new LogoutUseCase().execute();

    await removeSession();

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    response.cookies.delete("portfolio_token");

    return response;
  }

  async me() {
    try {
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
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Session expired or invalid",
        },
        {
          status: 401,
        }
      );
    }
  }
}