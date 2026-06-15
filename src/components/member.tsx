"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  MEMBERS,
  COMPANY_NAME,
  COMPANY_QUOTE,
  type Member,
} from "@/lib/members";

// Founder leads the roster (members.ts is ordered so) → default-selected
// character + first avatar.
const DEFAULT = MEMBERS[0];

export function Member() {
  // Locally-tracked selection — the viewer always has a character on stage
  // (defaults to the founder) and is self-contained: it doesn't touch the
  // global nav state, which belongs to the light <Hero/> sitting above.
  const [selected, setSelected] = useState<Member>(DEFAULT);

  // Keep the outgoing member mounted for one crossfade so the hometown +
  // character dissolve between people instead of hard-cutting.
  const [previous, setPrevious] = useState<Member | null>(null);

  const choose = (m: Member) => {
    if (m.slug === selected.slug) return;
    setPrevious(selected);
    setSelected(m);
  };

  // Drop the outgoing layer once its fade-out finishes.
  useEffect(() => {
    if (!previous) return;
    const t = window.setTimeout(() => setPrevious(null), 480);
    return () => window.clearTimeout(t);
  }, [previous]);

  // Warm the image cache in idle time so the first hover of each avatar
  // crossfades instantly instead of waiting on a multi-MB hometown PNG.
  useEffect(() => {
    const warm = () => {
      for (const m of MEMBERS) {
        new window.Image().src = m.hometownImg.src;
        new window.Image().src = m.img.src;
      }
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm);
      return () => window.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(warm, 800);
    return () => window.clearTimeout(t);
  }, []);

  const isDefault = selected.slug === DEFAULT.slug;
  const tint = selected.tint;

  // The profile reads as a "dossier" — six labeled lines + a motto footer.
  const rows: [string, string][] = [
    ["Họ và tên", selected.fullName],
    ["Chức vụ", selected.title],
    ["Quê quán", selected.hometown],
    ["Sở thích", selected.hobbies],
    ["Ngày gia nhập công ty", selected.joinDate],
  ];

  return (
    <section
      id="members"
      style={{ ["--tint" as string]: tint }}
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-ink"
    >
      {/* ───────── Hometown backdrop (crossfades on select) ───────── */}
      {previous && (
        <Image
          key={`bg-${previous.slug}`}
          src={previous.hometownImg}
          alt=""
          aria-hidden
          fill
          unoptimized
          sizes="100vw"
          className="pixelated -z-30 object-cover"
        />
      )}
      <Image
        key={`bg-${selected.slug}`}
        src={selected.hometownImg}
        alt={`${selected.hometown} — quê hương của ${selected.fullName}`}
        fill
        priority={isDefault}
        unoptimized
        sizes="100vw"
        className="pixelated -z-30 animate-layer-in object-cover"
      />

      {/* ───────── Atmosphere: scrims · color-grade · vignette · scanlines ───────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-ink/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-l from-ink/90 via-ink/30 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-t from-ink via-ink/35 to-transparent"
      />
      {/* Ink crown — the stage opens in the same `ink` the hero dusk-fades to,
          so the section seam is one continuous dark band; it then dissolves to
          reveal the sky/tower as you scroll in. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[34vh] bg-gradient-to-b from-ink via-ink/45 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_32%,transparent_44%,rgba(6,8,15,0.62)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-50 mix-blend-multiply [background:repeating-linear-gradient(0deg,rgba(0,0,0,0.16)_0_1px,transparent_1px_3px)]"
      />

      {/* ───────── Character (left): tint aura + soft ground shadow ─────────
          pointer-events-none so hovers pass through to the avatar dock. */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {/* Spotlight aura — soft per-member colored halo the character stands in. */}
        <div
          aria-hidden
          className="absolute bottom-[6%] left-1/2 h-[62vh] w-[80vw] max-w-[34rem] -translate-x-1/2 blur-[90px] transition-[left,background] duration-500 lg:left-[25%]"
          style={{
            background: `radial-gradient(ellipse 50% 55% at 50% 50%, color-mix(in srgb, ${tint} 42%, transparent), transparent 72%)`,
          }}
        />
        {/* Soft elliptical ground shadow (replaces the hard offset shadow). */}
        <div
          aria-hidden
          className="absolute bottom-[2.5%] left-1/2 h-12 w-[19rem] max-w-[68vw] -translate-x-1/2 rounded-[50%] bg-black/55 blur-2xl lg:left-[25%] lg:bottom-[-16vh]"
        />
        {previous && (
          <Image
            key={`ch-${previous.slug}`}
            src={previous.img}
            alt=""
            aria-hidden
            unoptimized
            className="pixelated absolute bottom-0 left-1/2 h-[52vh] w-auto -translate-x-1/2 animate-layer-out drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)] sm:h-[60vh] lg:left-[25%] lg:h-[132vh] lg:bottom-[-34vh]"
          />
        )}
        <Image
          key={`ch-${selected.slug}`}
          src={selected.img}
          alt={`${selected.fullName} — ${selected.title}`}
          priority={isDefault}
          unoptimized
          className="pixelated absolute bottom-0 left-1/2 h-[52vh] w-auto -translate-x-1/2 animate-layer-in drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)] sm:h-[60vh] lg:left-[25%] lg:h-[132vh] lg:bottom-[-34vh]"
        />
      </div>

      {/* ───────── Profile dossier (top-right) + brand (mid-right) ─────────
          Full-bleed wrapper is pointer-events-none so it never blocks the dock. */}
      <div className="pointer-events-none relative z-30 mx-auto min-h-[100svh] max-w-[1600px] px-6 sm:px-10">
        {/* Dossier panel — frosted glass, tint spine + corner ticks. */}
        <div
          key={`info-${selected.slug}`}
          className="pointer-events-auto ml-auto mt-20 w-full max-w-[25rem] animate-layer-in sm:mt-24 lg:absolute lg:right-[4%] lg:top-[9%] lg:mt-0"
        >
          <div className="relative border border-cream/10 bg-ink/35 px-7 py-6 text-right font-pixel backdrop-blur-md [box-shadow:0_24px_70px_-24px_rgba(0,0,0,0.85)]">
            {/* Glowing tint spine on the right edge. */}
            <span
              aria-hidden
              className="absolute inset-y-0 right-0 w-[3px]"
              style={{ background: tint, boxShadow: `0 0 16px ${tint}` }}
            />
            {/* JRPG corner ticks. */}
            <span
              aria-hidden
              className="absolute -left-px -top-px h-3.5 w-3.5 border-l-2 border-t-2"
              style={{ borderColor: tint }}
            />
            <span
              aria-hidden
              className="absolute -bottom-px -left-px h-3.5 w-3.5 border-b-2 border-l-2"
              style={{ borderColor: tint }}
            />

            {/* Header rule + diamond. */}
            <div className="mb-5 flex items-center justify-end gap-2">
              <span className="h-px flex-1 bg-cream/15" />
              <span className="text-xs" style={{ color: tint }}>
                ❖
              </span>
            </div>

            <div className="space-y-3 text-base sm:text-[17px]">
              {rows.map(([label, value]) => (
                <p key={label} className="leading-snug">
                  <span className="text-cream/45">{label}: </span>
                  <span className="font-medium text-cream">{value}</span>
                </p>
              ))}
            </div>

            <div className="mt-5 border-t border-cream/10 pt-4">
              <p className="text-sm text-cream/45">Châm ngôn sống</p>
              <p className="mt-1 text-base italic leading-snug text-cream sm:text-[17px]">
                <span style={{ color: tint }}>“</span>
                {selected.motto}
                <span style={{ color: tint }}>”</span>
              </p>
            </div>
          </div>
        </div>

        {/* Brand — mid-right, constant copy, tint accent follows the member. */}
        <div
          className="ml-auto mt-12 max-w-3xl animate-hero-rise pb-44 text-right sm:mt-16 lg:absolute lg:right-[4%] lg:top-[58%] lg:mt-0 lg:max-w-none lg:pb-0"
          style={{ animationDelay: "0.12s" }}
        >
          <div
            aria-hidden
            className="ml-auto mb-4 h-[3px] w-20 transition-[background,box-shadow] duration-500 lg:w-28"
            style={{ background: tint, boxShadow: `0 0 16px ${tint}` }}
          />
          <h1 className="font-pixel text-4xl font-light uppercase leading-[0.95] tracking-[0.04em] text-cream [text-shadow:0_3px_30px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-[4.2rem] lg:whitespace-nowrap">
            {COMPANY_NAME}
          </h1>
          <p className="mt-4 font-pixel text-base font-light text-cream/85 [text-shadow:0_1px_14px_rgba(0,0,0,0.9)] sm:text-lg lg:text-xl">
            {COMPANY_QUOTE}
          </p>
        </div>
      </div>

      {/* ───────── Avatar dock (bottom, centered) ───────── */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 animate-hero-rise px-4 pb-25 pt-8 sm:px-8"
        style={{ animationDelay: "0.24s" }}
      >
        {/* Caption naming the on-stage member. */}
        <p className="mb-3 text-center font-pixel text-sm text-cream/70 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
          <span className="font-semibold text-cream">{selected.fullName}</span>
          <span className="mx-2 text-cream/30">·</span>
          <span style={{ color: tint }}>{selected.title}</span>
        </p>
        {/* Frosted dock holding the roster. */}
        <div className="mx-auto flex w-fit max-w-full flex-wrap items-end justify-center gap-2.5 border border-cream/10 bg-ink/45 px-3 py-3 backdrop-blur-md sm:gap-3 sm:px-4">
          {MEMBERS.map((m) => {
            const isSel = m.slug === selected.slug;
            return (
              <button
                key={m.slug}
                type="button"
                onMouseEnter={() => choose(m)}
                onFocus={() => choose(m)}
                onClick={() => choose(m)}
                aria-pressed={isSel}
                aria-label={`${m.fullName} — ${m.title}`}
                style={{ ["--tint" as string]: m.tint }}
                className={`group relative h-14 w-14 shrink-0 overflow-hidden bg-[#0e1119] outline-none transition-all duration-150 ease-out focus-visible:-translate-y-1 sm:h-16 sm:w-16 ${
                  isSel
                    ? "-translate-y-1.5 scale-105 shadow-[0_0_22px_3px_color-mix(in_srgb,var(--tint)_65%,transparent)]"
                    : "opacity-60 hover:-translate-y-1 hover:opacity-100"
                }`}
              >
                <Image
                  src={m.img}
                  alt=""
                  aria-hidden
                  fill
                  unoptimized
                  sizes="64px"
                  style={{ objectPosition: "center top" }}
                  className="pixelated object-cover transition-transform duration-150 group-hover:scale-110"
                />
                {/* Subtle bottom shade so dark clothing doesn't merge into the dock. */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                />
                {/* Pixel frame — faint cream default, bright cream+tint when selected. */}
                <span
                  aria-hidden
                  className={`absolute inset-0 ${
                    isSel
                      ? "shadow-[inset_0_0_0_2px_var(--color-cream),inset_0_0_0_4px_var(--tint)]"
                      : "shadow-[inset_0_0_0_1.5px_rgba(251,244,226,0.35)] group-hover:shadow-[inset_0_0_0_2px_rgba(251,244,226,0.75)]"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
