import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routing } from "@/i18n/routing";

export default function NotFound() {
  return (
    <section className="border-b border-border py-20">
      <div className="container max-w-2xl">
        <p className="text-xs font-bold uppercase text-muted-foreground">404</p>
        <h1 className="mt-4 font-serif text-5xl">Page not found</h1>
        <p className="mt-5 leading-7 text-muted-foreground">
          The requested page is unavailable or has not been published.
        </p>
        <Button asChild className="mt-8">
          <Link href={`/${routing.defaultLocale}`}>Return home</Link>
        </Button>
      </div>
    </section>
  );
}
