import { Theme } from "../entities/Theme";

export interface IThemeRepository {
  getAll(): Promise<Theme[]>;
  getAllActive(): Promise<Theme[]>;

  create(
    data: Partial<Theme>
  ): Promise<Theme>;

  update(
    id: string,
    data: Partial<Theme>
  ): Promise<Theme>;

  delete(
    id: string
  ): Promise<void>;
}