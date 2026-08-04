import Image from "next/image";
import PixelTransition from "@/components/bits/PixelTransition";
import { MEMBERS, departmentOf } from "@/lib/members";
import { TEAM_UI } from "@/lib/dictionary";
import { localePath, t, type Locale } from "@/lib/i18n";

/**
 * Đội ngũ — the member strip.
 *
 * NO SECTION OF ITS OWN ANY MORE. This used to be chương 04, a `<section>` with
 * its own label and vertical rhythm. It is now a PANEL inside the Dấu ấn act
 * (`products-act.tsx`): the team slides in from the right after the last product
 * and its strip is scrolled horizontally by the same scroll that drives the rest
 * of the act. What is exported here is just the strip, so the act owns the
 * framing and this file owns the cards.
 *
 * The strip is the `.hstrip` primitive from globals.css: flex, `overflow-x: auto`,
 * x-proximity snap, scrollbar hidden. Cards are fixed-width so a partial card is
 * always visible at the right edge — that clipped card is what tells you the row
 * continues, so don't switch it to a fitted grid. Inside the act GSAP also
 * translates the track, and the native overflow stays as the no-JS fallback.
 *
 * Two naming layers, exactly as `src/lib/members.ts` documents: `name` is ASCII
 * and drives the pixel display line, while `fullName` / `title` / `hometown`
 * carry full diacritics and render in `font-viet`. Never swap those — the pixel
 * display faces have no Vietnamese glyphs.
 *
 * The card badges are REAL DATA now, not RPG flavour: the left badge is the
 * member's seniority (hidden until `seniority` is filled in) and the right corner
 * is their department, derived from `title` by `departmentOf`.
 *
 * `PixelTransition` on each card's stage dissolves the member in their own
 * `tint` and leaves their hometown standing alone. The name plate below never
 * moves, so hover never hides information.
 */

/** How many make the strip. The rest live on `/doi-ngu`. */
const PREVIEW_COUNT = 6;

export function TeamStrip({ locale }: { locale: Locale }) {
  const preview = MEMBERS.slice(0, PREVIEW_COUNT);
  const remaining = MEMBERS.length - preview.length;

  return (
        <ul className="hstrip mx-auto max-w-[100rem] list-none pb-4">
          {preview.map((m) => (
            <li
              key={m.slug}
              style={{ ["--tint" as string]: m.tint }}
              className="group relative flex w-[15rem] shrink-0 flex-col overflow-hidden border border-ink/15 paper-card transition-colors duration-300 hover:border-[color:var(--tint)] sm:w-[17rem]"
            >
              <PixelTransition
                className="aspect-[3/4] w-full"
                aspectRatio="0%"
                gridSize={9}
                pixelColor={m.tint}
                animationStepDuration={0.32}
                firstContent={
                  <>
                    <Image
                      src={m.hometownImg}
                      alt={`${t(TEAM_UI.hometownAlt, locale)} ${m.hometown}`}
                      fill
                      unoptimized
                      sizes="17rem"
                      className="pixelated scale-105 object-cover opacity-40"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/25 to-ink-navy"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-40 mix-blend-multiply [background:repeating-linear-gradient(0deg,rgba(0,0,0,0.22)_0_1px,transparent_1px_3px)]"
                    />
                    <div className="ground-shadow absolute inset-x-0 bottom-0 flex h-[86%] items-end justify-center">
                      <Image
                        src={m.img}
                        alt={m.fullName}
                        unoptimized
                        className="pixelated h-full w-auto object-contain object-bottom"
                      />
                    </div>
                    {/* Real seniority, not the old RPG "LV 42". Omitted entirely
                        while `seniority` is unset — an empty badge reads as a bug,
                        and a guessed one would be worse. */}
                    {m.seniority ? (
                      <span className="absolute left-2 top-2 border border-cream/20 bg-ink/80 px-2 py-1 font-pixel text-xs uppercase leading-none tracking-[0.15em] text-[color:var(--tint)] backdrop-blur-sm">
                        {m.seniority}
                      </span>
                    ) : null}
                    {/* Department, derived from `title` via the map in members.ts
                        — replaces the RPG class ("Visionary", "Ranger"). */}
                    <span className="absolute right-2 top-2 font-pixel text-xs uppercase tracking-[0.15em] text-cream/60">
                      {t(departmentOf(m.title), locale)}
                    </span>
                  </>
                }
                secondContent={
                  <>
                    <Image
                      src={m.hometownImg}
                      alt=""
                      fill
                      unoptimized
                      sizes="17rem"
                      className="pixelated scale-110 object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                      <p className="font-ui text-[10px] uppercase tracking-[0.28em] text-gold">
                        {t(TEAM_UI.hometownLabel, locale)}
                      </p>
                      <p className="mt-1 font-pixel text-2xl uppercase leading-none text-cream">
                        {m.hometown}
                      </p>
                    </div>
                  </>
                }
              />

              <div className="relative flex flex-1 flex-col gap-1 px-4 pb-5 pt-3">
                <h3 className="font-pixel text-2xl uppercase leading-none text-ink">
                  {m.name}
                </h3>
                <p className="font-viet text-sm font-medium leading-snug tint-text">
                  {t(m.title, locale)}
                </p>
                <p className="font-viet text-xs font-light leading-snug text-ink-soft">
                  {m.fullName}
                </p>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[3px] w-0 bg-[color:var(--tint)] transition-[width] duration-500 group-hover:w-full [box-shadow:0_0_16px_var(--tint)]"
                />
              </div>
            </li>
          ))}

          {/* Tail tile — the handoff to the full roster, sized like a card so the
              row reads as continuing rather than ending. */}
          <li className="shrink-0">
            <a
              href={localePath("/doi-ngu", locale)}
              className="group flex h-full w-[15rem] flex-col items-center justify-center gap-3 border border-dashed border-ink/25 paper-card px-6 text-center transition-colors duration-300 hover:border-ember sm:w-[17rem]"
            >
              <span className="font-pixel text-5xl leading-none text-ink-soft/50 transition-colors duration-300 group-hover:text-ember">
                +{remaining}
              </span>
              <span className="font-pixel text-xl uppercase leading-tight text-ink-soft transition-colors duration-300 group-hover:text-ink">
                {t(TEAM_UI.seeAllLine1, locale)}
                <br />
                {t(TEAM_UI.seeAllLine2, locale)}
              </span>
              <span className="font-viet text-xs font-light text-ink-soft/70">
                {remaining} {t(TEAM_UI.moreMembers, locale)}
              </span>
              <span
                aria-hidden
                className="font-pixel text-lg text-ember opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                ▸
              </span>
            </a>
          </li>
        </ul>
  );
}
