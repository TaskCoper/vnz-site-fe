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

**Fonts** map to five utilities — `font-display`, `font-ui`, `font-mono`, `font-viet`, `font-pixel` (see Fonts section). Use those utilities, never raw family names. **Only `font-viet` and `font-pixel` carry Vietnamese diacritics**; routing Vietnamese copy through `font-display` / `font-ui` renders missing-glyph boxes. In practice: `font-pixel` for headlines and labels, `font-viet` for body copy.

**Animations.** `--animate-*` tokens pair with `@keyframes` below them: `bob` (gentle float — on hero party + cards), `twinkle` (on the ❖ glyph), `rise` (card entrance via `.animate-rise`). `sway` is defined but currently unused. The `fall` keyframe drives `.petal` directly (it is **not** an `--animate-*` utility). A `@media (prefers-reduced-motion: reduce)` block at the bottom kills all ambient loops and hides petals — preserve that when adding motion.

**Reusable pixel primitives** live in the `@layer components` block:
- `.pixel-frame` — chunky double border (ink/cream/ink) built from stacked `box-shadow`s, `border-radius: 0`. The signature framed look; intentionally not a real `border`.
- `.btn-pixel` — pressable 8-bit button: ink fill, hard 3D drop shadow, hover → `ember` bg + sunset glow, active → `translate(4px,4px)` press. Carries its own `font-ui`.
- `.statbar` + `.statbar > .fill` — NES-style segmented stat bar. Fill is `width: 0` until an ancestor gets `.is-visible`, then animates to `--val`; color comes from `--c`, stagger from `--delay`. **Add `.is-scrub`** in server components: that variant takes its final width as the *default* and scrubs 0 → `--val` on scroll instead, so it needs no client JS — and its track is neutral black rather than the base class's leftover navy.
- `.scanlines` / footer scanline overlay — CRT line texture via `::after`.
- `.ground-shadow` — elliptical shadow under standing characters via `::after`.
`.pixelated` (top-level, not in the layer) forces nearest-neighbor image scaling and is applied to every art asset.

**Per-member accent tinting (the key theming hook).** Each member in `src/lib/members.ts` carries a `tint` that is a palette token reference (e.g. `"var(--color-sunset)"`). Components set it as an inline CSS var — `style={{ "--tint": member.tint }}` on a card, `--c` on each stat-bar fill — and consume it via arbitrary-value utilities like `text-[color:var(--tint)]`. That single field recolors the card header, role label, and stat bars; it's how you re-theme a member without touching CSS.

### Landing page (the whole app right now) — a chaptered story
`src/app/page.tsx` composes the homepage as **one continuous narrative in numbered chapters**, not a menu of blocks:

`SiteNav` · `Hero` · `Story` (01 Câu chuyện) · `Way` (02 Con đường) · `Products` (03) · `Team` (04) · `Partners` (05) · `Careers` (06) · `Vision` (07 Tầm nhìn) · `SiteFooter` (`#contact`).

**The order is the argument.** Hero states the thesis; Story sets up the question (*tạo ra công nghệ ≠ sở hữu công nghệ* → *tại sao chưa có dấu ấn Việt Nam?* → the name); Way turns it into a way of working; Products is the proof; Team the people; Partners outside trust; Careers the invitation; Vision the last word, landing on the footer's "Press START". Moving a chapter breaks the argument — insert new ones at the seam where they earn their place and renumber the `Chapter` / `Headline` labels.

`SiteNav` is the only **client** component on the page (scroll direction + menu overlay state). Everything else is server-rendered; the reveals are native CSS scroll-driven animations, not `IntersectionObserver`. Three lists must stay in step when chapters change: `NAV` in `site-nav.tsx`, `LINKS` in `site-footer.tsx`, and the sections mounted in `page.tsx` — an entry in either list that doesn't resolve to a mounted `id` is a dead anchor. (`#way` is deliberately not in `NAV`: it's the second half of the story, and listing it overflows the overlay on short viewports.)

- **`src/components/story-kit.tsx`** holds the pieces that make the chapters read as one document: `Chapter` (the gold "Chương 03 · Sản phẩm" label), `Headline` (label + title + lead, used by the grid chapters), `ActGap` (spacer between full-viewport beats), `Motes` (ambient embers), `Kinetic` (word-by-word scrubbed type). Reach for these before inventing a new section header.
- **Content lives in `src/lib/`** — `members.ts`, `products.ts`, `partners.ts`, `careers.ts`, and `story.ts` (`ADMIRED` / `PILLARS` / `VALUES` for chapter 02). Edit copy there, not in components.
- **Text-vs-art discipline.** Chapter 01's pixel-art furniture (drum · lotus · columns · map + skyline) always hugs the edges or runs at reduced opacity so the centre stays readable; several of those opacities and the `lg:px-[18vw]` on the "câu hỏi" beat exist purely to keep type off the art. Check both 1440px and 390px after touching them — the columns and the Việt Nam map are the two that collide first.
- **Locked products.** An unreleased product ships NO detail copy (see `products.ts`); `Products` renders a blurred skeleton behind a seal. The skeleton is decorative filler, not hidden text — keep it that way.

Two hero details worth knowing:
- **Hero party lineup.** The `Pose` type in `members.ts` (`scale` / `x` / `y` / `z` / `flip`) is legacy: the current hero is a title screen, not a plaza lineup, so `pose` is unused. It's kept for the data shape.
- **Falling petals.** `Hero`'s `PETALS` array is pre-baked (no `Math.random` at runtime, to keep SSR deterministic); each `.petal` reads its drift/size/color from inline style. They're purely decorative and disabled under reduced-motion.

### Fonts
`src/app/layout.tsx` loads **Pixelify Sans** (`--font-pixelify`, display), **Silkscreen** (`--font-silkscreen`, UI/labels), and **Geist Mono** (`--font-geist-mono`, body) via `next/font/google`. `@theme` maps these to `--font-display` / `--font-ui` / `--font-mono`, so use the `font-display` / `font-ui` / `font-mono` utilities — not raw font names.

### Image assets & the background-cutout pipeline
Source art is in `public/general/` (hero, logo) and `public/members/`. The member/logo PNGs shipped as **RGB with a solid near-white/cream background, no alpha**. `scripts/cutout.py` (Pillow) keys that background out by **border flood-fill** — only background connected to the edge is cleared, so interior whites (clothing, shoes) survive — writing transparent PNGs to `public/members/cutout/` and `public/general/logo-cut.png`. The app references the cutout versions. Re-run with `python3 scripts/cutout.py` if source art changes. All art is rendered with `unoptimized` + `.pixelated` to keep pixels crisp. (`scripts/shot.mjs` is a CDP full-page screenshot helper used for visual QA.)

### pnpm native build approval
`pnpm-workspace.yaml` carries an `allowBuilds:` block enabling postinstall scripts for `sharp` and `unrs-resolver`. If a fresh `pnpm install` warns `ERR_PNPM_IGNORED_BUILDS`, set those entries to `true` there (this repo already does). Note: Next.js detects `pnpm-workspace.yaml` as an "additional lockfile" and may emit a workspace-root inference warning during builds — it's benign.
