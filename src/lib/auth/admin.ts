import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminUser() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAdmin(locale: string) {
  const user = await getAdminUser();

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  return user;
}
