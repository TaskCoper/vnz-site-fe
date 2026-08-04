import type { Metadata } from "next";
import Link from "next/link";
import { localePath, t, type Locale } from "@/lib/i18n";
import { META, NEWS_UI } from "@/lib/dictionary";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { formatDate, readingMinutes, sortedPosts } from "@/lib/posts";

/**
 * /tin-tuc — the news & writing index.
 *
 * NEWEST FIRST, and the order is derived (`sortedPosts()`) rather than being the
 * order somebody happened to type entries into `posts.ts`. A blog whose list
 * order depends on file order silently mis-sorts the first time two people edit
 * it.
 *
 * THE LEAD POST GETS A LARGER CARD. It is the same data, just given the width —
 * an index where every entry has identical weight makes the reader do the
 * triage that the site should have done for them.
 *
 * NO CATEGORY FILTER, deliberately. Three posts fit on one screen and a filter
 * over three items advertises a volume that isn't there — the same reasoning as
 * the missing job filter (`careers.tsx`) and the marquee that was cut from
 * `partners.tsx`. Categories still show as labels because they tell you what a
 * post IS; add filtering when the archive stops fitting on a screen, and build it
 * on `searchParams` so a filtered view stays linkable.
 *
 * NO COVER IMAGES ANYWHERE — see the note in `posts.ts`. Cards carry a tinted
 * rule and a category chip instead of stock photography.
 *
 * EMPTY STATE INCLUDED. It cannot happen while `POSTS` has entries, but a blog
 * index is exactly the page that eventually gets emptied during a migration, and
 * a bare heading over nothing looks broken rather than empty.
 *
 * Server component; reveals are the native CSS scroll primitives.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: t(META.newsTitle, locale),
    description: t(META.newsDescription, locale),
  };
}

export default async function TinTucPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const posts = sortedPosts();
  const [lead, ...rest] = posts;

  return (
    <div className="relative paper">
      <SiteNav locale={locale} />
      <main>
        <section className="relative isolate w-full overflow-x-clip paper py-24 sm:py-28">
          {/* Blueprint grid — same 56px / 5% as every other paper surface. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 [background:repeating-linear-gradient(0deg,rgba(21,22,26,0.05)_0_1px,transparent_1px_56px),repeating-linear-gradient(90deg,rgba(21,22,26,0.05)_0_1px,transparent_1px_56px)] [mask-image:radial-gradient(80%_70%_at_50%_50%,#000_35%,transparent_100%)]"
          />

          <header className="mx-auto max-w-6xl px-5 sm:px-8">
            <span className="s-fade inline-flex items-center gap-3 font-pixel text-sm uppercase tracking-[0.35em] text-clay sm:text-base">
              {t(NEWS_UI.label, locale)}
            </span>
            <h1 className="s-rise mt-4 max-w-3xl font-pixel text-[clamp(2rem,6vw,4.25rem)] uppercase leading-[0.9] text-ink">
              {t(NEWS_UI.titleA, locale)}{" "}
              <span className="text-clay">{t(NEWS_UI.titleAccent, locale)}</span>
            </h1>
            <p className="s-fade mt-6 max-w-2xl font-viet text-base font-light leading-relaxed text-ink-soft sm:text-lg">
              {t(NEWS_UI.lead, locale)}
            </p>
          </header>

          {posts.length === 0 ? (
            <p className="mx-auto mt-14 max-w-6xl px-5 font-viet text-base font-light text-ink-soft sm:px-8">
              {t(NEWS_UI.empty, locale)}
            </p>
          ) : (
            <div className="mx-auto mt-14 max-w-6xl px-5 sm:px-8">
              {/* ── Lead ── */}
              <article
                style={{ ["--tint" as string]: lead.tint }}
                className="s-rise group relative border border-ink/15 paper-card backdrop-blur-md transition-colors duration-300 hover:border-[color:var(--tint)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px] bg-[color:var(--tint)] [box-shadow:0_0_16px_var(--tint)]"
                />
                <div className="p-6 sm:p-9">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-pixel text-xs uppercase tracking-[0.18em] text-ink-soft">
                    <span className="border border-[color:var(--tint)]/45 px-2.5 py-1 tint-text">
                      {t(lead.category, locale)}
                    </span>
                    <time dateTime={lead.date}>{formatDate(lead.date, locale)}</time>
                    <span aria-hidden className="text-clay/60">
                      ·
                    </span>
                    <span>{readingMinutes(lead, locale)} {t(NEWS_UI.readingTime, locale)}</span>
                  </div>

                  {/* The title is the link and its hit area is stretched over the
                      whole card (`after:absolute inset-0`) — no nested anchors, so
                      nothing inside the card becomes unreachable by keyboard. */}
                  <h2 className="mt-4 max-w-3xl font-viet text-2xl font-bold leading-tight text-ink sm:text-[2rem]">
                    <Link
                      href={localePath(`/tin-tuc/${lead.slug}`, locale)}
                      className="transition-colors duration-200 after:absolute after:inset-0 after:content-[''] group-hover:text-ember"
                    >
                      {t(lead.title, locale)}
                    </Link>
                  </h2>
                  <p className="mt-4 max-w-2xl font-viet text-base font-light leading-relaxed text-ink-soft sm:text-lg">
                    {t(lead.excerpt, locale)}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-pixel text-base uppercase tracking-[0.15em] text-ink transition-colors duration-200 group-hover:text-ember">
                    {t(NEWS_UI.readMore, locale)} <span aria-hidden>▸</span>
                  </span>
                </div>
              </article>

              {/* ── The rest ── */}
              {rest.length ? (
                <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {rest.map((p) => (
                    <li
                      key={p.slug}
                      style={{ ["--tint" as string]: p.tint }}
                      className="s-rise group relative flex flex-col border border-ink/15 paper-card p-6 backdrop-blur-md transition-colors duration-300 hover:border-[color:var(--tint)]"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-[3px] bg-[color:var(--tint)]"
                      />
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-pixel text-xs uppercase tracking-[0.18em] text-ink-soft">
                        <span className="border border-[color:var(--tint)]/45 px-2.5 py-1 tint-text">
                          {t(p.category, locale)}
                        </span>
                        <time dateTime={p.date}>{formatDate(p.date, locale)}</time>
                      </div>
                      <h2 className="mt-4 font-viet text-lg font-bold leading-snug text-ink sm:text-xl">
                        <Link
                          href={localePath(`/tin-tuc/${p.slug}`, locale)}
                          className="transition-colors duration-200 after:absolute after:inset-0 after:content-[''] group-hover:text-ember"
                        >
                          {t(p.title, locale)}
                        </Link>
                      </h2>
                      <p className="mt-3 font-viet text-sm font-light leading-relaxed text-ink-soft">
                        {t(p.excerpt, locale)}
                      </p>
                      <span className="mt-auto pt-5 font-pixel text-xs uppercase tracking-[0.18em] text-ink-soft">
                        {readingMinutes(p, locale)} {t(NEWS_UI.readingTime, locale)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
