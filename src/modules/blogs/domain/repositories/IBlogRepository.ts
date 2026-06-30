import { Blog } from "../entities/Blog";

export interface IBlogRepository {
  getAll(): Promise<Blog[]>;

  create(
    data: Partial<Blog>
  ): Promise<Blog>;

  update(
    id: number,
    data: Partial<Blog>
  ): Promise<Blog>;

  delete(
    id: number
  ): Promise<void>;
}