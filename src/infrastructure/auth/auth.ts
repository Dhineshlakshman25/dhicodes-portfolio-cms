import { getSessionToken } from "./session";
import { verifyToken } from "./jwt";

export async function requireAuth() {
  const token =
    await getSessionToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  return verifyToken(token);
}