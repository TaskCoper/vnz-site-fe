"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PRODUCTS, type Product } from "@/lib/products";

/**
 * "Sản phẩm" — the VNZ product showcase. Each product is a full "title card"
 * styled like a 16-bit game-catalog entry: a bright, framed CRT-style stage
 * holding the app-icon + brand wordmark (the art), paired with a dark info
 * column (tagline, story, capabilities, "product DNA" stat bars, CTA).
 *
 * Client component for one reason: the `.statbar` fills only animate once an
 * ancestor gains `.is-visible`, which an IntersectionObserver toggles per panel
 * (the same trigger TeamRoster uses). The section intro + entrances ride the
 * native scroll-driven `.s-*` classes from globals.css (no extra JS).
 *
 * Layout alternates side-to-side: even products put the art stage on the left,
 * odd ones on the right (desktop only — mobile always stacks art on top). Each
 * product's `tint` recolors its entire panel via the `--tint` CSS var.
 */

/** Tiny CSS pixel padlock (inherits currentColor) for the "coming soon" lock. */
function PixelLock() {
  return (
    <span
      aria-hidden
      className="relative inline-flex h-5 w-4 items-end justify-center"
    >
      {/* shackle */}
      <span className="absolute top-0 h-2.5 w-3 rounded-t-[5px] border-2 border-b-0 border-current" />
      {/* body */}
      <span className="relative h-3 w-4 rounded-[1px] bg-current" />
    </span>
  );
}

/**
 * Blurred placeholder for an unreleased ("locked") product. Renders ONLY
 * decorative bars — no real copy — so the actual tagline/desc/features/stats
 * never reach the DOM or the JS bundle, while the panel keeps the same teaser
 * shape (and rough height) as a live product behind the "Sắp ra mắt" lock.
 * Widths are fixed constants → deterministic SSR, no hydration drift.
 */
function LockedDetails() {
  const featureBars = [82, 66, 74, 58]; // % widths of the four bullet placeholders
  const statBars = [72, 56, 84]; // decorative stat-fill widths (not real values)
  return (
    <div
      aria-hidden
      className="pointer-events-none select-none blur-[7px] saturate-[0.9]"
    >
      {/* tagline */}
      <div className="mt-4 space-y-3">
        <div className="h-8 w-[90%] rounded-[2px] bg-cream/25 sm:h-10" />
        <div className="h-8 w-[62%] rounded-[2px] bg-cream/25 sm:h-10" />
      </div>
      {/* description */}
      <div className="mt-6 max-w-xl space-y-2.5">
        <div className="h-3.5 w-full rounded-[2px] bg-cream/15" />
        <div className="h-3.5 w-[96%] rounded-[2px] bg-cream/15" />
        <div className="h-3.5 w-[72%] rounded-[2px] bg-cream/15" />
      </div>
      {/* capability bullets */}
      <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {featureBars.map((w, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="size-2.5 shrink-0 bg-[color:var(--tint)]" />
            <span
              className="h-3 rounded-[2px] bg-cream/15"
              style={{ width: `${w}%` }}
            />
          </div>
        ))}
      </div>
      {/* stat bars */}
      <div className="mt-8 flex max-w-md flex-col gap-2.5">
        {statBars.map((w, i) => (
          <div key={i}>
            <div className="mb-1 h-2.5 w-20 rounded-[2px] bg-cream/15" />
            <div className="statbar">
              <div
                className="fill"
                style={{
                  ["--val" as string]: `${w}%`,
                  ["--c" as string]: "var(--tint)",
                  ["--delay" as string]: `${i * 0.12}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductPanel({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const artRight = index % 2 === 1; // odd → art on the right (desktop)
  // Wordmarks have different aspect ratios, so sizing is per-product (default
  // sits the lockup just under the logo). External CTAs open in a new tab.
  const wordmarkClass = product.wordmarkClass ?? "h-9 w-auto sm:h-11";
  const isExternal = /^https?:\/\//.test(product.href);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      style={{ ["--tint" as string]: product.tint }}
      className={`relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
        visible ? "is-visible" : ""
      }`}
    >
      {/* ───────── Art stage — a glowing framed "screen" ───────── */}
      <div
        className={`reveal ${visible ? "is-in" : ""} ${
          artRight ? "lg:order-2" : ""
        }`}
      >
        <div className="pixel-frame scanlines relative flex min-h-[22rem] flex-col items-center justify-center overflow-hidden bg-cream px-6 py-12 sm:min-h-[26rem]">
          {/* tinted glow rising from the floor + base parchment→sky gradient */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 118%, color-mix(in srgb, ${product.tint} 60%, transparent), transparent 68%), linear-gradient(180deg, var(--color-parchment), var(--color-sky))`,
            }}
          />
          {/* faint pixel grid on the stage */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,#1b2433 0 1px,transparent 1px 16px),repeating-linear-gradient(90deg,#1b2433 0 1px,transparent 1px 16px)",
            }}
          />
          {/* floor line */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-clay/30 to-transparent"
          />

          {/* category chip — top-left */}
          <span className="absolute left-3 top-3 z-10 bg-ink/85 px-2 py-1 font-ui text-[8px] uppercase tracking-wider text-[color:var(--tint)]">
            ❖ {product.name}
          </span>
          {/* slot number — top-right */}
          <span className="absolute right-3 top-3 z-10 font-ui text-[8px] uppercase tracking-wider text-ink/50">
            {String(index + 1).padStart(2, "0")} / {String(PRODUCTS.length).padStart(2, "0")}
          </span>

          {/* logo (floats) + wordmark lockup */}
          <div className="relative z-10 flex flex-col items-center gap-7">
            <div className="ground-shadow relative">
              <Image
                src={product.logo}
                alt={`Biểu tượng ${product.name}`}
                unoptimized
                className="animate-bob pixelated h-40 w-auto drop-shadow-[3px_5px_0_rgba(27,36,51,0.22)] sm:h-48"
              />
            </div>
            <Image
              src={product.wordmark}
              alt={product.name}
              unoptimized
              className={`pixelated ${wordmarkClass}`}
            />
          </div>

          {/* corner sparkles */}
          <span
            aria-hidden
            className="animate-twinkle absolute bottom-6 left-6 text-[color:var(--tint)]"
          >
            ✦
          </span>
          <span
            aria-hidden
            className="animate-twinkle absolute right-7 top-1/3 text-sm text-gold"
            style={{ animationDelay: "0.8s" }}
          >
            ✦
          </span>
        </div>
      </div>

      {/* ───────── Info column ───────── */}
      <div
        className={`reveal ${visible ? "is-in" : ""} ${
          artRight ? "lg:order-1" : ""
        }`}
        style={{ ["--reveal-delay" as string]: "0.12s" }}
      >
        {/* eyebrow: category + status pill */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-pixel text-sm uppercase tracking-[0.28em] text-[color:var(--tint)]">
            {product.category}
          </span>
          <span className="inline-flex items-center gap-1.5 border border-cream/20 px-2.5 py-1 font-pixel text-sm uppercase leading-none tracking-wider text-cream/80">
            <span className="animate-pulse-glow text-[color:var(--tint)]">●</span>
            {product.status}
          </span>
        </div>

        {/* Detail block — for an unreleased product this is blurred behind a
            "Sắp ra mắt" lock so the specifics stay hidden; the brand art, name,
            status (above) and CTA (below) still show as a teaser. */}
        <div className="relative">
          {product.locked ? (
            // Locked: render ONLY a blurred placeholder skeleton — no real copy
            // is referenced here, so nothing real reaches the DOM or JS bundle.
            <LockedDetails />
          ) : (
            <>
              <h3 className="mt-4 font-pixel text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.95] text-cream">
                {product.tagline}
              </h3>

              <p className="mt-5 max-w-xl font-viet text-base font-light leading-relaxed text-cream/70 sm:text-lg">
                {product.desc}
              </p>

              {/* capability bullets */}
              <ul className="mt-6 grid grid-cols-1 gap-y-2.5 sm:grid-cols-2 sm:gap-x-6">
                {product.features?.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 font-viet text-sm font-light leading-snug text-cream/80"
                  >
                    <span
                      aria-hidden
                      className="mt-1 text-[color:var(--tint)] [text-shadow:0_0_8px_var(--tint)]"
                    >
                      ▸
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* "product DNA" stat bars */}
              <div className="mt-7 flex max-w-md flex-col gap-2.5">
                {product.stats?.map((stat, si) => (
                  <div key={stat.label}>
                    <div className="mb-1 flex items-baseline justify-between font-pixel text-sm uppercase leading-none tracking-wider text-cream/80">
                      <span>{stat.label}</span>
                      <span className="text-cream/50">{stat.value}</span>
                    </div>
                    <div className="statbar">
                      <div
                        className="fill"
                        style={{
                          ["--val" as string]: `${stat.value}%`,
                          ["--c" as string]: product.tint,
                          ["--delay" as string]: `${si * 0.12}s`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Lock overlay — only on unreleased products. */}
          {product.locked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/55 to-ink/40"
              />
              <div className="relative flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2.5 border-2 border-[color:var(--tint)] bg-ink/90 px-4 py-2 text-[color:var(--tint)] [box-shadow:0_0_24px_-4px_var(--tint)]">
                  <PixelLock />
                  <span className="font-pixel text-lg uppercase leading-none tracking-wider">
                    {product.status}
                  </span>
                </span>
                <p className="max-w-xs font-viet text-sm font-light leading-snug text-cream/70">
                  Thông tin sẽ được hé lộ khi sản phẩm ra mắt.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-9">
          <a
            href={product.href}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="btn-pixel inline-flex items-center gap-2 px-6 py-3 font-pixel text-lg uppercase leading-none"
          >
            <span aria-hidden>▸</span>
            {product.cta}
          </a>
        </div>
      </div>
    </article>
  );
}

export function Products() {
  return (
    <section
      id="products"
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
      {/* warm top glow so the section meets the act above without a hard seam */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 [background:radial-gradient(60%_100%_at_50%_0%,color-mix(in_srgb,var(--color-gold)_10%,transparent),transparent_70%)]"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* intro */}
        <div className="mx-auto mb-20 max-w-3xl text-center sm:mb-28">
          <span className="s-fade font-pixel text-sm uppercase tracking-[0.4em] text-gold sm:text-base">
            Sản phẩm · Products
          </span>
          <h2 className="s-rise mt-5 font-pixel text-[clamp(2.5rem,9vw,7rem)] uppercase leading-[0.85] text-cream [text-shadow:0_4px_40px_rgba(0,0,0,0.5)]">
            Những dấu ấn
            <br />
            <span className="bg-gradient-to-r from-gold via-sunset to-ember bg-clip-text text-transparent">
              công nghệ
            </span>
          </h2>
          <p className="s-fade mx-auto mt-6 max-w-2xl font-viet text-base font-light leading-relaxed text-cream/65 sm:text-lg">
            Các sản phẩm và nền tảng do VNZ xây dựng — từ trí tuệ Việt Nam, giải
            quyết những bài toán thực tiễn của xã hội.
          </p>
        </div>

        {/* product panels */}
        <div className="flex flex-col gap-24 sm:gap-32">
          {PRODUCTS.map((p, i) => (
            <ProductPanel key={p.slug} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
