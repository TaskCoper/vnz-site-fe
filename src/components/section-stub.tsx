import { Reveal } from "@/components/reveal";

/**
 * Slim on-brand placeholder for sections not yet built (Sản phẩm / Đối tác /
 * Tuyển dụng). Keeps the nav flow + anchors fully working and the page skeleton
 * complete while the real content is produced. Swap each of these out for a
 * full section later.
 */
export function SectionStub({
  id,
  kicker,
  title,
  blurb,
  tint = "var(--color-gold)",
}: {
  id: string;
  kicker: string;
  title: string;
  blurb: string;
  tint?: string;
}) {
  return (
    <section
      id={id}
      style={{ ["--tint" as string]: tint }}
      className="relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden border-t border-cream/10 bg-ink py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(70%_70%_at_50%_50%,color-mix(in_srgb,var(--tint)_12%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 mix-blend-soft-light [background:repeating-linear-gradient(0deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_3px)]"
      />
      <Reveal className="mx-auto max-w-2xl px-5 text-center">
        <span className="font-pixel text-sm uppercase tracking-[0.3em] text-[color:var(--tint)]">
          {kicker}
        </span>
        <h2 className="mt-4 font-pixel text-4xl uppercase leading-[0.95] text-cream sm:text-5xl">
          {title}
        </h2>
        <p className="mt-5 font-viet text-base font-light leading-relaxed text-cream/65 sm:text-lg">
          {blurb}
        </p>
        <span className="mt-7 inline-flex items-center gap-2 border border-cream/25 px-4 py-1.5 font-pixel text-sm uppercase tracking-widest text-cream/70">
          <span className="animate-pulse-glow text-[color:var(--tint)]">●</span>
          Đang hoàn thiện
        </span>
      </Reveal>
    </section>
  );
}
