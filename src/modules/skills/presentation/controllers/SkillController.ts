import { NextResponse } from "next/server";

import { GetSkillsUseCase } from "../../application/use-cases/GetSkillsUseCase";
import { CreateSkillUseCase } from "../../application/use-cases/CreateSkillUseCase";
import { UpdateSkillUseCase } from "../../application/use-cases/UpdateSkillUseCase";
import { DeleteSkillUseCase } from "../../application/use-cases/DeleteSkillUseCase";

import { UpdateSkillDto } from "../../application/dto/UpdateSkillDto";

export class SkillController {
  async get() {
    const data =
      await new GetSkillsUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(
    body: Record<string, unknown>
  ) {
    const data =
      await new CreateSkillUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async update(
    body: UpdateSkillDto & {
      id: number;
    }
  ) {
    const { id, ...payload } =
      body;

    const data =
      await new UpdateSkillUseCase().execute(
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
    await new DeleteSkillUseCase().execute(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Skill deleted successfully",
    });
  }
}