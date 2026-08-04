import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NEWS_UI, META } from "@/lib/dictionary";
import { LOCALES, localePath, t, type Locale } from "@/lib/i18n";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PostBody } from "@/components/post-body";
import {
  POSTS,
  formatDate,
  postBySlug,
  readingMinutes,
  sortedPosts,
} from "@/lib/posts";

/**
 * `/tin-tuc/<slug>` — one article per route.
 *
 * FULLY STATIC. `generateStaticParams` prerenders every post and
 * `dynamicParams = false` makes any other slug a 404 rather than an attempted
 * render — `POSTS` is a fixed list, so there is no such thing as a valid unknown
 * slug here.
 *
 * ONE COLUMN, NOT TWO. Every other page built this week uses a sticky rail; an
 * article should not. A measure of roughly 65–75 characters is what makes long
 * prose readable, and a sidebar competing with the text is the thing readers
 * complain about on company blogs. What would have gone in a rail — related
 * posts, the back link — sits above and below the article instead, where it
 * doesn't interrupt.
 *
 * `openGraph` is set per post so a link pasted into Zalo, Messenger or Slack
 * unfurls with the article's own title and excerpt rather than the site default.
 * `publishedTime` uses the post's `date`, which is a PLACEHOLDER until someone
 * confirms it — see the header of `src/lib/posts.ts`.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  // Every post in every language — the locale segment is part of the route, so
  // omitting it here would leave `/en/tin-tuc/<slug>` unprerendered.
  return LOCALES.flatMap((locale) => POSTS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = postBySlug(slug);
  if (!post) return { title: t(META.postNotFound, locale) };

  return {
    title: `${t(post.title, locale)} — VNZ`,
    description: t(post.excerpt, locale),
    openGraph: {
      type: "article",
      title: t(post.title, locale),
      description: t(post.excerpt, locale),
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  // Newest first, current post excluded, capped at two — enough to offer a next
  // read without turning the end of an article into a second index page.
  const related = sortedPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <div className="relative paper">
      <SiteNav locale={locale} />
      <main>
        <article
          style={{ ["--tint" as string]: post.tint }}
          className="relative isolate w-full overflow-x-clip paper py-24 sm:py-28"
        >
          {/* Blueprint grid — same 56px / 5% as every other paper surface. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 [background:repeating-linear-gradient(0deg,rgba(21,22,26,0.05)_0_1px,transparent_1px_56px),repeating-linear-gradient(90deg,rgba(21,22,26,0.05)_0_1px,transparent_1px_56px)] [mask-image:radial-gradient(80%_70%_at_50%_50%,#000_35%,transparent_100%)]"
          />

          {/* `max-w-3xl` IS THE POINT of this page — see the file note. Don't
              widen it to "use the space"; the space is what makes it readable. */}
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <nav aria-label={t(NEWS_UI.allPosts, locale)}>
              <Link
                href={localePath("/tin-tuc", locale)}
                className="inline-flex items-center gap-2 font-pixel text-sm uppercase tracking-[0.2em] text-ink-soft transition-colors duration-200 hover:text-ember"
              >
                <span aria-hidden>◂</span> {t(NEWS_UI.allPosts, locale)}
              </Link>
            </nav>

            <header className="mt-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-pixel text-xs uppercase tracking-[0.18em] text-ink-soft">
                <span className="border border-[color:var(--tint)]/45 px-2.5 py-1 tint-text">
                  {t(post.category, locale)}
                </span>
                <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                <span aria-hidden className="text-clay/60">
                  ·
                </span>
                <span>{readingMinutes(post, locale)} {t(NEWS_UI.readingTime, locale)}</span>
              </div>

              <h1 className="mt-5 font-viet text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-tight text-ink">
                {t(post.title, locale)}
              </h1>

              <p className="mt-5 font-viet text-lg font-light leading-relaxed text-ink-soft">
                {t(post.excerpt, locale)}
              </p>

              <p className="mt-6 border-t border-ink/12 pt-5 font-pixel text-sm uppercase tracking-[0.2em] text-ink-soft">
                {post.author}
              </p>
            </header>

            <div className="mt-10">
              <PostBody blocks={t(post.body, locale)} />
            </div>
          </div>

          {/* ── Related ── after the article, not beside it. */}
          {related.length ? (
            <aside className="mx-auto mt-20 max-w-3xl px-5 sm:px-8">
              <h2 className="font-pixel text-sm uppercase tracking-[0.3em] text-clay">
                {t(NEWS_UI.readNext, locale)}
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {related.map((p) => (
                  <li
                    key={p.slug}
                    style={{ ["--tint" as string]: p.tint }}
                    className="group relative border border-ink/15 paper-card p-5 backdrop-blur-md transition-colors duration-300 hover:border-[color:var(--tint)]"
                  >
                    <span className="font-pixel text-xs uppercase tracking-[0.18em] tint-text">
                      {t(p.category, locale)}
                    </span>
                    <h3 className="mt-1.5 font-viet text-base font-semibold leading-snug text-ink">
                      <Link
                        href={localePath(`/tin-tuc/${p.slug}`, locale)}
                        className="transition-colors duration-200 after:absolute after:inset-0 after:content-[''] group-hover:text-ember"
                      >
                        {t(p.title, locale)}
                      </Link>
                    </h3>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </article>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
