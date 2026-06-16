"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** Site flow (matches page section order). Labels carry diacritics, so they
 *  render in `font-pixel` (VT323) — the Silkscreen UI face has no Vietnamese. */
const SECTIONS = [
  { id: "top", label: "Trang chủ" },
  { id: "about", label: "Giới thiệu" },
  { id: "members", label: "Đội ngũ" },
  { id: "products", label: "Sản phẩm" },
  { id: "partners", label: "Đối tác" },
  { id: "careers", label: "Tuyển dụng" },
];

export function SiteNav() {
  // `scrolled` drives the whole light→dark flip: at the very top the bar is
  // transparent over the bright sunset hero (ink text + dark logo); once the
  // page scrolls it becomes a frosted dark bar (cream text + cream logo).
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("top");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy — highlight the section nearest the top of the viewport.
  useEffect(() => {
    const ids = ["top", ...SECTIONS.map((s) => s.id), "contact"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Reflect the section you're reading in the browser tab title. The static
  // metadata title (layout.tsx) is only the SSR/first-paint default — it never
  // changes on its own, which is why the tab stayed frozen on one name. This
  // swaps document.title live as the scrollspy `active` section changes.
  useEffect(() => {
    const labels: Record<string, string> = {
      ...Object.fromEntries(SECTIONS.map((s) => [s.id, s.label])),
      top: "Vietnam Z-DNA Technology", // home: show the brand, not "Trang chủ"
      contact: "Liên hệ",
    };
    document.title = `VNZ — ${labels[active] ?? "Vietnam Z-DNA Technology"}`;
  }, [active]);

  const onDark = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-300 ${
        onDark
          ? "border-b border-cream/10 bg-ink/85 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
        {/* Logo — dark mark on the bright hero, cream mark on the dark bar. */}
        <a
          href="#top"
          className="flex items-center gap-2"
          aria-label="VNZ home"
        >
          <span className="relative block w-16 sm:w-28">
            <Image
              src="/general/logo-light.png"
              alt="VNZ"
              width={1094}
              height={560}
              priority
              unoptimized
              style={{ opacity: onDark ? 0 : 1 }}
              className="pixelated block h-auto w-full drop-shadow-[2px_2px_0_rgba(27,36,51,0.3)] transition-opacity duration-300"
            />
            <Image
              src="/general/logo-dark.png"
              alt=""
              aria-hidden
              fill
              unoptimized
              style={{ opacity: onDark ? 1 : 0 }}
              className="pixelated object-contain drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] transition-opacity duration-300"
            />
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 font-pixel text-base lg:flex">
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative block px-3 py-2 uppercase tracking-wider transition-colors hover:text-ember ${
                    isActive
                      ? "text-ember"
                      : onDark
                        ? "text-cream/90"
                        : "text-ink"
                  }`}
                >
                  {s.label}
                  <span
                    className={`pointer-events-none absolute inset-x-2 bottom-1 h-[2px] origin-left bg-ember transition-transform duration-200 ease-out ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              </li>
            );
          })}
          <li className="ml-2">
            <a
              href="#contact"
              className="font-pixel inline-flex items-center gap-1.5 border-2 border-ember bg-ember/0 px-4 py-1.5 text-base uppercase tracking-wider text-ember transition-colors duration-200 hover:bg-ember hover:text-cream"
            >
              Liên hệ
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          className={`flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden ${
            onDark ? "text-cream" : "text-ink"
          }`}
        >
          <span
            className={`block h-0.5 w-6 bg-current transition-transform duration-200 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-transform duration-200 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-cream/10 bg-ink/95 backdrop-blur-md transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? "max-h-96 border-t opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-5 py-4 font-pixel text-lg">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className={`block px-2 py-2 uppercase tracking-wider transition-colors hover:text-ember ${
                  active === s.id ? "text-ember" : "text-cream/90"
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
          <li className="mt-1">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="block border-2 border-ember px-2 py-2 text-center uppercase tracking-wider text-ember transition-colors hover:bg-ember hover:text-cream"
            >
              Liên hệ
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
