"use client";

import Image from "next/image";
import { useSpotlight } from "@/components/spotlight";

const LINKS = ["About", "Team", "Culture", "Contact"];

export function SiteNav() {
  // When a member is spotlit the stage goes dark behind the (transparent) nav,
  // so swap to the light logo and flip the ink text to cream to stay legible.
  const { active } = useSpotlight();
  const lit = active !== null;

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 sm:py-6">
        <a
          href="#top"
          className="flex items-center gap-2"
          aria-label="VNZ home"
        >
          {/* Both logos are mounted and cross-faded so the swap never flashes. */}
          <span className="relative block w-24 sm:w-44">
            <Image
              src="/general/logo-light.png"
              alt="VNZ — Vietnamese Minds, Global Solutions"
              width={1094}
              height={560}
              priority
              unoptimized
              style={{ opacity: lit ? 0 : 1 }}
              className="pixelated block h-auto w-full drop-shadow-[2px_2px_0_rgba(27,36,51,0.25)] transition-opacity duration-300"
            />
            <Image
              src="/general/logo-dark.png"
              alt=""
              aria-hidden
              fill
              unoptimized
              style={{ opacity: lit ? 1 : 0 }}
              className="pixelated object-contain drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] transition-opacity duration-300"
            />
          </span>
        </a>

        <ul className="hidden items-center gap-1 font-ui text-[11px] sm:flex">
          {LINKS.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className={`group relative block px-3 py-2 uppercase tracking-wider transition-colors hover:text-ember ${
                  lit ? "text-cream" : "text-ink"
                }`}
              >
                {link}
                <span className="pointer-events-none absolute inset-x-2 bottom-1 h-[3px] origin-left scale-x-0 bg-ember transition-transform duration-150 ease-out group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#team"
          className={`font-ui text-[10px] uppercase tracking-wider transition-colors sm:hidden ${
            lit ? "text-cream" : "text-ink"
          }`}
          aria-label="View the team"
        >
          ▸ Team
        </a>
      </nav>
    </header>
  );
}
