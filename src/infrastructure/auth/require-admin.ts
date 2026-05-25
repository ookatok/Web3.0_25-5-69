import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/login");
  }
}
