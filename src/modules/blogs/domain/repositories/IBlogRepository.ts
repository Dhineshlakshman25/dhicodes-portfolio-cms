import { Blog } from "../entities/Blog";

export interface IBlogRepository {
  getAll(): Promise<Blog[]>;
  getAllPublished(): Promise<Blog[]>;

  getBySlug(slug: string): Promise<Blog | null>;
  getBySlugPublished(slug: string): Promise<Blog | null>;

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