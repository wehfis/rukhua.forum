"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { Locale } from "@/i18n/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  locale: z.string().min(2).max(5)
});

export async function loginAction(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    locale: formData.get("locale")
  });

  if (!parsed.success) {
    return { ok: false, message: "Invalid email or password." };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase is not configured. Add the env values first."
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect(`/${parsed.data.locale as Locale}/admin`);
}

export async function signOutAction(locale: Locale) {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect(`/${locale}/admin/login`);
}
