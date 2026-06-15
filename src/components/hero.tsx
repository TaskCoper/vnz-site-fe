import Image from "next/image";

/**
 * "VNZ CORP" intro hero — the first full-screen section (the nav sits over it).
 * The redesigned <Member/> character viewer follows directly below it.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden"
    >
      {/* Pixel cityscape backdrop */}
      <Image
        src="/general/hero.png"
        alt="Pixel-art Vietnamese lakeside cityscape at sunset"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="pixelated -z-20 object-cover object-bottom"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 sm:px-8">
        {/* Heading block */}
        <div className="mt-28 flex flex-col items-center text-center sm:mt-36">
          <h1 className="font-display text-6xl font-bold leading-[0.95] text-ink [text-shadow:4px_4px_0_rgba(196,122,85,0.45)] sm:text-7xl lg:text-8xl">
            VNZ CORP
          </h1>

          <p className="mt-5 max-w-xl font-mono text-sm text-ink-soft sm:text-base">
            The people building great things together — Vietnamese minds, global
            solutions.
          </p>
        </div>
      </div>

      {/* Dusk fade — the warm cityscape sinks into the exact `ink` of the
          <Member/> stage below, so the day→night hand-off reads as one
          continuous dark band instead of a hard light→dark section cut. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-b from-transparent via-ink/50 to-ink lg:h-80"
      />
      {/* CRT scanline texture riding the fade, tying the seam to the stage's
          scanline atmosphere. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-64 opacity-40 mix-blend-multiply [background:repeating-linear-gradient(0deg,rgba(0,0,0,0.18)_0_1px,transparent_1px_3px)] [mask-image:linear-gradient(to_bottom,transparent,#000_70%)] lg:h-80"
      />
    </section>
  );
}
