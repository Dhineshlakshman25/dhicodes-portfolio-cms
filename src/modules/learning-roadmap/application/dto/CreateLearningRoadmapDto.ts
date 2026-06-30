export interface CreateLearningRoadmapDto {
  technology: string;

  status?: string;

  description?: string;

  target_date?: Date;

  display_order?: number;
}