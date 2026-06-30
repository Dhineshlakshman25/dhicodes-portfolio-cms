import { NextResponse } from "next/server";

import { GetSkillCategoriesUseCase } from "../../application/use-cases/GetSkillCategoriesUseCase";
import { CreateSkillCategoryUseCase } from "../../application/use-cases/CreateSkillCategoryUseCase";
import { UpdateSkillCategoryUseCase } from "../../application/use-cases/UpdateSkillCategoryUseCase";
import { DeleteSkillCategoryUseCase } from "../../application/use-cases/DeleteSkillCategoryUseCase";

import { UpdateSkillCategoryDto } from "../../application/dto/UpdateSkillCategoryDto";

export class SkillCategoryController {
  async get() {
    const data =
      await new GetSkillCategoriesUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(
    body: Record<string, unknown>
  ) {
    const data =
      await new CreateSkillCategoryUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async update(
    body: UpdateSkillCategoryDto & {
      id: number;
    }
  ) {
    const { id, ...payload } =
      body;

    const data =
      await new UpdateSkillCategoryUseCase().execute(
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
    await new DeleteSkillCategoryUseCase().execute(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Skill Category deleted successfully",
    });
  }
}