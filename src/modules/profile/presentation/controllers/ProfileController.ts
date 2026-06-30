import { NextResponse } from "next/server";

import { GetProfileUseCase } from "../../application/use-cases/GetProfileUseCase";
import { CreateProfileUseCase } from "../../application/use-cases/CreateProfileUseCase";
import { UpdateProfileUseCase } from "../../application/use-cases/UpdateProfileUseCase";

import { CreateProfileDto } from "../../application/dto/CreateProfileDto";
import { UpdateProfileDto } from "../../application/dto/UpdateProfileDto";

export class ProfileController {
  async get() {
    const profile =
      await new GetProfileUseCase().execute();

    return NextResponse.json({
      success: true,
      data: profile,
    });
  }

  async create(
    body: CreateProfileDto
  ) {
    const profile =
      await new CreateProfileUseCase().execute(
        body
      );

    return NextResponse.json({
      success: true,
      data: profile,
    });
  }

  async update(
    body: UpdateProfileDto
  ) {
    const profile =
      await new UpdateProfileUseCase().execute(
        "profile-1",
        body
      );

    return NextResponse.json({
      success: true,
      data: profile,
    });
  }
}