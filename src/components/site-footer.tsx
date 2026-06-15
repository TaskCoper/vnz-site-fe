import Image from "next/image";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t-[3px] border-ink bg-ink text-cream"
    >
      {/* scanlines for the CRT footer vibe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,rgba(0,0,0,0.35) 0 1px,transparent 1px 3px)",
        }}
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-14 text-center sm:px-8">
        <Image
          src="/general/logo-dark.png"
          alt="VNZ"
          width={1094}
          height={560}
          unoptimized
          className="pixelated h-14 w-auto [filter:drop-shadow(0_0_12px_rgba(239,127,31,0.45))]"
        />
        <p className="font-ui text-[10px] uppercase tracking-[0.25em] text-gold">
          Vietnamese Minds · Global Solutions
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-pixel text-sm uppercase tracking-wider">
          {[
            ["Giới thiệu", "#about"],
            ["Đội ngũ", "#members"],
            ["Sản phẩm", "#products"],
            ["Đối tác", "#partners"],
            ["Tuyển dụng", "#careers"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-cream/70 transition-colors hover:text-ember"
            >
              {label}
            </a>
          ))}
        </nav>

        <p className="font-mono text-[11px] text-cream/60">
          © 2026 VNZ. Press START to build something great.
        </p>
      </div>
    </footer>
  );
}
