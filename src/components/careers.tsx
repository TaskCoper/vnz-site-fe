"use client";

import { useEffect, useState } from "react";
import { ROLES, PERKS, STEPS, APPLY_HREF, type Role } from "@/lib/careers";

/**
 * "Tuyển dụng" — the VNZ recruitment section, built as an interactive 16-bit
 * JRPG "class select" screen: a class roster on the left (with a blinking ▶
 * menu cursor, à la Final Fantasy) drives a big "character sheet" on the right.
 * This master-detail layout is deliberately NOT the card-grid the Đối tác /
 * Sản phẩm sections use — it keeps the shared pixel language (dark `bg-ink`
 * stage, scanline/grid texture, warm glow, `.btn-pixel`, `.statbar`, the
 * per-role `--tint` hook) without repeating their shape.
 *
 * Client component: the selected class is React state, and each time you switch
 * the detail panel remounts (keyed by slug) so it crossfades in (`animate-layer-in`)
 * and its `.statbar` fills "recharge" from 0 — the `.is-visible` ancestor flag is
 * flipped on one frame after mount. Role copy lives in `src/lib/careers.ts`.
 */

// Pre-baked rising ember motes (no Math.random → SSR-deterministic, like the
// Hero petals). Each reads its drift/size/tint/timing from inline style.
const MOTES = [
  { left: "6%", size: 8, mx: "26px", mc: "var(--color-gold)", dur: "15s", delay: "0s" },
  { left: "18%", size: 5, mx: "-18px", mc: "var(--color-sunset)", dur: "19s", delay: "2.4s" },
  { left: "31%", size: 7, mx: "20px", mc: "var(--color-ember)", dur: "17s", delay: "5.1s" },
  { left: "44%", size: 4, mx: "-24px", mc: "var(--color-gold)", dur: "21s", delay: "1.3s" },
  { left: "57%", size: 9, mx: "30px", mc: "var(--color-sunset)", dur: "16s", delay: "3.8s" },
  { left: "69%", size: 5, mx: "-16px", mc: "var(--color-ember)", dur: "20s", delay: "6.2s" },
  { left: "82%", size: 7, mx: "22px", mc: "var(--color-gold)", dur: "18s", delay: "0.9s" },
  { left: "93%", size: 4, mx: "-20px", mc: "var(--color-sunset)", dur: "22s", delay: "4.5s" },
] as const;

/** Small uppercase pixel sub-heading used inside the character sheet. */
function SheetLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-pixel text-sm uppercase tracking-[0.28em] text-cream/45">
      {children}
    </h4>
  );
}

/** One selectable entry in the class roster (left rail). */
function RosterEntry({
  role,
  active,
  onSelect,
}: {
  role: Role;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls="class-sheet"
      id={`class-tab-${role.slug}`}
      onClick={onSelect}
      style={{ ["--tint" as string]: role.tint }}
      className={`group relative flex w-full items-center gap-3.5 border py-3.5 pl-7 pr-4 text-left transition-all duration-200 ${
        active
          ? "border-[color:var(--tint)] bg-[color:var(--tint)]/10"
          : "border-cream/10 bg-ink/40 hover:border-cream/30 hover:bg-ink/60"
      }`}
    >
      {/* selected: vertical accent bar + blinking ▶ menu cursor */}
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-[3px] bg-[color:var(--tint)] transition-opacity duration-200 ${
          active ? "opacity-100 [box-shadow:0_0_12px_var(--tint)]" : "opacity-0"
        }`}
      />
      <span
        aria-hidden
        className={`absolute left-1.5 font-pixel text-base leading-none text-[color:var(--tint)] transition-opacity duration-200 ${
          active ? "animate-pulse-glow opacity-100" : "opacity-0"
        }`}
      >
        ▶
      </span>

      {/* sigil tile */}
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center border font-display text-lg font-bold leading-none transition-colors duration-200 ${
          active
            ? "border-[color:var(--tint)]/60 bg-ink/70 text-[color:var(--tint)]"
            : "border-cream/15 bg-ink/50 text-cream/55 group-hover:text-cream/80"
        }`}
      >
        {role.sigil}
      </span>

      {/* name + role */}
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate font-display text-lg font-bold uppercase leading-none transition-colors ${
            active ? "text-cream" : "text-cream/80"
          }`}
        >
          {role.klass}
        </span>
        <span className="mt-1.5 block truncate font-pixel text-sm uppercase tracking-wider text-[color:var(--tint)]">
          {role.role}
        </span>
      </span>

      {/* slot count */}
      <span className="shrink-0 text-right font-pixel text-sm uppercase leading-tight">
        <span className="block text-cream/70">{role.slots} vị trí</span>
        <span className="block text-cream/40">{role.type}</span>
      </span>
    </button>
  );
}

/** The big "character sheet" for the selected class. Remounted (keyed by slug)
 *  on every switch so it crossfades + recharges its stat bars. */
function ClassSheet({ role }: { role: Role }) {
  // Flip `.is-visible` one frame after mount so the .statbar fills animate from
  // 0 → value each time a class is selected (the sheet remounts per selection).
  const [charged, setCharged] = useState(false);
  useEffect(() => {
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setCharged(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, []);

  return (
    <article
      id="class-sheet"
      role="tabpanel"
      aria-labelledby={`class-tab-${role.slug}`}
      style={{ ["--tint" as string]: role.tint }}
      className={`animate-layer-in relative overflow-hidden border border-cream/12 bg-ink/60 ${
        charged ? "is-visible" : ""
      }`}
    >
      {/* giant faded class sigil watermark */}
      <span
        aria-hidden
        className="pixelated pointer-events-none absolute -bottom-12 -right-6 font-display text-[11rem] font-bold leading-none text-[color:var(--tint)] opacity-[0.07] sm:text-[15rem]"
      >
        {role.sigil}
      </span>
      {/* tinted top edge + corner glow */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-[3px] bg-[color:var(--tint)] [box-shadow:0_0_18px_var(--tint)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 100% 0%, color-mix(in srgb, var(--tint) 14%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-[1] p-7 sm:p-9">
        {/* header: sigil emblem + class name + role */}
        <div className="flex items-start gap-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-[color:var(--tint)]/50 bg-ink/70 font-display text-3xl font-bold leading-none text-[color:var(--tint)] [box-shadow:0_0_28px_-6px_var(--tint)]">
            {role.sigil}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-3xl font-bold uppercase leading-[0.95] text-cream sm:text-4xl">
              {role.klass}
            </h3>
            <p className="mt-2 font-pixel text-lg uppercase tracking-wider text-[color:var(--tint)]">
              {role.role} · {role.level}
            </p>
          </div>
        </div>

        {/* status pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 border border-[color:var(--tint)]/40 px-2.5 py-1 font-pixel text-sm uppercase leading-none tracking-wider text-[color:var(--tint)]">
            <span className="animate-pulse-glow">●</span>
            Đang tuyển
          </span>
          <span className="inline-flex items-center border border-cream/15 px-2.5 py-1 font-pixel text-sm uppercase leading-none tracking-wider text-cream/65">
            {role.type}
          </span>
          <span className="inline-flex items-center border border-cream/15 px-2.5 py-1 font-pixel text-sm uppercase leading-none tracking-wider text-cream/65">
            {role.slots} vị trí
          </span>
        </div>

        {/* one-line pitch */}
        <p className="mt-5 max-w-2xl font-viet text-base font-light leading-relaxed text-cream/75">
          {role.summary}
        </p>

        {/* duties + requirements, side by side */}
        <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
          <div>
            <SheetLabel>Nhiệm vụ</SheetLabel>
            <ul className="mt-3 flex flex-col gap-2">
              {role.duties.map((duty) => (
                <li
                  key={duty}
                  className="flex items-start gap-2.5 font-viet text-sm font-light leading-snug text-cream/80"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 text-[color:var(--tint)] [text-shadow:0_0_8px_var(--tint)]"
                  >
                    ▸
                  </span>
                  {duty}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SheetLabel>Yêu cầu</SheetLabel>
            <ul className="mt-3 flex flex-col gap-2">
              {role.requirements.map((req) => (
                <li
                  key={req}
                  className="flex items-start gap-2.5 font-viet text-sm font-light leading-snug text-cream/70"
                >
                  <span aria-hidden className="mt-0.5 text-cream/35">
                    ◇
                  </span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* tech skill tree */}
        <div className="mt-8">
          <SheetLabel>Tech Stack</SheetLabel>
          <ul className="mt-3 flex flex-wrap gap-2">
            {role.stack.map((tech) => (
              <li
                key={tech}
                className="border border-cream/15 bg-cream/[0.04] px-2.5 py-1 font-mono text-xs text-cream/75"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        {/* class stat sheet — 2-up grid */}
        <div className="mt-8">
          <SheetLabel>Chỉ số class</SheetLabel>
          <div className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {role.stats.map((stat, si) => (
              <div key={stat.label}>
                <div className="mb-1 flex items-baseline justify-between font-pixel text-sm uppercase leading-none tracking-wider text-cream/75">
                  <span>{stat.label}</span>
                  <span className="text-cream/45">{stat.value}</span>
                </div>
                <div className="statbar">
                  <div
                    className="fill"
                    style={{
                      ["--val" as string]: `${stat.value}%`,
                      ["--c" as string]: role.tint,
                      ["--delay" as string]: `${si * 0.1}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* apply CTA */}
        <a
          href={APPLY_HREF}
          className="btn-pixel mt-9 inline-flex items-center gap-2 px-6 py-3 font-pixel text-lg uppercase leading-none"
        >
          <span aria-hidden>▸</span>
          Ứng tuyển ngay
        </a>
      </div>
    </article>
  );
}

export function Careers() {
  const [selected, setSelected] = useState(0);
  const role = ROLES[selected];

  return (
    <section
      id="careers"
      className="relative isolate w-full overflow-hidden border-t border-cream/10 bg-ink py-24 sm:py-32"
    >
      {/* faint pixel-grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 26px),repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 26px)",
        }}
      />
      {/* global scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-25 mix-blend-soft-light [background:repeating-linear-gradient(0deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_3px)]"
      />
      {/* warm ember top glow so the section meets the act above seamlessly */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 [background:radial-gradient(60%_100%_at_50%_0%,color-mix(in_srgb,var(--color-ember)_12%,transparent),transparent_70%)]"
      />
      {/* rising ember motes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="mote"
            style={{
              left: m.left,
              width: m.size,
              height: m.size,
              ["--mx" as string]: m.mx,
              ["--mc" as string]: m.mc,
              animationDuration: m.dur,
              animationDelay: m.delay,
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* intro */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <span className="s-fade font-pixel text-sm uppercase tracking-[0.4em] text-ember sm:text-base">
            Tuyển dụng · Chọn class của bạn
          </span>
          <h2 className="s-rise mt-5 font-pixel text-[clamp(2.5rem,9vw,7rem)] uppercase leading-[0.85] text-cream [text-shadow:0_4px_40px_rgba(0,0,0,0.5)]">
            Gia nhập
            <br />
            <span className="bg-gradient-to-r from-gold via-sunset to-ember bg-clip-text text-transparent">
              đội hình VNZ
            </span>
          </h2>
          <p className="s-fade mx-auto mt-6 max-w-2xl font-viet text-base font-light leading-relaxed text-cream/65 sm:text-lg">
            Tuổi trẻ không phải lý do để được ưu ái, mà là trách nhiệm để nỗ lực
            nhiều hơn. Nếu bạn muốn trực tiếp tạo ra giá trị của riêng mình — VNZ
            dành cho bạn.
          </p>

          {/* perk chips */}
          <ul className="s-fade mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {PERKS.map((perk) => (
              <li
                key={perk.label}
                className="inline-flex items-center gap-2 border border-cream/12 bg-ink/40 px-3 py-1.5 font-viet text-sm font-light text-cream/75"
              >
                <span aria-hidden className="text-gold">
                  {perk.glyph}
                </span>
                {perk.label}
              </li>
            ))}
          </ul>
        </div>

        {/* ───────── class select: roster (left) + character sheet (right) ───────── */}
        <div className="s-fade grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,21rem)_1fr]">
          {/* roster */}
          <div
            role="tablist"
            aria-label="Vị trí đang tuyển"
            aria-orientation="vertical"
            className="flex flex-col gap-3"
          >
            <span className="mb-1 hidden font-pixel text-sm uppercase tracking-[0.28em] text-cream/40 lg:block">
              ❖ Chọn vị trí
            </span>
            {ROLES.map((r, i) => (
              <RosterEntry
                key={r.slug}
                role={r}
                active={i === selected}
                onSelect={() => setSelected(i)}
              />
            ))}
            <p className="mt-1 hidden items-center gap-2 font-viet text-xs font-light leading-snug text-cream/45 lg:flex">
              <span aria-hidden className="text-ember">
                ▶
              </span>
              Chọn một class để xem chi tiết nhiệm vụ &amp; yêu cầu.
            </p>
          </div>

          {/* character sheet (remounts per selection → crossfade + recharge) */}
          <div className="lg:min-h-[40rem]">
            <ClassSheet key={role.slug} role={role} />
          </div>
        </div>

        {/* ───────── recruitment journey — JRPG quest path ───────── */}
        <div className="mt-24 sm:mt-32">
          <div className="mb-12 text-center">
            <span className="s-fade font-pixel text-sm uppercase tracking-[0.4em] text-gold sm:text-base">
              Hành trình ứng tuyển
            </span>
            <h3 className="s-rise mt-4 font-pixel text-[clamp(1.75rem,5vw,3.25rem)] uppercase leading-[0.95] text-cream">
              4 bước để nhập cuộc
            </h3>
          </div>

          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                style={{ ["--i" as string]: i }}
                className="s-rise relative flex flex-col items-start gap-3 border border-cream/10 bg-ink/40 p-6"
              >
                {/* glowing step connector arrow (between cards on desktop) */}
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute -right-[1.15rem] top-1/2 z-10 hidden -translate-y-1/2 font-pixel text-2xl text-ember lg:block"
                  >
                    ▸
                  </span>
                )}
                <span className="font-display text-4xl font-bold leading-none text-ember/80 [text-shadow:0_0_18px_color-mix(in_srgb,var(--color-ember)_60%,transparent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="font-pixel text-xl uppercase leading-none tracking-wider text-cream">
                  {step.title}
                </h4>
                <p className="font-viet text-sm font-light leading-relaxed text-cream/65">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* ───────── closing CTA ───────── */}
        <div className="s-fade mt-20 flex flex-col items-center gap-5 border-t border-cream/10 pt-16 text-center sm:mt-24">
          <p className="font-pixel text-[clamp(1.25rem,3.5vw,2.25rem)] uppercase leading-[0.95] text-cream">
            Không thấy vai trò phù hợp?
          </p>
          <p className="max-w-xl font-viet text-base font-light leading-relaxed text-cream/65">
            Cứ gửi CV cho chúng tôi — VNZ luôn chào đón những người dám nghĩ, dám
            làm và muốn để lại dấu ấn của riêng mình.
          </p>
          <a
            href={APPLY_HREF}
            className="btn-pixel mt-2 inline-flex items-center gap-2 px-6 py-3 font-pixel text-lg uppercase leading-none"
          >
            <span aria-hidden>▸</span>
            Gửi hồ sơ
          </a>
        </div>
      </div>
    </section>
  );
}
