import type { Metadata } from "next";
import { t, type Locale } from "@/lib/i18n";
import { META } from "@/lib/dictionary";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Careers } from "@/components/careers";

/**
 * /tuyen-dung — the job list.
 *
 * Rebuilt as a careers page rather than the JRPG "class select" it opened as;
 * the reasoning is in `src/components/careers.tsx`, and each role now has its own
 * job description at `/tuyen-dung/<slug>`.
 *
 * `Careers` no longer takes a `standalone` prop — it did while the block could
 * also be dropped back into the homepage story as a numbered chapter, which is
 * not a thing it can be any more.
 *
 * No breadcrumb here (the detail pages have one): the nav's logo and menu are the
 * way back from a top-level route. `Careers` carries its own `py-24 sm:py-28`,
 * which is what clears the fixed header — don't strip it without replacing that
 * clearance.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: t(META.careersTitle, locale),
    description: t(META.careersDescription, locale),
  };
}

export default async function TuyenDungPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <div className="relative paper">
      <SiteNav locale={locale} />
      <main>
        <Careers locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
