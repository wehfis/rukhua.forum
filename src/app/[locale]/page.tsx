import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  BookOpen,
  CheckCircle2,
  HeartPulse,
  Landmark,
  Leaf,
  LineChart,
  Palette,
  Scale,
  Sparkles,
  Trophy,
  Users
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { PostCard } from "@/components/news/post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLatestPosts } from "@/features/posts/queries";
import type { Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/env";
import { createPageMetadata, localizedUrl } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

type ValueItem = {
  title: string;
  description: string;
};

type AreaItem = ValueItem & {
  icon: keyof typeof activityIcons;
};

type StructureItem = ValueItem;

const activityIcons = {
  sparkles: Sparkles,
  landmark: Landmark,
  chart: LineChart,
  book: BookOpen,
  palette: Palette,
  trophy: Trophy,
  heart: HeartPulse,
  leaf: Leaf,
  scale: Scale
};

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return createPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    image: "/images/civic-forum-hero.png"
  });
}

export default async function LandingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const latestPosts = await getLatestPosts(locale, 3);
  const values = t.raw("landing.values.items") as ValueItem[];
  const areas = t.raw("landing.areas.items") as AreaItem[];
  const steps = t.raw("landing.structure.steps") as StructureItem[];
  const departments = t.raw("landing.structure.departments") as StructureItem[];
  const regional = t.raw("landing.regional.items") as string[];
  const missionItems = t.raw("landing.mission.items") as string[];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NGO",
          name: t("brand.fullName"),
          url: localizedUrl(locale),
          logo: `${getSiteUrl()}/images/civic-forum-hero.png`,
          contactPoint: {
            "@type": "ContactPoint",
            email: "info@rukhua.org",
            telephone: "+380000000000"
          }
        }}
      />

      <section className="relative min-h-[78vh] border-b border-border">
        <Image
          src="/images/civic-forum-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="container relative flex min-h-[78vh] items-end pb-12 pt-28 md:pb-16">
          <div className="max-w-4xl text-white">
            <Badge className="border-white/35 bg-black/20 text-white">
              {t("landing.hero.eyebrow")}
            </Badge>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.02] md:text-7xl">
              {t("landing.hero.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/86 md:text-xl">
              {t("landing.hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/${locale}/news`}>{t("landing.hero.primary")}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#join">{t("landing.hero.secondary")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-border py-16 md:py-24">
        <div className="container grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
          <SectionHeading eyebrow={t("nav.home")} title={t("landing.about.title")} />
          <div className="space-y-8">
            <p className="max-w-3xl font-serif text-3xl leading-tight md:text-4xl">
              {t("landing.about.body")}
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <EditorialBlock title={t("landing.mission.title")} body={t("landing.mission.body")} />
              <EditorialBlock title={t("landing.vision.title")} body={t("landing.vision.body")} />
            </div>
            <div className="flex flex-wrap gap-2">
              {missionItems.map((item) => (
                <span
                  key={item}
                  className="rounded-sm border border-border bg-card px-3 py-2 text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white py-16 md:py-24">
        <div className="container">
          <SectionHeading title={t("landing.values.title")} />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title}>
                <CardHeader>
                  <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <div className="container">
          <SectionHeading title={t("landing.areas.title")} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => {
              const Icon = activityIcons[area.icon] ?? Sparkles;

              return (
                <Card key={area.title}>
                  <CardHeader>
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <CardTitle>{area.title}</CardTitle>
                    <CardDescription>{area.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-[#f1efe8] py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading title={t("landing.structure.title")} />
            <p className="mt-4 max-w-md leading-7 text-muted-foreground">
              {t("landing.structure.intro")}
            </p>
          </div>
          <div className="space-y-8">
            <div className="grid gap-3">
              {steps.map((step, index) => (
                <div key={step.title} className="grid gap-3 sm:grid-cols-[3rem_1fr]">
                  <div className="flex items-start justify-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md border border-foreground bg-background text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <div className="border-b border-border pb-5">
                    <h3 className="font-serif text-2xl">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                    {index < steps.length - 1 ? (
                      <ArrowDown className="mt-4 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {departments.map((department) => (
                <Card key={department.title}>
                  <CardHeader>
                    <CardTitle className="text-xl">{department.title}</CardTitle>
                    <CardDescription>{department.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="border-b border-border bg-white py-16 md:py-24">
        <div className="container grid gap-8 lg:grid-cols-3">
          <EditorialPanel title={t("landing.platform.title")} body={t("landing.platform.body")} />
          <EditorialPanel title={t("landing.control.title")} body={t("landing.control.body")} />
          <EditorialPanel title={t("landing.roundTables.title")} body={t("landing.roundTables.body")} />
        </div>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeading title={t("landing.regional.title")} />
          <div className="grid gap-3 sm:grid-cols-2">
            {regional.map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-4 border-b border-border pb-4"
              >
                <span className="font-serif text-3xl text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white py-16 md:py-24">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading title={t("landing.latest.title")} />
            <Button asChild variant="secondary">
              <Link href={`/${locale}/news`}>{t("landing.latest.all")}</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                locale={locale}
                readMoreLabel={t("newsPage.readMore")}
                likesLabel={t("newsPage.likes")}
                commentsLabel={t("newsPage.comments")}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionHeading title={t("landing.join.title")} />
            <p className="mt-5 max-w-2xl font-serif text-3xl leading-tight">
              {t("landing.join.body")}
            </p>
            <Button asChild className="mt-8" size="lg">
              <a href="mailto:info@rukhua.org">{t("landing.join.button")}</a>
            </Button>
          </div>
          <div className="border-l border-border pl-6">
            <h3 className="font-serif text-3xl">{t("landing.contacts.title")}</h3>
            <dl className="mt-6 space-y-4 text-sm">
              <ContactRow label={t("landing.contacts.email")} value="info@rukhua.org" />
              <ContactRow label={t("landing.contacts.phone")} value="+380 00 000 00 00" />
              <ContactRow label={t("landing.contacts.whatsapp")} value="+380 00 000 00 00" />
              <ContactRow label={t("landing.contacts.viber")} value="+380 00 000 00 00" />
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title
}: {
  eyebrow?: string;
  title: string;
}) {
  return (
    <div>
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="max-w-3xl font-serif text-4xl leading-tight md:text-5xl">
        {title}
      </h2>
    </div>
  );
}

function EditorialBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-t border-border pt-5">
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mt-3 leading-7 text-muted-foreground">{body}</p>
    </div>
  );
}

function EditorialPanel({ title, body }: { title: string; body: string }) {
  return (
    <article className="border-t border-foreground pt-5">
      <Users className="h-5 w-5 text-primary" aria-hidden="true" />
      <h3 className="mt-5 font-serif text-3xl leading-tight">{title}</h3>
      <p className="mt-4 leading-7 text-muted-foreground">{body}</p>
    </article>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 border-b border-border pb-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
