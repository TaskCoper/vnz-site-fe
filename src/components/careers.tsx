import Link from "next/link";
import { PERKS, ROLES, STEPS, applyPath } from "@/lib/careers";
import { CAREERS_UI } from "@/lib/dictionary";
import { localePath, t, type Locale } from "@/lib/i18n";

/**
 * `/tuyen-dung` — the job list, built the way a careers page is built.
 *
 * IT WAS A JRPG "CLASS SELECT": three cards, each with a big ASCII monogram on a
 * glowing stage, an invented four-bar attribute sheet, and duties hidden behind
 * `<details>` toggles. That framing was cut. A careers page has exactly one job —
 * help someone decide whether to apply — and every one of those elements worked
 * against it: the monogram took the space the job title should have had, the stat
 * bars put made-up numbers next to a real position, and collapsing "Nhiệm vụ" and
 * "Yêu cầu" hid the two things the reader came for behind a click each.
 *
 * WHAT IT IS NOW: a scannable list of open roles, each linking to a full job
 * description at `/tuyen-dung/<slug>`. Everything needed to triage a role — title,
 * department, employment type, level, headcount, one-line summary, stack — is on
 * the row itself, so nobody opens a detail page to find out it wasn't for them.
 *
 * NO FILTER BAR, and that is deliberate rather than unfinished. Three roles fit on
 * one screen; a department/type filter over three items is the same mistake as a
 * marquee over three logos (see the long note in `partners.tsx`) — the control
 * advertises a volume that isn't there and costs a click to reach what was already
 * visible. Add filters when the list stops fitting on a screen, and build them on
 * `searchParams` rather than client state so a filtered view stays linkable.
 *
 * Server component. Reveals are the native CSS scroll primitives (`.s-*`); no
 * client JS, and the `<details>` elements are gone with the card design.
 */
export function Careers({ locale }: { locale: Locale }) {
  const slots = ROLES.reduce((n, r) => n + r.slots, 0);

  // Grouped by team, because that is how someone scans a job list — they are
  // looking for their own discipline first. Derived from the data, so a new
  // department appears on its own the moment a role carries it.
  // Grouped by the VIETNAMESE department name, which is the stable key — grouping
  // on the active language would silently re-shuffle the page between locales.
  const departments = [...new Set(ROLES.map((r) => r.department.vi))];

  return (
    <section
      id="careers"
      className="relative isolate w-full overflow-x-clip paper py-24 sm:py-28"
    >
      {/* Blueprint grid — same 56px / 5% as every other paper surface. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:repeating-linear-gradient(0deg,rgba(21,22,26,0.05)_0_1px,transparent_1px_56px),repeating-linear-gradient(90deg,rgba(21,22,26,0.05)_0_1px,transparent_1px_56px)] [mask-image:radial-gradient(80%_70%_at_50%_50%,#000_35%,transparent_100%)]"
      />

      {/* Left-aligned, like `/lien-he` and unlike the homepage chapters: the body
          below is a left-aligned list, and a centred title over it leaves the eye
          starting in the middle and jumping left for every row. */}
      <header className="mx-auto max-w-6xl px-5 sm:px-8">
        <span className="s-fade inline-flex items-center gap-3 font-pixel text-sm uppercase tracking-[0.35em] text-clay sm:text-base">
          {t(CAREERS_UI.label, locale)}
        </span>
        <h1 className="s-rise mt-4 max-w-3xl font-pixel text-[clamp(2rem,6vw,4.25rem)] uppercase leading-[0.9] text-ink">
          {t(CAREERS_UI.titleA, locale)}{" "}
          <span className="text-clay">{t(CAREERS_UI.titleAccent, locale)}</span>
          {t(CAREERS_UI.titleB, locale)}
        </h1>
        <p className="s-fade mt-6 max-w-2xl font-viet text-base font-light leading-relaxed text-ink-soft sm:text-lg">
          {t(CAREERS_UI.lead, locale)}
        </p>

        {/* Counts derived, never typed, so they cannot go stale when a role is
            added or filled. */}
        <div className="s-fade mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-pixel text-sm uppercase tracking-[0.2em] text-ink-soft sm:text-base">
          <span className="text-ember">
            {ROLES.length} {t(CAREERS_UI.openRoles, locale)}
          </span>
          <span aria-hidden className="text-clay/60">
            ·
          </span>
          <span>
            {slots} {t(CAREERS_UI.headcount, locale)}
          </span>
        </div>
      </header>

      {/* ── Job list ── */}
      <div className="mx-auto mt-14 max-w-6xl px-5 sm:px-8">
        {departments.map((dept) => (
          <div key={dept} className="mb-12 last:mb-0">
            <h2 className="font-pixel text-sm uppercase tracking-[0.3em] text-clay">
              {t(ROLES.find((r) => r.department.vi === dept)!.department, locale)}
              <span className="ml-3 text-ink-soft/70">
                {ROLES.filter((r) => r.department.vi === dept).length}{" "}
                {t(CAREERS_UI.rolesInDept, locale)}
              </span>
            </h2>

            <ul className="mt-5 flex flex-col gap-4">
              {ROLES.filter((r) => r.department.vi === dept).map((r) => (
                <li
                  key={r.slug}
                  style={{ ["--tint" as string]: r.tint }}
                  className="s-rise group relative border border-ink/15 paper-card backdrop-blur-md transition-colors duration-300 hover:border-[color:var(--tint)]"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[3px] bg-[color:var(--tint)]"
                  />

                  <div className="flex flex-col gap-5 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                    <div className="min-w-0">
                      {/* THE TITLE IS THE LINK, and the whole row is not. A
                          card-wide anchor swallows the "Ứng tuyển" button inside
                          it — nested interactive elements are invalid, and the
                          button stops being separately reachable by keyboard.
                          `after:absolute inset-0` instead stretches the title's
                          hit area over the card while leaving the button a real
                          sibling above it (`relative z-10`). */}
                      <h3 className="font-viet text-lg font-semibold leading-snug text-ink sm:text-xl">
                        <Link
                          href={localePath(`/tuyen-dung/${r.slug}`, locale)}
                          className="transition-colors duration-200 after:absolute after:inset-0 after:content-[''] group-hover:text-ember"
                        >
                          {t(r.role, locale)}
                        </Link>
                      </h3>

                      {/* Meta row — everything needed to rule a role in or out
                          without opening it. Optional fields render only when
                          they exist; see the note in `careers.ts`. */}
                      <ul className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-pixel text-xs uppercase tracking-[0.15em] text-ink-soft">
                        <li className="border border-ink/15 px-2.5 py-1">
                          {t(r.employment, locale)}
                        </li>
                        <li className="border border-ink/15 px-2.5 py-1">
                          {r.level}
                        </li>
                        <li className="border border-ink/15 px-2.5 py-1">
                          {r.slots} {t(CAREERS_UI.headcount, locale)}
                        </li>
                        {r.workMode ? (
                          <li className="border border-ink/15 px-2.5 py-1">
                            {t(r.workMode!, locale)}
                          </li>
                        ) : null}
                        {r.location ? (
                          <li className="border border-ink/15 px-2.5 py-1">
                            {t(r.location!, locale)}
                          </li>
                        ) : null}
                        {r.salary ? (
                          <li className="border border-ember/40 px-2.5 py-1 text-ember">
                            {t(r.salary!, locale)}
                          </li>
                        ) : null}
                      </ul>

                      <p className="mt-4 max-w-2xl font-viet text-sm font-light leading-relaxed text-ink-soft">
                        {t(r.summary, locale)}
                      </p>

                      <ul className="mt-4 flex flex-wrap gap-2">
                        {r.stack.map((t) => (
                          <li
                            key={t}
                            className="border border-ink/12 bg-white/70 px-2.5 py-1 font-mono text-[11px] text-ink-soft"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* `relative z-10` keeps these above the title's stretched
                        hit area — otherwise the card link would eat both. */}
                    <div className="relative z-10 flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col">
                      <Link
                        href={localePath(`/tuyen-dung/${r.slug}`, locale)}
                        className="font-pixel inline-flex items-center justify-center gap-2 whitespace-nowrap border-2 border-ink/30 px-5 py-2.5 text-base uppercase tracking-[0.12em] text-ink transition-colors duration-200 hover:border-ember hover:bg-ink/5 hover:text-ember"
                      >
                        {t(CAREERS_UI.viewDetail, locale)}
                      </Link>
                      <Link
                        href={localePath(applyPath(r.slug), locale)}
                        className="btn-pixel font-pixel inline-flex items-center justify-center gap-2 whitespace-nowrap px-5 py-2.5 text-base uppercase tracking-[0.12em]"
                      >
                        {t(CAREERS_UI.apply, locale)} <span aria-hidden>▸</span>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Quyền lợi ── */}
      <div className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <h2 className="s-rise font-pixel text-[clamp(1.6rem,4vw,2.75rem)] uppercase tracking-wide text-ink">
          {t(CAREERS_UI.benefits, locale)}
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PERKS.map((p) => (
            <li
              key={p.title.vi}
              className="s-rise border border-ink/15 paper-card p-5 backdrop-blur-md"
            >
              <h3 className="font-viet text-base font-semibold leading-snug text-ink">
                {t(p.title, locale)}
              </h3>
              <p className="mt-2 font-viet text-sm font-light leading-relaxed text-ink-soft">
                {t(p.desc, locale)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Quy trình ứng tuyển ── */}
      <div className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <h2 className="s-rise font-pixel text-[clamp(1.6rem,4vw,2.75rem)] uppercase tracking-wide text-ink">
          {t(CAREERS_UI.process, locale)}
        </h2>
        <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li
              key={s.title.vi}
              className="s-rise relative border border-ink/15 bg-white/50 p-5 backdrop-blur-md"
            >
              <span
                aria-hidden
                className="font-pixel text-4xl leading-none text-clay/45"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-viet text-base font-semibold leading-snug text-ink">
                {t(s.title, locale)}
              </h3>
              <p className="mt-2 font-viet text-sm font-light leading-relaxed text-ink-soft">
                {t(s.desc, locale)}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Không thấy vị trí phù hợp ──
          Standard on a real careers page, and honest here: the list is three
          roles long, so a good candidate whose discipline isn't on it is a
          likely visitor rather than an edge case. */}
      <div className="s-fade mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <div className="border border-ink/15 paper-card p-7 backdrop-blur-md sm:p-9">
          <h2 className="font-pixel text-[clamp(1.3rem,2.6vw,1.85rem)] uppercase leading-tight text-ink">
            {t(CAREERS_UI.noFitTitle, locale)}
          </h2>
          <p className="mt-3 max-w-2xl font-viet text-sm font-light leading-relaxed text-ink-soft sm:text-base">
            {t(CAREERS_UI.noFitBody, locale)}
          </p>
          <Link
            href={localePath(applyPath(), locale)}
            className="btn-pixel font-pixel mt-6 inline-flex items-center gap-2 px-7 py-3 text-lg uppercase tracking-wider"
          >
            {t(CAREERS_UI.noFitCta, locale)} <span aria-hidden>▸</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
