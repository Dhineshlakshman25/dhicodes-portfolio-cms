export interface LearningRoadmap {
  id: number;

  technology: string;

  status?: string | null;

  description?: string | null;

  target_date?: Date | null;

  display_order?: number | null;

  created_at?: Date | null;

  updated_at?: Date | null;
}