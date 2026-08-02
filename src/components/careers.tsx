import { ActGap, Headline } from "@/components/story-kit";
import { APPLY_HREF, PERKS, ROLES, STEPS } from "@/lib/careers";

/**
 * Chương 06 · Tuyển dụng — the invitation, framed as a JRPG "class select":
 * every open position is a playable class you can pick to join the party. The
 * framing is not decoration, it is the honest pitch — these are internships, so
 * what we can promise is a class, a skill tree and real quests, not a title.
 *
 * Copy lives in `src/lib/careers.ts`; each role's `tint` recolours its whole card
 * through the `--tint` var (sigil stage, accent bar, tags, stat bars). `klass` and
 * `sigil` are ASCII because they feed the pixel display face; every Vietnamese
 * string renders in `font-viet` / `font-pixel`.
 *
 * The `stats` bars are flavour, not literal metrics — they read as a class sheet.
 * Duties / requirements sit in native `<details>` so a visitor can scan five roles
 * without a wall of text, and it still needs no client JS.
 */
const TITLE = (
  <>
    Chọn <span className="text-clay">lớp nhân vật</span> của bạn
  </>
);

const LEAD = (
  <>
    VNZ đang ở chương đầu tiên. Nếu bạn muốn có tên trong những dòng đầu của câu
    chuyện này, đây là chỗ để bắt đầu.
  </>
);

/**
 * Lives on its own route (`/tuyen-dung`), not as a homepage chapter — five roles
 * with duties and requirements is a destination, and inlining it buried the
 * closing Tầm nhìn beat under a wall of `<details>`.
 *
 * `standalone` (the default) renders a page header. Passing `standalone={false}`
 * restores the numbered-chapter framing, so the block can be dropped back into
 * the homepage story without a rewrite.
 */
export function Careers({ standalone = true }: { standalone?: boolean } = {}) {
  const slots = ROLES.reduce((n, r) => n + r.slots, 0);

  return (
    <section
      id="careers"
      className="relative isolate w-full overflow-x-clip paper py-24 sm:py-28"
    >
      {standalone ? (
        <header className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <span className="s-fade inline-flex items-center gap-3 font-pixel text-sm uppercase tracking-[0.35em] text-clay sm:text-base">
            Tuyển dụng
          </span>
          <h1 className="s-rise mt-5 font-pixel text-[clamp(2rem,6vw,4.25rem)] uppercase leading-[0.9] text-ink">
            {TITLE}
          </h1>
          <p className="s-fade mx-auto mt-6 max-w-2xl font-viet text-base font-light leading-relaxed text-ink-soft sm:text-lg">
            {LEAD}
          </p>
        </header>
      ) : (
        <Headline label="Tuyển dụng" title={TITLE} lead={LEAD} />
      )}

      {/* Party status + perks. */}
      <div className="s-fade mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-pixel text-sm uppercase tracking-[0.2em] text-ink-soft sm:text-base">
        <span className="text-ember">{slots} suất đang mở</span>
        <span aria-hidden className="text-clay/80">
          ◆
        </span>
        <span>{ROLES.length} lớp nhân vật</span>
      </div>

      <ul className="s-fade mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-2.5 px-5 sm:px-8">
        {PERKS.map((p) => (
          <li
            key={p.label}
            className="inline-flex items-center gap-2 border border-ink/15 paper-card px-3.5 py-2 font-viet text-xs font-light text-ink-soft backdrop-blur-sm sm:text-sm"
          >
            <span aria-hidden className="text-clay">
              {p.glyph}
            </span>
            {p.label}
          </li>
        ))}
      </ul>

      {/* ── Class cards ── */}
      <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-5 px-5 sm:px-8 lg:grid-cols-3">
        {ROLES.map((r) => (
          <article
            key={r.slug}
            style={{ ["--tint" as string]: r.tint }}
            className="s-rise group relative flex h-full flex-col overflow-hidden border border-ink/15 paper-card backdrop-blur-md transition-colors duration-300 hover:border-[color:var(--tint)]"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-[3px] bg-[color:var(--tint)] [box-shadow:0_0_16px_var(--tint)]"
            />

            {/* Sigil stage — the class monogram, drawn big. */}
            <div className="relative flex h-32 items-center justify-center overflow-hidden border-b border-ink/15">
              <div
                aria-hidden
                className="animate-pulse-glow pointer-events-none absolute inset-0 opacity-45 [background:radial-gradient(55%_75%_at_50%_60%,var(--tint),transparent_70%)]"
              />
              <span
                aria-hidden
                className="relative font-pixel text-6xl uppercase leading-none text-ink transition-transform duration-500 group-hover:scale-110 [text-shadow:0_0_24px_var(--tint)]"
              >
                {r.sigil}
              </span>
              <span className="absolute right-3 top-3 border border-[color:var(--tint)]/50 bg-white/90 px-2 py-1 font-pixel text-xs uppercase leading-none tracking-[0.15em] tint-text">
                {r.slots} suất
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <span className="font-pixel text-sm uppercase tracking-[0.25em] tint-text">
                {r.klass}
              </span>
              <h3 className="mt-2 font-viet text-lg font-semibold leading-tight text-ink">
                {r.role}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2 font-pixel text-xs uppercase tracking-[0.15em] text-ink-soft">
                <span className="border border-ink/15 px-2 py-1">{r.type}</span>
                <span className="border border-ink/15 px-2 py-1">{r.level}</span>
              </div>

              <p className="mt-4 font-viet text-sm font-light leading-relaxed text-ink-soft">
                {r.summary}
              </p>

              {/* Class attributes. */}
              <dl className="mt-5 space-y-2">
                {r.stats.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <dt className="w-24 shrink-0 font-pixel text-xs uppercase tracking-[0.12em] text-ink-soft">
                      {s.label}
                    </dt>
                    <dd className="flex-1">
                      <div
                        className="statbar is-scrub"
                        role="meter"
                        aria-valuenow={s.value}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={s.label}
                        style={{
                          ["--val" as string]: `${s.value}%`,
                          ["--c" as string]: r.tint,
                          ["--delay" as string]: `${i * 0.1}s`,
                        }}
                      >
                        <span className="fill block" />
                      </div>
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Skill tree. */}
              <ul className="mt-5 flex flex-wrap gap-2">
                {r.stack.map((t) => (
                  <li
                    key={t}
                    className="border border-ink/15 bg-white/80 px-2.5 py-1 font-mono text-[11px] text-ink-soft"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              {/* Quest details. */}
              <div className="mt-5 divide-y divide-cream/10 border-y border-ink/15">
                <details className="group/d py-3">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 font-pixel text-sm uppercase tracking-[0.15em] text-ink-soft transition-colors hover:text-ember [&::-webkit-details-marker]:hidden">
                    Nhiệm vụ
                    <span
                      aria-hidden
                      className="tint-text transition-transform duration-300 group-open/d:rotate-45"
                    >
                      ＋
                    </span>
                  </summary>
                  <ul className="mt-3 space-y-2">
                    {r.duties.map((d) => (
                      <li
                        key={d}
                        className="flex gap-2 font-viet text-sm font-light leading-snug text-ink-soft"
                      >
                        <span
                          aria-hidden
                          className="mt-[2px] tint-text"
                        >
                          ▸
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </details>

                <details className="group/d py-3">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 font-pixel text-sm uppercase tracking-[0.15em] text-ink-soft transition-colors hover:text-ember [&::-webkit-details-marker]:hidden">
                    Yêu cầu
                    <span
                      aria-hidden
                      className="tint-text transition-transform duration-300 group-open/d:rotate-45"
                    >
                      ＋
                    </span>
                  </summary>
                  <ul className="mt-3 space-y-2">
                    {r.requirements.map((q) => (
                      <li
                        key={q}
                        className="flex gap-2 font-viet text-sm font-light leading-snug text-ink-soft"
                      >
                        <span
                          aria-hidden
                          className="mt-[2px] tint-text"
                        >
                          ▸
                        </span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>

              <div className="mt-auto pt-6">
                <a
                  href={APPLY_HREF}
                  className="inline-flex w-full items-center justify-center gap-2 border-2 border-ink/30 px-5 py-3 font-pixel text-base uppercase tracking-[0.12em] text-ink transition-colors duration-200 hover:border-ember hover:bg-ink/5 hover:text-ember"
                >
                  Ứng tuyển <span aria-hidden>▸</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ── Quest path — how the process runs ── */}
      <div className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <div className="s-rise text-center">
          <span className="font-pixel text-sm uppercase tracking-[0.4em] text-clay">
            Hành trình ứng tuyển
          </span>
          <h3 className="mt-3 font-pixel text-[clamp(1.6rem,4vw,2.75rem)] uppercase tracking-wide text-ink">
            Bốn bước để nhập cuộc
          </h3>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="s-rise relative border border-ink/15 bg-white/50 p-5 backdrop-blur-md"
            >
              <span
                aria-hidden
                className="font-pixel text-4xl leading-none text-clay/45"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="mt-2 font-pixel text-xl uppercase tracking-wide text-ink">
                {s.title}
              </h4>
              <p className="mt-2 font-viet text-sm font-light leading-relaxed text-ink-soft">
                {s.desc}
              </p>
              {/* Connector arrow between steps (desktop only). */}
              {i < STEPS.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute -right-3 top-1/2 hidden -translate-y-1/2 font-pixel text-xl text-clay/70 lg:block"
                >
                  ▸
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <ActGap />
    </section>
  );
}
