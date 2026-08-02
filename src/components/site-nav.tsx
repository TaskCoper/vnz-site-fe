"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Site navigation — burger-only, at every breakpoint.
 *
 * The bar carries three things and nothing else: the logo, the primary CTA and
 * the menu toggle. Every destination lives inside a full-screen overlay rather
 * than a link row, which keeps the first viewport of the homepage almost
 * entirely hero art.
 *
 * Three behaviours worth knowing before editing:
 *
 *  · TWO TONES. At the top of the page the hero is a bright cream sunset, so
 *    the bar runs in dark ink with the light-background logo. Once scrolled it
 *    runs cream on a dark block. Both logo files are used exactly as supplied —
 *    never recoloured or filtered, only resized.
 *  · DIRECTIONAL. Past the first screen the bar gets out of the way while you
 *    read downward and returns the moment you scroll up, so navigation is one
 *    gesture away without permanently occupying the viewport.
 *  · NO BAR. Once scrolled it resolves into two small floating blocks with the
 *    page showing through between them, instead of one full-width slab that
 *    spends most of its width being an empty rectangle over the artwork.
 */

/**
 * Menu destinations — one entry per homepage chapter, in story order, so the
 * overlay reads as a table of contents. The numbering and the open stagger both
 * derive from this array, and every href must resolve to a real section id on the
 * page (`src/app/page.tsx`); never list a chapter that isn't mounted.
 *
 * "Con đường" (#way) is gone rather than merely unlisted — that chapter was cut
 * from the page, so there is no id left for it to point at.
 */
/**
 * Root-relative on purpose. The nav renders on `/doi-ngu` and `/tuyen-dung` too,
 * where none of these sections exist — bare `#story` / `#products` anchors were
 * silently dead on both subpages (they resolved to nothing and the click did
 * nothing). `/#id` navigates home and then scrolls. `#contact` stays bare because
 * the footer carries that id on every page.
 */
const NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/#story", label: "Câu chuyện" },
  { href: "/#products", label: "Dấu ấn VNZ" },
  { href: "/doi-ngu", label: "Đội ngũ" },
  { href: "/#partners", label: "Đối tác" },
  { href: "/tuyen-dung", label: "Tuyển dụng" },
  { href: "#contact", label: "Liên hệ" },
];

const CTA_HREF = "#contact";
const CTA_LABEL = "Liên hệ hợp tác";

/**
 * `tone` describes what the bar sits ON at scroll-top, not the bar itself.
 * Unscrolled, the menu glyph inherits the page: `"light"` (the paper homepage
 * and `/tuyen-dung`) needs an ink glyph, `"dark"` (the `/doi-ngu` stage, which
 * opens on a full-bleed `bg-ink` backdrop) needs a cream one — an ink glyph
 * there is invisible until the first scroll paints the floating plate behind it.
 * Once scrolled or opened, both tones converge on cream, so this only governs
 * the top-of-page state.
 */
export function SiteNav({ tone = "light" }: { tone?: "light" | "dark" } = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      // The 5px threshold stops trackpad jitter from flickering the bar.
      if (y < 140) setHidden(false);
      else if (y > lastY.current + 5) setHidden(true);
      else if (y < lastY.current - 5) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape, and lock the page behind the overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;
  const onLightHero = !solid && tone === "light";
  const floating = scrolled && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-transform duration-500 ease-[cubic-bezier(0.22,0.8,0.18,1)] ${
          hidden && !open ? "-translate-y-[130%]" : "translate-y-0"
        }`}
      >
        <nav className="mx-auto flex max-w-[92rem] items-center justify-between px-4 py-3 sm:px-7 sm:py-4">
          {/* No backing plate at any scroll position — the logo sits directly
              on the page. */}
          <Link href="/" aria-label="VNZ — trang chủ" className="shrink-0">
            <Image
              src={
                onLightHero
                  ? "/general/logo-light.png"
                  : "/general/logo-dark.png"
              }
              alt="VNZ — Vietnam Z-DNA Technology"
              width={1094}
              height={560}
              priority
              unoptimized
              className={`pixelated h-auto transition-[width] duration-300 ${
                floating ? "w-20 sm:w-[5.5rem]" : "w-24 sm:w-28"
              }`}
            />
          </Link>

          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <a
              href={CTA_HREF}
              className="hidden shrink-0 whitespace-nowrap bg-ember px-5 py-3 font-pixel text-base uppercase leading-none tracking-[0.1em] text-cream shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] transition-[background-color,transform,box-shadow] duration-150 hover:bg-sunset active:translate-x-1 active:translate-y-1 active:shadow-none sm:block sm:text-lg"
            >
              {CTA_LABEL}
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Đóng menu" : "Mở menu"}
              aria-expanded={open}
              aria-controls="site-menu"
              className={`relative z-[70] flex h-[3.25rem] w-[3.25rem] shrink-0 flex-col items-center justify-center gap-[7px] transition-[background-color,box-shadow,border-color,color] duration-300 ${
                open
                  ? "text-cream"
                  : onLightHero
                    ? "text-ink hover:text-ember"
                    : "text-cream hover:text-ember"
              } ${
                floating && !open
                  ? "border border-cream/12 bg-ink/90 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] backdrop-blur-md"
                  : "border border-transparent"
              }`}
            >
              <span
                className={`block h-[3px] w-7 bg-current transition-transform duration-300 ${
                  open ? "translate-y-[10px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[3px] w-7 bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[3px] w-7 bg-current transition-transform duration-300 ${
                  open ? "-translate-y-[10px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Full-screen menu ── */}
      <div
        id="site-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-[55] transition-[opacity,visibility] duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-ink" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background:radial-gradient(90%_70%_at_78%_18%,rgba(232,84,31,0.16),transparent_70%)]"
        />
        <div className="relative flex h-full flex-col justify-between overflow-y-auto px-5 pb-10 pt-28 sm:px-8 sm:pt-32">
          <nav aria-label="Điều hướng chính" className="mx-auto w-full max-w-[92rem]">
            <ul className="flex flex-col">
              {NAV.map((item, i) => (
                <li
                  key={item.href}
                  className="border-b border-cream/10"
                  style={{
                    transform: open ? "none" : "translateY(18px)",
                    opacity: open ? 1 : 0,
                    transition: `transform 420ms cubic-bezier(0.22,0.8,0.18,1) ${
                      60 + i * 55
                    }ms, opacity 420ms ease ${60 + i * 55}ms`,
                  }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-5 py-3 text-cream sm:gap-8 sm:py-4"
                  >
                    <span className="font-mono text-xs text-cream/45 sm:text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Type is capped well below the hero's scale on purpose —
                        the full chapter list has to fit a laptop viewport without
                        the overlay turning into a scroll of its own. */}
                    <span className="font-pixel text-[clamp(1.6rem,5.5vw,3.25rem)] uppercase leading-none tracking-[0.02em] transition-[transform,color] duration-300 group-hover:translate-x-3 group-hover:text-ember">
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div
              className="mt-10"
              style={{
                opacity: open ? 1 : 0,
                transition: "opacity 420ms ease 300ms",
              }}
            >
              <a
                href={CTA_HREF}
                onClick={() => setOpen(false)}
                className="inline-block bg-ember px-6 py-4 font-pixel text-xl uppercase leading-none tracking-[0.1em] text-cream shadow-[5px_5px_0_0_#000] transition-colors hover:bg-sunset"
              >
                {CTA_LABEL} <span aria-hidden>▸</span>
              </a>
            </div>
          </nav>

          <div
            className="mx-auto mt-14 flex w-full max-w-[92rem] flex-col gap-4 border-t border-cream/10 pt-6 sm:flex-row sm:items-center sm:justify-between"
            style={{
              opacity: open ? 1 : 0,
              transition: "opacity 420ms ease 380ms",
            }}
          >
            <p className="font-ui text-[9px] uppercase tracking-[0.3em] text-gold">
              Vietnamese Minds · Global Solutions
            </p>
            {/* Vietnamese is the only build that exists, so the English entry is
                shown as pending rather than faked with a dead link. */}
            <span className="flex items-center gap-2 font-pixel text-base uppercase tracking-[0.12em]">
              <span className="text-ember">VI</span>
              <span aria-hidden className="text-cream/25">
                |
              </span>
              <span
                title="Bản tiếng Anh đang được xây dựng"
                className="cursor-not-allowed text-cream/35"
              >
                EN
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
