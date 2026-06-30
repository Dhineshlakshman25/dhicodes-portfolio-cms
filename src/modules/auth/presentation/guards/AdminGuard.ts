import { isAdmin } from "@/infrastructure/auth/permissions";

export class AdminGuard {
  static authorize(role?: string): void {
    if (!isAdmin(role)) {
      throw new Error(
        "You are not authorized to perform this action"
      );
    }
  }
}