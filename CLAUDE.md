# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (v11+). Native deps (`sharp`, `unrs-resolver`) need build approval — see pnpm note below.

| Command | Purpose |
|---|---|
| `pnpm dev` | Dev server (Turbopack) at http://localhost:3000 |
| `pnpm build` | Production build — also runs the full TypeScript type-check |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint (flat config; no path arg needed) |

There is **no test runner configured** — `pnpm build` is the de-facto correctness gate since it type-checks the whole project.

## Stack

Next.js 16.2 (App Router + Turbopack) · React 19 · TypeScript 5 (`strict`) · Tailwind CSS **v4** · ESLint 9 (flat config). Source lives under `src/`; import alias `@/*` → `src/*`.

## Architecture notes (the non-obvious parts)

### Tailwind CSS v4 — there is no `tailwind.config.js`
All Tailwind configuration lives in **`src/app/globals.css`**, not a JS config file. `@import "tailwindcss";` replaces the old `@tailwind` directives, and PostCSS wiring is just `@tailwindcss/postcss` in `postcss.config.mjs`. The entire design system is the **`@theme { ... }`** block — adding a token there is what makes a utility like `bg-sky`, `text-ember`, `font-display`, or `animate-bob` resolve.

**Palette (sampled from the hero cityscape art).** Warm 16-bit sunset set, all defined as `--color-*` tokens:
- Surfaces / sky: `sky` (#f7e8c6, the page bg), `cream` (#fbf4e2), `parchment` (#f3e4c1).
- Ink / text: `ink` (#1b2433, near-black body text + borders), `ink-soft` (#46506a, muted copy).
- Warm accents: `terracotta` (#c47a55), `clay` (#a85d3e), `lantern` (#d8443a), `sunset` (#ef7f1f), `ember` (#e8541f, the hover/active highlight), `gold` (#f0b34a), `jade` (#5fa39a), `lotus` (#e79bb0).
Default body is `bg-sky font-mono text-ink` (set in `layout.tsx`); `ember` is the canonical interactive-hover color across nav, buttons, and links.

**Fonts** map to three utilities — `font-display`, `font-ui`, `font-mono` (see Fonts section). Use those utilities, never raw family names.

**Animations.** `--animate-*` tokens pair with `@keyframes` below them: `bob` (gentle float — on hero party + cards), `twinkle` (on the ❖ glyph), `rise` (card entrance via `.animate-rise`). `sway` is defined but currently unused. The `fall` keyframe drives `.petal` directly (it is **not** an `--animate-*` utility). A `@media (prefers-reduced-motion: reduce)` block at the bottom kills all ambient loops and hides petals — preserve that when adding motion.

**Reusable pixel primitives** live in the `@layer components` block:
- `.pixel-frame` — chunky double border (ink/cream/ink) built from stacked `box-shadow`s, `border-radius: 0`. The signature framed look; intentionally not a real `border`.
- `.btn-pixel` — pressable 8-bit button: ink fill, hard 3D drop shadow, hover → `ember` bg + sunset glow, active → `translate(4px,4px)` press. Carries its own `font-ui`.
- `.statbar` + `.statbar > .fill` — NES-style segmented stat bar. Fill is `width: 0` until an ancestor gets `.is-visible`, then animates to `--val`; color comes from `--c`, stagger from `--delay`.
- `.scanlines` / footer scanline overlay — CRT line texture via `::after`.
- `.ground-shadow` — elliptical shadow under standing characters via `::after`.
`.pixelated` (top-level, not in the layer) forces nearest-neighbor image scaling and is applied to every art asset.

**Per-member accent tinting (the key theming hook).** Each member in `src/lib/members.ts` carries a `tint` that is a palette token reference (e.g. `"var(--color-sunset)"`). Components set it as an inline CSS var — `style={{ "--tint": member.tint }}` on a card, `--c` on each stat-bar fill — and consume it via arbitrary-value utilities like `text-[color:var(--tint)]`. That single field recolors the card header, role label, and stat bars; it's how you re-theme a member without touching CSS.

### Landing page (the whole app right now)
`src/app/page.tsx` composes `SiteNav`, `Hero`, `TeamRoster`, `SiteFooter` from `src/components/`. Aesthetic is a 16-bit JRPG "character select" screen over the pixel cityscape. `TeamRoster` is the only **client** component (`"use client"`) — it uses an `IntersectionObserver` to add `.is-visible`, which triggers the CSS skill-bar fills. Team data (names, RPG class, level, skills, accent `tint`) is in **`src/lib/members.ts`**; edit there to change roster content. Names are kept ASCII on purpose — the pixel fonts have no Vietnamese diacritic glyphs.

Two layout details worth knowing:
- **Hero party lineup.** `Hero` renders every member standing on the plaza. Each one's placement comes from an optional `pose` (`Pose` type in `members.ts`: `scale` / `x` / `y` / `z` / `flip`) applied as a `transform` on a wrapper with `transform-origin: bottom center`, so feet stay planted across screen sizes — the pose wrapper is separate from the image so it doesn't fight the image's own `bob`/hover transforms.
- **Falling petals.** `Hero`'s `PETALS` array is pre-baked (no `Math.random` at runtime, to keep SSR deterministic); each `.petal` reads its drift/size/color from inline style. They're purely decorative and disabled under reduced-motion.

### Fonts
`src/app/layout.tsx` loads **Pixelify Sans** (`--font-pixelify`, display), **Silkscreen** (`--font-silkscreen`, UI/labels), and **Geist Mono** (`--font-geist-mono`, body) via `next/font/google`. `@theme` maps these to `--font-display` / `--font-ui` / `--font-mono`, so use the `font-display` / `font-ui` / `font-mono` utilities — not raw font names.

### Image assets & the background-cutout pipeline
Source art is in `public/general/` (hero, logo) and `public/members/`. The member/logo PNGs shipped as **RGB with a solid near-white/cream background, no alpha**. `scripts/cutout.py` (Pillow) keys that background out by **border flood-fill** — only background connected to the edge is cleared, so interior whites (clothing, shoes) survive — writing transparent PNGs to `public/members/cutout/` and `public/general/logo-cut.png`. The app references the cutout versions. Re-run with `python3 scripts/cutout.py` if source art changes. All art is rendered with `unoptimized` + `.pixelated` to keep pixels crisp. (`scripts/shot.mjs` is a CDP full-page screenshot helper used for visual QA.)

### pnpm native build approval
`pnpm-workspace.yaml` carries an `allowBuilds:` block enabling postinstall scripts for `sharp` and `unrs-resolver`. If a fresh `pnpm install` warns `ERR_PNPM_IGNORED_BUILDS`, set those entries to `true` there (this repo already does). Note: Next.js detects `pnpm-workspace.yaml` as an "additional lockfile" and may emit a workspace-root inference warning during builds — it's benign.
