"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Chapter } from "@/components/story-kit";
import { TeamStrip } from "@/components/team";
import { PRODUCTS, type Product } from "@/lib/products";
import { PRODUCTS_UI } from "@/lib/dictionary";
import { localePath, t, type Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

/**
 * Chương 03 · Dấu ấn VNZ — the products, as a pinned, scroll-scrubbed conveyor.
 *
 * The second pinned act on the page, built the same way as `story-truth.tsx` and
 * for the same reason: the order matters and it has to be tied to scroll POSITION,
 * not to a timer or to "is it on screen yet".
 *
 * ONE PRODUCT AT A TIME. The rows used to sit stacked in normal flow, both visible
 * at once. Now the stage holds still and each product is dealt onto it:
 *
 *   ENTER   its four parts slide in from the LEFT, one after another —
 *           icon → wordmark → the pitch text → the CTA
 *   EXIT    the assembled product slides off to the RIGHT as one piece
 *   then    the next product enters from the LEFT again
 *
 * Same direction throughout, so it reads as a belt running past rather than
 * things bouncing in and out of the same edge.
 *
 * PARTS ENTER SEPARATELY, THE PRODUCT LEAVES WHOLE. That asymmetry is the point:
 * assembling piece by piece is what makes you read each part, and leaving in one
 * move is what makes room for the next without a second slow disassembly.
 *
 * Pinning is CSS `position: sticky`, not ScrollTrigger's `pin` — see the long note
 * in `story-truth.tsx`; the reasons are identical (a `fixed` pin misbehaves inside
 * the section's `overflow-x-clip`, and sticky leaves native scrolling alone).
 *
 * NO `.s-*` CLASSES IN HERE. The old rows carried `s-rise` / `s-fade`, which are
 * the CSS scroll-driven reveals. Leaving them on would mean two systems animating
 * the same opacity — GSAP would win at some scroll positions and the CSS timeline
 * at others, and parts would flicker. GSAP owns these elements now.
 *
 * SSR, no-JS and reduced motion all get the SAME plain layout: the markup renders
 * FINISHED (nothing is opacity-0 in a className) and the wrapper is one viewport
 * tall, so both products simply stack and read as a normal list. The runway is
 * added from JS and only once we have decided to animate.
 */

/**
 * Scroll distance the stage stays stuck for, on top of its own viewport.
 * The timeline is 17.5 units wide — four reveal steps, a hold and an exit per
 * product (6.25 each), the team panel entering (1), the strip's sideways travel
 * (3) and a tail hold (1). At 900svh that is a bit over half a viewport of
 * scrolling per unit. THE dial for this section's rhythm: the act read as
 * rushed at 580svh over 13.5 units, so both numbers went up together.
 *
 * RUNWAY AND UNIT COUNT MOVE TOGETHER. Whenever a beat is added, grow this by the
 * same proportion — scroll-per-unit is the thing that has been tuned by eye, and
 * holding it constant is what keeps a new beat from re-pacing the whole act.
 *
 * The percentages on `.p-strip` in globals.css are a fraction of these 16 units
 * — retune them whenever the unit layout changes.
 */
const RUNWAY = "900svh";

/** Seconds of timeline per step. One unit ≈ one reveal. */
const STEP = 1;

/**
 * Beat the finished product sits still before it leaves. Without it the CTA —
 * the LAST part to arrive and the only one you can act on — finished its own
 * 0.85-unit slide barely a rounding error before the exit began, so the payoff
 * of the whole four-step assembly was never actually on screen.
 */
const HOLD = STEP * 1.25;

/**
 * A locked product's pitch column. Same shape as a released one — headline,
 * paragraph, bullet list — so the two products read as one layout rather than as
 * a product next to an "empty" slot, but every line is meaningless filler from
 * `PRODUCTS_UI.locked*` under a blur.
 *
 * THE FILLER IS NOT THE REAL COPY. A locked product ships no detail text at all
 * — `src/lib/products.ts` omits `tagline` / `desc` / `features` on purpose so the
 * unreleased pitch never reaches the browser, and keeps the real draft in a
 * comment the build strips. These strings exist only to give the blur something
 * text-shaped to blur, and are deliberately generic: someone who opens devtools
 * and deletes the blur finds nothing worth reading, which is the whole point.
 * NEVER paste the real pitch into the dictionary to "make the blur look right".
 *
 * `aria-hidden` on the blurred block, with a real sentence for screen readers
 * underneath: blurred nonsense is worse than useless when read aloud.
 */
function LockedPitch({ locale }: { locale: Locale }) {
  return (
    <>
      <div aria-hidden className="select-none blur-[6px]">
        <h3 className="mt-4 font-pixel text-[clamp(1.4rem,2.8vw,2.1rem)] uppercase leading-[0.95] text-ink">
          {t(PRODUCTS_UI.lockedTagline, locale)}
        </h3>
        <p className="mt-3 max-w-xl font-viet text-sm font-light leading-relaxed text-ink-soft sm:text-base">
          {t(PRODUCTS_UI.lockedDesc, locale)}
        </p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <li
              key={i}
              className="flex gap-2.5 font-viet text-sm font-light leading-snug text-ink-soft"
            >
              <span aria-hidden className="mt-[2px] tint-text">
                ▸
              </span>
              {t(PRODUCTS_UI.lockedFeature, locale)}
            </li>
          ))}
        </ul>
      </div>
      <p className="sr-only">{t(PRODUCTS_UI.lockedSr, locale)}</p>
    </>
  );
}

/**
 * One product. `data-p` numbers the four reveal steps in the order they enter —
 * it is what the timeline reads, so renumber here to re-sequence. Art is always
 * on the left and the pitch always on the right; rows do not alternate.
 */
function ProductRow({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const external = product.href.startsWith("http");

  return (
    <article
      style={{ ["--tint" as string]: product.tint }}
      className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12"
    >
      {/* ── Box art: icon, then wordmark under it ── */}
      <div>
        <div className="relative mx-auto flex w-full max-w-[16rem] flex-col items-center gap-5">
          {/* `animate-bob` rides on the inner wrapper rather than the <Image>,
              because the image is `fill`-positioned and a transform on it would
              fight the inset. GSAP animates the OUTER `data-p` wrapper, so the bob
              and the slide-in never write to the same element. */}
          <div data-p="1" className="relative w-full">
            {/* Tint bloom behind the mark. It has to live INSIDE `data-p="1"`:
                parked outside it, the glow was not part of the slide-in, so it sat
                at full strength in the icon's final position while the icon itself
                was still crossing the screen — a bright orphan blob with nothing
                under it. */}
            <div
              aria-hidden
              className="animate-pulse-glow pointer-events-none absolute -inset-8 -z-10 opacity-60 [background:radial-gradient(60%_60%_at_50%_50%,var(--tint),transparent_70%)]"
            />
            <div
              className="animate-bob relative w-full"
              style={{ aspectRatio: product.logoRatio }}
            >
              <Image
                src={product.logo}
                alt={`${product.name} — ${t(PRODUCTS_UI.logoAlt, locale)}`}
                fill
                unoptimized
                sizes="(max-width:1024px) 60vw, 22rem"
                className="pixelated object-contain [filter:drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]"
              />
            </div>
          </div>

          <Image
            data-p="2"
            src={product.wordmark}
            alt={product.name}
            unoptimized
            className={`pixelated w-auto ${product.wordmarkClass ?? "h-9 sm:h-11"}`}
          />
        </div>
      </div>

      {/* ── Pitch ── */}
      <div>
        <div data-p="3">
          <span className="font-pixel text-sm uppercase tracking-[0.3em] tint-text">
            {t(product.category, locale)}
          </span>

          {product.tagline ? (
            <>
              <h3 className="mt-4 font-pixel text-[clamp(1.4rem,2.8vw,2.1rem)] uppercase leading-[0.95] text-ink">
                {t(product.tagline, locale)}
              </h3>
              <p className="mt-3 max-w-xl font-viet text-sm font-light leading-relaxed text-ink-soft sm:text-base">
                {product.desc ? t(product.desc, locale) : null}
              </p>

              {product.features ? (
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {t(product.features, locale).map((f) => (
                    <li
                      key={f}
                      className="flex gap-2.5 font-viet text-sm font-light leading-snug text-ink-soft"
                    >
                      <span aria-hidden className="mt-[2px] tint-text">
                        ▸
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : (
            <LockedPitch locale={locale} />
          )}
        </div>

        {/* Both products get a CTA, so both run the same four-step reveal. The
            label comes from the data: a released product says "Trải nghiệm thử",
            a locked one "Nhận tin ra mắt". It is NOT blurred — the blur is for the
            copy that does not exist yet, and the one thing a visitor can actually
            do here has to stay legible and clickable. */}
        <a
          data-p="4"
          href={external ? product.href : localePath(product.href, locale)}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="btn-pixel font-pixel mt-7 inline-flex items-center gap-2 px-6 py-2.5 text-base uppercase tracking-wider"
        >
          {t(product.cta, locale)} <span aria-hidden>▸</span>
        </a>
      </div>
    </article>
  );
}

export function ProductsAct({ locale }: { locale: Locale }) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  // Released first, locked last, so the chapter opens on something real. The
  // spread keeps `PRODUCTS` itself untouched as the canonical data order.
  const ordered = [...PRODUCTS].sort(
    (a, b) => Number(!!a.locked) - Number(!!b.locked),
  );

  useLayoutEffect(() => {
    const wrapEl = wrap.current;
    const stageEl = stage.current;
    if (!wrapEl || !stageEl) return;

    // Leave the finished, one-viewport layout alone for reduced-motion users.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    wrapEl.style.height = `calc(100svh + ${RUNWAY})`;

    const ctx = gsap.context(() => {
      const projects = gsap.utils.toArray<HTMLElement>("[data-proj]");
      if (!projects.length) return;

      // Everything starts off the LEFT edge. Only the first product's parts are
      // ever brought back to 0 before its own turn, so nothing is on stage at
      // scroll 0 except an empty field.
      for (const proj of projects) {
        const parts = gsap.utils
          .toArray<HTMLElement>("[data-p]", proj)
          .sort((a, b) => Number(a.dataset.p) - Number(b.dataset.p));
        gsap.set(parts, { xPercent: -120, opacity: 0 });
        gsap.set(proj, { xPercent: 0, opacity: 1 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      let at = 0;
      projects.forEach((proj, pi) => {
        const parts = gsap.utils
          .toArray<HTMLElement>("[data-p]", proj)
          .sort((a, b) => Number(a.dataset.p) - Number(b.dataset.p));

        // ENTER — one part per step, from the left.
        parts.forEach((part) => {
          tl.to(
            part,
            {
              xPercent: 0,
              opacity: 1,
              ease: "power2.out",
              duration: STEP * 0.85,
            },
            at,
          );
          at += STEP;
        });

        // HOLD — assembled, still, readable. See `HOLD`.
        at += HOLD;

        // EXIT — the assembled product leaves to the right, as one piece. EVERY
        // product exits now, the last one included: the team panel comes in behind
        // it, so leaving it on stage would have the two overlapping.
        void pi;
        tl.to(
          proj,
          { xPercent: 120, opacity: 0, ease: "power2.in", duration: STEP * 1.1 },
          at,
        );
        at += STEP;
      });

      // ── TEAM ── slides in from the RIGHT, the opposite edge the products
      // leave by, so it reads as a new act arriving rather than one more product.
      const team = stageEl.querySelector<HTMLElement>("[data-team]");
      const labelProducts = stageEl.querySelector<HTMLElement>("[data-label='products']");
      const labelTeam = stageEl.querySelector<HTMLElement>("[data-label='team']");
      if (labelTeam) gsap.set(labelTeam, { opacity: 0 });

      if (team) {
        gsap.set(team, { xPercent: 120, opacity: 0 });
        tl.to(
          team,
          { xPercent: 0, opacity: 1, ease: "power3.out", duration: STEP * 1.2 },
          at,
        );
        // The heading swaps on the same beat the panel arrives.
        if (labelProducts) {
          tl.to(labelProducts, { opacity: 0, ease: "none", duration: STEP * 0.6 }, at);
        }
        if (labelTeam) {
          tl.to(labelTeam, { opacity: 1, ease: "none", duration: STEP * 0.6 }, at + STEP * 0.5);
        }
        at += STEP;

        // The strip's own sideways travel is NOT driven from here. It runs on a
        // native `animation-timeline` (see `.p-strip` in globals.css), which the
        // compositor evaluates off the main thread — the same mechanism the
        // original site's inspirations rail uses, and the reason that one is
        // smooth. Scrubbing it from ScrollTrigger stuttered: every frame of it
        // competed with the WebGL hero, the spark canvas and the cursor for the
        // main thread. GSAP still owns the panel's ENTRANCE above; only the
        // horizontal travel moved to CSS.
        //
        // Reserve the timeline room the strip needs, so the act's runway still
        // covers it and the tail hold lands after the strip has finished. Paired
        // with `animation-range` on `.p-strip` — see the note there.
        at += STEP * 3;
      }

      // Tail hold so the last product is readable before the stage unsticks.
      tl.to({}, { duration: STEP }, at);
    }, stage);

    return () => {
      ctx.revert();
      wrapEl.style.height = "";
    };
  }, []);

  return (
    <div ref={wrap} className="p-act relative h-svh">
      <div
        ref={stage}
        className="sticky top-0 flex h-svh items-center overflow-hidden"
      >
        {/* ── Grid field ──
            One product on a full viewport leaves a lot of bare ivory, and a flat
            empty ground made the stage read as unfinished rather than spacious.
            This is the same blueprint grid the old roster cards used: two
            `repeating-linear-gradient`s crossed at 56px, in ink at 5% so it reads
            as paper tooth rather than as a table.

            The radial mask is what keeps it from looking like a screenshot of a
            spreadsheet — the lines are strongest in the middle and dissolve before
            they reach any edge, so the grid has no visible border of its own. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 [background:repeating-linear-gradient(0deg,rgba(21,22,26,0.05)_0_1px,transparent_1px_56px),repeating-linear-gradient(90deg,rgba(21,22,26,0.05)_0_1px,transparent_1px_56px)] [mask-image:radial-gradient(80%_70%_at_50%_50%,#000_35%,transparent_100%)]"
        />

        {/* The chapter label lives INSIDE the pinned stage. Left in the section
            shell it scrolled away in the first few hundred pixels and the other
            four-and-a-half screens of the act ran with no label on them at all. */}
        <div className="pointer-events-none absolute inset-x-0 top-24 z-10 grid text-center sm:top-28">
          {/* ONE label slot, two labels stacked in the same grid cell. The act
              covers two chapters, so the heading has to change when the stage
              does — a second label sitting further down the page would have read
              as a new section starting, which is exactly what this act is not.
              Both are in the same cell (`grid` + `col-start-1 row-start-1`) so
              the crossfade happens in place with no reflow. */}
          <span data-label="products" className="col-start-1 row-start-1">
            <Chapter label={t(PRODUCTS_UI.chapter, locale)} />
          </span>
          <span data-label="team" className="col-start-1 row-start-1">
            <Chapter label={t(PRODUCTS_UI.teamChapter, locale)} />
          </span>
        </div>

        {/* Every product occupies the same box. They are absolutely stacked
            rather than laid out in flow, so a product sliding out and the next
            sliding in share one centre instead of pushing each other around. */}
        {ordered.map((p) => (
          <div
            key={p.slug}
            data-proj
            className="absolute inset-0 flex items-center"
          >
            <ProductRow product={p} locale={locale} />
          </div>
        ))}

        {/* ── Team panel ──
            Carries `id="team"` because this is where that anchor now resolves:
            the chapter no longer has a section of its own. `overflow-hidden` on
            the track's parent is what lets GSAP translate the strip without the
            cards spilling across the stage. */}
        <div
          data-team
          id="team"
          /* `pt-*` KEEPS THE CARDS OFF THE CHAPTER LABEL. The panel is centred in
             the stage, but a member card is ~460px tall and the label is pinned
             inside the same stage at `top-24 sm:top-28` — on a short viewport the
             centred strip started 43px ABOVE the label's baseline and the cards
             ran straight through "Đội ngũ". The padding reserves the label's
             band; `justify-center` then centres what is left, so the strip still
             sits low on tall viewports instead of being nailed to the top.
             Paired with the label's own offsets — move one, move both. */
          className="absolute inset-0 flex flex-col items-center justify-center gap-8 pt-32 sm:pt-36"
        >
          {/* Clips the strip. `.p-strip` on the inner wrapper is what actually
              moves — a CSS scroll-timeline animation, not GSAP. */}
          <div className="w-full overflow-hidden">
            <div className="p-strip">
              <TeamStrip locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
