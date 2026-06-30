import { NextResponse } from "next/server";

import { GetProjectSkillsUseCase } from "../../application/use-cases/GetProjectSkillsUseCase";
import { CreateProjectSkillUseCase } from "../../application/use-cases/CreateProjectSkillUseCase";
import { UpdateProjectSkillUseCase } from "../../application/use-cases/UpdateProjectSkillUseCase";
import { DeleteProjectSkillUseCase } from "../../application/use-cases/DeleteProjectSkillUseCase";

export class ProjectSkillController {
  async get() {
    const data =
      await new GetProjectSkillsUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(
    body: Record<string, unknown>
  ) {
    const data =
      await new CreateProjectSkillUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async update(
    body: {
      project_id: string;
      skill_id: number;
      usage_type?: string;
    }
  ) {
    const data =
      await new UpdateProjectSkillUseCase().execute(
        body.project_id,
        body.skill_id,
        {
          usage_type:
            body.usage_type,
        }
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async delete(
    project_id: string,
    skill_id: number
  ) {
    await new DeleteProjectSkillUseCase().execute(
      project_id,
      skill_id
    );

    return NextResponse.json({
      success: true,
      message:
        "Project Skill deleted successfully",
    });
  }
}