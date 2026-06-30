import { Certification } from "../entities/Certification";

export interface ICertificationRepository {
  getAll(): Promise<Certification[]>;

  create(
    data: Partial<Certification>
  ): Promise<Certification>;

  update(
    id: number,
    data: Partial<Certification>
  ): Promise<Certification>;

  delete(
    id: number
  ): Promise<void>;
}