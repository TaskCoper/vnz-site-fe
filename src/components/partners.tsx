import Image from "next/image";
import { PARTNERS, type Partner } from "@/lib/partners";

/**
 * "Đối tác" — the VNZ partner roster, framed as a JRPG "liên minh" (alliance)
 * board. Each partner is a card: a bright CREAM stage holding the brand mark,
 * over a dark info block (category + a one-line partnership note). Server
 * component — every entrance rides the native scroll-driven `.s-*` classes from
 * globals.css (no client JS).
 *
 * The brand logos ship on a solid white background; the cream stage +
 * `mix-blend-multiply` on the <Image> melt that white into the stage while
 * keeping each mark's real colors and anti-aliasing crisp (see partners.ts).
 * These are smooth raster logos, NOT pixel art, so they intentionally skip the
 * `.pixelated` class every other art asset uses.
 *
 * Each partner's `tint` recolors its whole card via the `--tint` CSS var.
 */

function PartnerCard({ partner, index }: { partner: Partner; index: number }) {
  const isExternal = !!partner.href && /^https?:\/\//.test(partner.href);
  return (
    <article
      style={{ ["--tint" as string]: partner.tint, ["--i" as string]: index }}
      className="s-rise group relative flex h-full flex-col overflow-hidden border border-cream/10 bg-ink/50 backdrop-blur-md transition-colors duration-300 hover:border-[color:var(--tint)]"
    >
      {/* top accent bar */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-[3px] bg-[color:var(--tint)] [box-shadow:0_0_16px_var(--tint)]"
      />

      {/* ───────── Brand stage — bright cream "screen" ───────── */}
      <div className="pixel-frame scanlines relative m-[9px] mb-0 flex min-h-[12rem] items-center justify-center overflow-hidden bg-cream px-8 py-10 sm:min-h-[13rem]">
        {/* faint pixel grid on the stage */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#1b2433 0 1px,transparent 1px 16px),repeating-linear-gradient(90deg,#1b2433 0 1px,transparent 1px 16px)",
          }}
        />
        {/* tinted glow rising from the floor */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 122%, color-mix(in srgb, ${partner.tint} 42%, transparent), transparent 70%)`,
          }}
        />

        {/* brand chip — top-left */}
        <span className="absolute left-3 top-3 z-10 bg-ink/85 px-2 py-1 font-ui text-[8px] uppercase tracking-wider text-[color:var(--tint)]">
          ❖ {partner.name}
        </span>
        {/* slot number — top-right */}
        <span className="absolute right-3 top-3 z-10 font-ui text-[8px] uppercase tracking-wider text-ink/40">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(PARTNERS.length).padStart(2, "0")}
        </span>

        {/* the mark — white background multiplied away into the cream stage */}
        <Image
          src={partner.logo}
          alt={partner.name}
          unoptimized
          className="relative z-[1] h-auto max-h-24 w-auto max-w-[80%] object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.04] sm:max-h-28"
        />
      </div>

      {/* ───────── Info block ───────── */}
      <div className="flex flex-1 flex-col p-6">
        <span className="font-pixel text-sm uppercase tracking-[0.28em] text-[color:var(--tint)]">
          {partner.category}
        </span>
        <p className="mt-3 font-viet text-sm font-light leading-relaxed text-cream/70">
          {partner.blurb}
        </p>

        {partner.href ? (
          <a
            href={partner.href}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="mt-5 inline-flex items-center gap-2 self-start font-pixel text-sm uppercase tracking-wider text-cream/80 transition-colors hover:text-[color:var(--tint)]"
          >
            <span aria-hidden>▸</span>
            Ghé thăm
          </a>
        ) : (
          <span className="mt-5 inline-flex items-center gap-1.5 self-start border border-cream/15 px-2.5 py-1 font-pixel text-sm uppercase leading-none tracking-wider text-cream/55">
            <span className="text-[color:var(--tint)]">●</span>
            Đối tác chính thức
          </span>
        )}
      </div>
    </article>
  );
}

export function Partners() {
  return (
    <section
      id="partners"
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
      {/* cool top glow so the section meets the act above without a hard seam */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 [background:radial-gradient(60%_100%_at_50%_0%,color-mix(in_srgb,var(--color-jade)_10%,transparent),transparent_70%)]"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* intro */}
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-24">
          <span className="s-fade font-pixel text-sm uppercase tracking-[0.4em] text-jade sm:text-base">
            Đối tác · Partners
          </span>
          <h2 className="s-rise mt-5 font-pixel text-[clamp(2.5rem,9vw,7rem)] uppercase leading-[0.85] text-cream [text-shadow:0_4px_40px_rgba(0,0,0,0.5)]">
            Cùng nhau
            <br />
            <span className="bg-gradient-to-r from-jade via-gold to-lotus bg-clip-text text-transparent">
              kiến tạo
            </span>
          </h2>
          <p className="s-fade mx-auto mt-6 max-w-2xl font-viet text-base font-light leading-relaxed text-cream/65 sm:text-lg">
            Những doanh nghiệp, thương hiệu và cộng đồng đang đồng hành cùng VNZ
            trên hành trình tạo ra giá trị thật bằng công nghệ.
          </p>
        </div>

        {/* partner cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map((p, i) => (
            <PartnerCard key={p.slug} partner={p} index={i} />
          ))}
        </div>

        {/* become-a-partner CTA */}
        <div className="s-fade mt-16 flex flex-col items-center gap-5 text-center sm:mt-24">
          <p className="font-pixel text-[clamp(1.25rem,3.5vw,2.25rem)] uppercase leading-[0.95] text-cream">
            Muốn cùng VNZ kiến tạo dấu ấn?
          </p>
          <a
            href="#contact"
            className="btn-pixel inline-flex items-center gap-2 px-6 py-3 font-pixel text-lg uppercase leading-none"
          >
            <span aria-hidden>▸</span>
            Trở thành đối tác
          </a>
        </div>
      </div>
    </section>
  );
}
