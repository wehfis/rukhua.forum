import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminUser } from "@/lib/auth/admin";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });

  return {
    title: t("loginTitle")
  };
}

export default async function AdminLoginPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getAdminUser();

  if (user) {
    redirect(`/${locale}/admin`);
  }

  const t = await getTranslations({ locale });

  return (
    <section className="border-b border-border py-16 md:py-24">
      <div className="container max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl">{t("admin.loginTitle")}</CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              {t("admin.loginDescription")}
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm
              locale={locale}
              labels={{
                email: t("admin.email"),
                password: t("admin.password"),
                signIn: t("admin.signIn")
              }}
            />
            <p className="mt-5 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
              {t("admin.dbNotice")}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
