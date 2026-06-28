import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth/admin";
import type { Locale } from "@/i18n/routing";

export default async function ProtectedAdminLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await requireAdmin(locale);
  const t = await getTranslations({ locale });

  return (
    <AdminShell
      locale={locale}
      userEmail={user.email}
      labels={{
        dashboard: t("admin.dashboard"),
        posts: t("admin.posts"),
        newPost: t("admin.newPost"),
        settings: t("admin.settings"),
        signOut: t("admin.signOut")
      }}
    >
      {children}
    </AdminShell>
  );
}
