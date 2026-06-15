import Image from "next/image";

/**
 * Hero #1 — the cinematic "title screen". A pixel Vietnamese lakeside at sunset,
 * layered with scrims / vignette / scanlines / drifting petals, carrying VNZ's
 * bilingual thesis: DẤU ẤN CÔNG NGHỆ — KHÁT VỌNG THẾ HỆ MỚI. The warm sky sinks
 * into `ink` at the bottom so it hands off seamlessly to the dark story section.
 */

// Pre-baked drifting petals (no Math.random → deterministic SSR). Each reads
// its column / fall duration / delay / drift / size / tint from inline style.
const PETALS = [
  { left: "8%", dur: "10s", delay: "0s", drift: "40px", size: 9, c: "var(--color-lotus)" },
  { left: "21%", dur: "13s", delay: "2.4s", drift: "-30px", size: 7, c: "var(--color-gold)" },
  { left: "34%", dur: "11s", delay: "1.1s", drift: "55px", size: 8, c: "var(--color-lotus)" },
  { left: "47%", dur: "14s", delay: "3.6s", drift: "-22px", size: 6, c: "var(--color-sunset)" },
  { left: "59%", dur: "12s", delay: "0.7s", drift: "44px", size: 9, c: "var(--color-lotus)" },
  { left: "70%", dur: "15s", delay: "2.0s", drift: "-48px", size: 7, c: "var(--color-gold)" },
  { left: "82%", dur: "11s", delay: "4.1s", drift: "30px", size: 8, c: "var(--color-lotus)" },
  { left: "92%", dur: "13s", delay: "1.6s", drift: "-26px", size: 6, c: "var(--color-sunset)" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh w-full flex-col overflow-hidden"
    >
      {/* Pixel cityscape backdrop */}
      <Image
        src="/general/hero.png"
        alt="Thành phố ven hồ Việt Nam phong cách pixel lúc hoàng hôn"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="pixelated -z-30 scale-105 object-cover object-bottom"
      />

      {/* ── Atmosphere: dual scrim · vignette · scanlines ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-ink/55 via-ink/15 to-ink"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 [background:radial-gradient(120%_120%_at_50%_28%,transparent_40%,rgba(12,16,26,0.7)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 mix-blend-multiply [background:repeating-linear-gradient(0deg,rgba(0,0,0,0.16)_0_1px,transparent_1px_3px)]"
      />

      {/* Drifting petals */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {PETALS.map((p, i) => (
          <span
            key={i}
            className="petal"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.c,
              animationDuration: p.dur,
              animationDelay: p.delay,
              ["--drift" as string]: p.drift,
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-24 pt-28 text-center sm:px-8">
        {/* Eyebrow */}
        <span className="animate-hero-rise inline-flex items-center gap-2 border border-cream/25 bg-ink/35 px-4 py-1.5 font-pixel text-sm uppercase tracking-[0.25em] text-cream/85 backdrop-blur-sm sm:text-base">
          <span className="animate-twinkle text-gold">❖</span>
          Vietnam Z-DNA Technology
        </span>

        {/* Bilingual headline */}
        <h1
          className="animate-hero-rise mt-7 font-pixel font-normal uppercase leading-[0.9] tracking-tight text-cream [text-shadow:3px_3px_0_rgba(12,16,26,0.6),0_0_36px_rgba(0,0,0,0.45)]"
          style={{ animationDelay: "0.08s" }}
        >
          <span className="block text-5xl sm:text-7xl lg:text-8xl">Dấu ấn công nghệ</span>
          <span className="mt-1 block bg-gradient-to-r from-gold via-sunset to-lantern bg-clip-text text-5xl text-transparent drop-shadow-[0_4px_22px_rgba(232,84,31,0.35)] sm:text-7xl lg:text-8xl">
            Khát vọng thế hệ mới
          </span>
        </h1>

        {/* English subline with flanking rules */}
        <div
          className="animate-hero-rise mt-6 flex w-full max-w-2xl items-center gap-3"
          style={{ animationDelay: "0.16s" }}
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/60" />
          <p className="font-display text-base uppercase tracking-[0.12em] text-cream/80 sm:text-lg lg:text-xl">
            Defining Tech, Driven by a New Generation
          </p>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/60" />
        </div>

        {/* Thesis line (manifesto close) */}
        <p
          className="animate-hero-rise mt-7 max-w-2xl font-viet text-base font-light leading-relaxed text-cream/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.9)] sm:text-lg"
          style={{ animationDelay: "0.24s" }}
        >
          “VNZ không được xây dựng để gia công — chúng tôi được xây dựng để{" "}
          <span className="font-medium text-gold">kiến tạo dấu ấn công nghệ thế hệ mới.”</span>
        </p>

        {/* CTAs */}
        <div
          className="animate-hero-rise mt-9 flex flex-col items-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.32s" }}
        >
          <a
            href="#about"
            className="btn-pixel font-pixel inline-flex items-center gap-2 px-7 py-3 text-lg uppercase tracking-wider"
          >
            Khám phá VNZ <span aria-hidden>▸</span>
          </a>
          <a
            href="#careers"
            className="font-pixel inline-flex items-center gap-2 border-2 border-cream/40 px-7 py-3 text-lg uppercase tracking-wider text-cream transition-colors duration-200 hover:border-ember hover:bg-cream/5 hover:text-ember"
          >
            Gia nhập đội ngũ
          </a>
        </div>

        {/* Audience strip — who VNZ serves */}
        <div
          className="animate-hero-rise mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-pixel text-sm uppercase tracking-[0.18em] text-cream/75 sm:text-base"
          style={{ animationDelay: "0.4s" }}
        >
          <span>Doanh nghiệp</span>
          <span className="text-gold/70">◆</span>
          <span>Người dùng</span>
          <span className="text-gold/70">◆</span>
          <span>Khu vực công</span>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Cuộn để khám phá"
        className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 font-pixel text-xs uppercase tracking-[0.3em] text-cream/60 transition-colors hover:text-ember"
      >
        Cuộn để khám phá
        <span className="animate-float text-lg leading-none">▾</span>
      </a>

      {/* Dusk fade → hands off into the dark story section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-ink"
      />
    </section>
  );
}
