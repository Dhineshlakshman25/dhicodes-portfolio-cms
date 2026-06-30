export interface UpdateLearningRoadmapDto {
  technology?: string;

  status?: string;

  description?: string;

  target_date?: string | Date;

  display_order?: number;
}
