import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAdminUser() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const db = getDb();

  if (!db) {
    return null;
  }

  const [dbUser] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, user.id));

  if (dbUser?.role !== "admin") {
    return null;
  }

  return user;
}

export async function requireAdmin(locale: string) {
  const user = await getAdminUser();

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  return user;
}
