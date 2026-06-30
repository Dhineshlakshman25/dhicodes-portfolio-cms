import { User } from "../../domain/entities/User";

type PrismaUser = {
  id: string;
  email: string;
  role: string | null;
  is_active: boolean | null;
};

export class UserMapper {
  static toDomain(user: PrismaUser): User {
    return new User(
      user.id,
      user.email,
      user.role ?? "USER",
      user.is_active ?? false
    );
  }
}