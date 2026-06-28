import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { FileText, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { signOutAction } from "@/features/auth/actions";
import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function AdminShell({
  locale,
  labels,
  userEmail,
  children
}: {
  locale: Locale;
  labels: {
    dashboard: string;
    posts: string;
    newPost: string;
    settings: string;
    signOut: string;
  };
  userEmail?: string | null;
  children: ReactNode;
}) {
  const signOut = signOutAction.bind(null, locale);

  return (
    <div className="border-b border-border bg-[#f6f5f1]">
      <div className="container grid gap-8 py-8 lg:grid-cols-[15rem_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="border-t border-foreground pt-4">
            <p className="text-xs font-bold uppercase text-muted-foreground">
              Admin
            </p>
            {userEmail ? (
              <p className="mt-2 truncate text-sm font-semibold">{userEmail}</p>
            ) : null}
          </div>
          <nav className="mt-6 grid gap-1 text-sm">
            <AdminLink href={`/${locale}/admin`} label={labels.dashboard} icon={LayoutDashboard} />
            <AdminLink href={`/${locale}/admin/posts`} label={labels.posts} icon={FileText} />
            <AdminLink href={`/${locale}/admin/posts/new`} label={labels.newPost} icon={FileText} />
            <AdminLink href={`/${locale}/admin/settings`} label={labels.settings} icon={Settings} />
          </nav>
          <form action={signOut} className="mt-6">
            <Button type="submit" variant="secondary" className="w-full justify-start">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {labels.signOut}
            </Button>
          </form>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

function AdminLink({
  href,
  label,
  icon: Icon
}: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md px-3 py-2 font-semibold text-muted-foreground hover:bg-white hover:text-foreground"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
