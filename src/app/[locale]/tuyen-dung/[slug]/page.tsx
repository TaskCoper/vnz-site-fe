import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PERKS, ROLES, STEPS, applyPath, roleBySlug } from "@/lib/careers";
import { CAREERS_UI, META } from "@/lib/dictionary";
import { LOCALES, localePath, t, type Locale } from "@/lib/i18n";

/**
 * `/tuyen-dung/<slug>` — one job description per route.
 *
 * The old careers page had no such thing: all three roles lived on the list page
 * with their duties and requirements folded into `<details>` toggles. That is
 * why this exists. A job ad has to be linkable — it gets pasted into group chats,
 * sent to a friend, and posted to university boards — and a `<details>` on a list
 * page can be none of those. It also has to be readable in one pass, which is
 * what an accordion on a page with two other jobs is not.
 *
 * FULLY STATIC. `generateStaticParams` prerenders every role at build time and
 * `dynamicParams = false` makes any other slug a 404 rather than an attempted
 * render — the roster is a fixed list in `src/lib/careers.ts`, so there is no
 * such thing as a valid unknown slug here.
 *
 * TWO COLUMNS with a sticky apply rail on the right, the same arrangement as
 * `/lien-he`. `lg:self-start` is load-bearing: without it the aside stretches to
 * the row's height and sticky has nothing to travel through. The JD is long, and
 * the apply button is the one thing that must never scroll out of reach.
 *
 * Optional meta rows (`location` / `workMode` / `salary` / `deadline`) render only
 * when the data exists — see the note on `Role` in `careers.ts`. Don't fill them
 * with plausible defaults to "complete" the sidebar.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  // Every role in every language — the locale segment is part of the route, so
  // omitting it would leave `/en/tuyen-dung/<slug>` unprerendered.
  return LOCALES.flatMap((locale) => ROLES.map((r) => ({ locale, slug: r.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const role = roleBySlug(slug);
  if (!role) return { title: t(META.roleNotFound, locale) };

  return {
    title: `${t(role.role, locale)} — ${t(CAREERS_UI.label, locale)} VNZ`,
    description: t(role.summary, locale),
  };
}

/** One labelled row in the sidebar's fact table. */
function Fact({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-ink/10 py-2.5 first:border-t-0 first:pt-0">
      <dt className="shrink-0 font-pixel text-xs uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </dt>
      <dd className="text-right font-viet text-sm font-medium text-ink">
        {value}
      </dd>
    </div>
  );
}

/** A titled block of bullet points — the JD's repeating unit. */
function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-pixel text-[clamp(1.15rem,2.2vw,1.5rem)] uppercase tracking-wide text-ink">
        {title}
      </h2>
      <ul className="mt-4 flex flex-col gap-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 font-viet text-sm font-light leading-relaxed text-ink-soft sm:text-base"
          >
            <span aria-hidden className="mt-[3px] shrink-0 tint-text">
              ▸
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function RolePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const role = roleBySlug(slug);
  if (!role) notFound();

  const others = ROLES.filter((r) => r.slug !== role.slug);

  return (
    <div className="relative paper">
      <SiteNav locale={locale} />
      <main>
        <article
          style={{ ["--tint" as string]: role.tint }}
          className="relative isolate w-full overflow-x-clip paper py-24 sm:py-28"
        >
          {/* Blueprint grid — same 56px / 5% as every other paper surface. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 [background:repeating-linear-gradient(0deg,rgba(21,22,26,0.05)_0_1px,transparent_1px_56px),repeating-linear-gradient(90deg,rgba(21,22,26,0.05)_0_1px,transparent_1px_56px)] [mask-image:radial-gradient(80%_70%_at_50%_50%,#000_35%,transparent_100%)]"
          />

          {/* BREADCRUMB, unlike `/doi-ngu` and the old `/tuyen-dung`. Those are
              top-level pages the nav already leads back from; this is one level
              deeper, and a JD is the page most likely to be opened from an
              external link with no history to go back to. */}
          <nav
            aria-label={t(CAREERS_UI.breadcrumbNav, locale)}
            className="mx-auto max-w-6xl px-5 sm:px-8"
          >
            <Link
              href={localePath("/tuyen-dung", locale)}
              className="inline-flex items-center gap-2 font-pixel text-sm uppercase tracking-[0.2em] text-ink-soft transition-colors duration-200 hover:text-ember"
            >
              <span aria-hidden>◂</span> {t(CAREERS_UI.allRoles, locale)}
            </Link>
          </nav>

          <header className="mx-auto mt-6 max-w-6xl px-5 sm:px-8">
            <span className="font-pixel text-sm uppercase tracking-[0.3em] tint-text">
              {t(role.department, locale)}
            </span>
            <h1 className="mt-3 max-w-4xl font-viet text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-tight text-ink">
              {t(role.role, locale)}
            </h1>
            <ul className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-pixel text-xs uppercase tracking-[0.15em] text-ink-soft">
              <li className="border border-ink/15 px-2.5 py-1">
                {t(role.employment, locale)}
              </li>
              <li className="border border-ink/15 px-2.5 py-1">{role.level}</li>
              <li className="border border-ink/15 px-2.5 py-1">
                {role.slots} {t(CAREERS_UI.headcount, locale)}
              </li>
              {role.workMode ? (
                <li className="border border-ink/15 px-2.5 py-1">
                  {t(role.workMode!, locale)}
                </li>
              ) : null}
              {role.location ? (
                <li className="border border-ink/15 px-2.5 py-1">
                  {t(role.location!, locale)}
                </li>
              ) : null}
            </ul>
          </header>

          <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 items-start gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
            {/* ══ Left · the job description ══ */}
            <div>
              <p className="font-viet text-base font-light leading-relaxed text-ink-soft sm:text-lg">
                {t(role.about, locale)}
              </p>

              <Section title={t(CAREERS_UI.jobDescription, locale)} items={t(role.duties, locale)} />
              <Section title={t(CAREERS_UI.requirements, locale)} items={t(role.requirements, locale)} />

              <section className="mt-10">
                <h2 className="font-pixel text-[clamp(1.15rem,2.2vw,1.5rem)] uppercase tracking-wide text-ink">
                  {t(CAREERS_UI.stackTitle, locale)}
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {role.stack.map((t) => (
                    <li
                      key={t}
                      className="border border-ink/15 bg-white/70 px-3 py-1.5 font-mono text-xs text-ink-soft"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-10">
                <h2 className="font-pixel text-[clamp(1.15rem,2.2vw,1.5rem)] uppercase tracking-wide text-ink">
                  {t(CAREERS_UI.benefits, locale)}
                </h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {PERKS.map((p) => (
                    <li
                      key={p.title.vi}
                      className="border border-ink/15 paper-card p-4"
                    >
                      <h3 className="font-viet text-sm font-semibold leading-snug text-ink">
                        {t(p.title, locale)}
                      </h3>
                      <p className="mt-1.5 font-viet text-sm font-light leading-relaxed text-ink-soft">
                        {t(p.desc, locale)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-10">
                <h2 className="font-pixel text-[clamp(1.15rem,2.2vw,1.5rem)] uppercase tracking-wide text-ink">
                  {t(CAREERS_UI.process, locale)}
                </h2>
                <ol className="mt-4 flex flex-col gap-3">
                  {STEPS.map((s, i) => (
                    <li key={s.title.vi} className="flex gap-4">
                      <span
                        aria-hidden
                        className="shrink-0 font-pixel text-2xl leading-none text-clay/45"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-viet text-base font-semibold leading-snug text-ink">
                          {t(s.title, locale)}
                        </h3>
                        <p className="mt-1 font-viet text-sm font-light leading-relaxed text-ink-soft">
                          {t(s.desc, locale)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            {/* ══ Right · sticky apply rail ══ */}
            <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
              <div className="relative border border-ink/15 paper-card p-6 backdrop-blur-md">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px] bg-[color:var(--tint)] [box-shadow:0_0_16px_var(--tint)]"
                />
                <h2 className="font-pixel text-lg uppercase tracking-[0.15em] text-ink">
                  {t(CAREERS_UI.applyPanelTitle, locale)}
                </h2>
                <p className="mt-2 font-viet text-sm font-light leading-relaxed text-ink-soft">
                  {t(CAREERS_UI.applyPanelBody, locale)}
                </p>

                <Link
                  href={localePath(applyPath(role.slug), locale)}
                  className="btn-pixel font-pixel mt-5 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-base uppercase tracking-[0.12em]"
                >
                  {t(CAREERS_UI.applyNow, locale)} <span aria-hidden>▸</span>
                </Link>

                <dl className="mt-6 flex flex-col border-t border-ink/10 pt-4">
                  <Fact label={t(CAREERS_UI.factDepartment, locale)} value={t(role.department, locale)} />
                  <Fact label={t(CAREERS_UI.factEmployment, locale)} value={t(role.employment, locale)} />
                  <Fact label={t(CAREERS_UI.factLevel, locale)} value={role.level} />
                  <Fact label={t(CAREERS_UI.factHeadcount, locale)} value={`${role.slots} ${t(CAREERS_UI.people, locale)}`} />
                  <Fact label={t(CAREERS_UI.factWorkMode, locale)} value={role.workMode ? t(role.workMode, locale) : undefined} />
                  <Fact label={t(CAREERS_UI.factLocation, locale)} value={role.location ? t(role.location, locale) : undefined} />
                  <Fact label={t(CAREERS_UI.factSalary, locale)} value={role.salary ? t(role.salary, locale) : undefined} />
                  <Fact label={t(CAREERS_UI.factDeadline, locale)} value={role.deadline ? t(role.deadline, locale) : undefined} />
                </dl>
              </div>

              {others.length ? (
                <div className="border border-ink/15 paper-card p-6 backdrop-blur-md">
                  <h2 className="font-pixel text-sm uppercase tracking-[0.25em] text-clay">
                    {t(CAREERS_UI.otherRoles, locale)}
                  </h2>
                  <ul className="mt-4 flex flex-col gap-3">
                    {others.map((o) => (
                      <li key={o.slug}>
                        <Link
                          href={localePath(`/tuyen-dung/${o.slug}`, locale)}
                          className="group block"
                        >
                          <span className="block font-viet text-sm font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-ember">
                            {t(o.role, locale)}
                          </span>
                          <span className="mt-0.5 block font-pixel text-xs uppercase tracking-[0.15em] text-ink-soft">
                            {t(o.department, locale)} · {o.slots} {t(CAREERS_UI.headcount, locale)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>
        </article>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
