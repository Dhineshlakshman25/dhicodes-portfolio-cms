import { ContactMessage } from "../entities/ContactMessage";

export interface IContactMessageRepository {
  getAll(): Promise<ContactMessage[]>;

  create(
    data: Partial<ContactMessage>
  ): Promise<ContactMessage>;

  update(
    id: number,
    data: Partial<ContactMessage>
  ): Promise<ContactMessage>;

  delete(
    id: number
  ): Promise<void>;
}