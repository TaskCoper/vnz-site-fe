import Image from "next/image";
import DitherButton from "@/components/bits/dither-button";
import { Chapter } from "@/components/story-kit";
import { PARTNERS } from "@/lib/partners";

/**
 * Chương cuối · Đối tác — the first people who said yes, and the page's last word
 * before the footer.
 *
 * THREE MARKS, STANDING STILL. This was a `.marquee` — an endlessly drifting belt
 * — and it was the wrong pattern for the content. A marquee sells "more than you
 * can count", which is why it needs roughly ten items to work. With three, every
 * screen showed the same three brands twice over and the repeat was legible at a
 * glance: the belt advertised the shortage instead of covering it. Three marks at
 * full size, holding still, make a stronger claim than six sliding past.
 *
 * A GROWING ROSTER DOES NOT NEED THE BELT BACK. The grid below wraps on its own —
 * six partners are two rows, twelve are four — with nothing to retune. The
 * marquee is the answer to a different question: "keep this to ONE line however
 * long the list gets". Only bring it back if that is the requirement, and if you
 * do, its track width, repeat count and cycle duration all have to be derived
 * from `PARTNERS.length` rather than typed, which is precisely what went wrong
 * last time.
 *
 * NO PLATE, NO CUTOUT. The partner marks shipped as smooth raster logos on a
 * SOLID WHITE background (not pixel art, no alpha). Flood-filling them would
 * either leave a halo or punch holes in the highlights, so `mix-blend-multiply`
 * melts the white into the ground instead. Resting state is greyscale so three
 * different brand palettes don't fight each other; hover restores one brand's
 * real colour at a time, which is also what makes the row feel touchable.
 *
 * ONLY VALID ON A LIGHT GROUND. On ink, multiply does the opposite — the white
 * plate survives as a bright slab and the mark is crushed away. The mirrored
 * version is `invert` + `mix-blend-screen` over a dark plate, and it costs the
 * hover-to-colour, since brand colour cannot survive an invert. This chapter was
 * briefly on ink and came back. Swap ground, plate and blend together or not at
 * all.
 *
 * `category` and `blurb` in `src/lib/partners.ts` are DELIBERATELY UNUSED. They
 * are flagged in that file as inferred placeholders rather than confirmed
 * positioning, and three eyebrows plus three paragraphs turns a credibility row
 * into a wall. Wire them up once they are real copy and the row has earned the
 * space.
 */
export function Partners() {
  return (
    <section
      id="partners"
      className="relative isolate w-full overflow-x-clip paper pb-24 pt-24 sm:pb-28 sm:pt-28"
    >
      {/* ── Grid field ──
          The same blueprint grid the Dấu ấn act stands on, so the two paper
          chapters read as one surface rather than as a textured stage followed by
          a blank one. Two `repeating-linear-gradient`s crossed at 56px in ink at
          5%: paper tooth, not a table.

          The radial mask is what stops it looking like a spreadsheet — the lines
          are strongest at centre and dissolve before any edge, so the grid has no
          border of its own and nothing to line up with the section boundary.
          KEEP THE 56px AND THE 5% IN STEP with `products-act.tsx`; a grid that is
          nearly-but-not-quite the same across a seam is worse than none. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:repeating-linear-gradient(0deg,rgba(21,22,26,0.05)_0_1px,transparent_1px_56px),repeating-linear-gradient(90deg,rgba(21,22,26,0.05)_0_1px,transparent_1px_56px)] [mask-image:radial-gradient(80%_70%_at_50%_50%,#000_35%,transparent_100%)]"
      />

      <header className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Chapter label="Đối tác" />
        {/* One line, and a RESTRAINED one. The old header here was a full
            `Headline` — display-size title plus a lead — and it was cut for
            getting in front of the marks. But a bare row of grey logos under a
            14px label reads as a sponsor bar rather than as proof, so the context
            comes back at a size that introduces the row instead of competing with
            it. The count is derived, not typed, so it cannot go stale the moment
            a fourth partner is added. */}
        <h2 className="s-rise mt-5 font-pixel text-[clamp(1.4rem,3.4vw,2.4rem)] uppercase leading-tight text-ink">
          {PARTNERS.length} thương hiệu đã{" "}
          <span className="text-clay">đi cùng</span> chúng tôi
        </h2>
      </header>

      {/* ── The marks ──
          A plain grid: one column on phones, three abreast from `sm` up. No
          horizontal scroll, nothing moving — see the note at the top of the file.

          THIS IS WHAT SCALES, and it is why the marquee is not coming back on its
          own. A grid wraps: six partners become two rows, twelve become four, with
          no code change and no tuning. The marquee needed its track width, its
          repeat count and its cycle duration kept in step with the list by hand,
          and got them wrong the moment the list changed. If the row ever has to
          stay ONE line regardless of count, that is the case for bringing the belt
          back — not the count itself. */}
      <ul className="mx-auto mt-14 grid max-w-5xl list-none grid-cols-1 items-start gap-10 px-5 sm:grid-cols-3 sm:gap-8 sm:px-8">
        {PARTNERS.map((p) => {
          const mark = (
            <>
              {/* THE PLATE STAYS, even though the section ground is already the
                  right colour and a bare `mix-blend-multiply` would blend
                  straight into it. `isolate` + a local copy of `.paper` makes the
                  blend immune to whatever stacking context an ancestor grows
                  later — an `opacity` reveal or a transform on any wrapper would
                  otherwise leave the marks keying against nothing and floating as
                  pale rectangles, which is a genuinely confusing bug to chase.
                  It must be the `paper` CLASS, not a matching flat colour: the
                  ground carries a fibre texture, and an opaque flat plate covers
                  it, so the eye catches the rectangle even at identical colour. */}
              <div className="relative isolate flex h-36 w-full items-center justify-center paper px-8 sm:h-40">
                <Image
                  src={p.logo}
                  alt={p.name}
                  className="relative max-h-24 w-auto max-w-full object-contain opacity-85 mix-blend-multiply grayscale transition-[opacity,filter,transform] duration-500 group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0 sm:max-h-28"
                />
              </div>

              {/* NO NAME PLATE UNDER THE MARK. Every one of these logos is a
                  wordmark — the brand name is already drawn into the artwork — so
                  a caption repeated the same words in a different typeface right
                  under them. The name still reaches assistive tech through the
                  image's `alt`, which is now the ONLY place it lives: don't drop
                  that to a decorative empty string. */}

              {/* NO HOVER RULE UNDER THE MARK. There was a tint bar that drew
                  itself in — the member cards' affordance, borrowed. Under a bare
                  logo with no caption it read as an underline attached to nothing.
                  The hover now lives entirely in the mark: greyscale lifts to the
                  brand's real colour and it grows a touch. That IS the affordance,
                  and it is a better one, because the thing that responds is the
                  thing you are pointing at. */}
            </>
          );

          return (
            <li
              key={p.slug}
              style={{ ["--tint" as string]: p.tint }}
              className="group flex flex-col items-center gap-3 text-center"
            >
              {p.href ? (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={p.name}
                  className="flex flex-col items-center gap-3"
                >
                  {mark}
                </a>
              ) : (
                mark
              )}
            </li>
          );
        })}
      </ul>

      {/* ── Open invitation ──
          The chapter doubles as the page's business CTA, and as the last thing
          above the footer it is the final fork: work with us, or join us. */}
      <div className="s-fade mx-auto mt-20 flex max-w-3xl flex-col items-center gap-6 px-5 text-center sm:px-8">
        <p className="font-viet text-base font-light leading-relaxed text-ink-soft sm:text-lg">
          Bạn đang có một bài toán cần giải bằng công nghệ? Chúng tôi luôn mở cửa
          cho những hợp tác tạo ra giá trị thật.
        </p>

        {/* The primary action keeps `DitherButton` rather than the site-wide
            `.btn-pixel`: a live Bayer-dither surface marks the one button that
            matters. It must stay the ONLY one on the page — the contrast is the
            point and it stops working the moment it is used twice.

            "BẮT ĐẦU MỘT DỰ ÁN", NOT "LIÊN HỆ HỢP TÁC". The nav carries a fixed
            "Liên hệ hợp tác" button that is on screen at the same time as this
            one, both pointing at `#contact`. Two identical labels in two different
            styles read as a mistake even when nobody can say why. Same
            destination, different words, and this one names the outcome rather
            than the mechanism. */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          {/* `ditherColor` is a literal hex, not a CSS var: the pattern is
              painted into a canvas and `parseHex` can only read hex. */}
          <DitherButton
            href="#contact"
            ditherColor="#e8541f"
            ditherOpacity={0.22}
            ditherSize={5}
            className="gap-2 px-8 py-3 text-lg"
          >
            Bắt đầu một dự án <span aria-hidden>▸</span>
          </DitherButton>
          <a
            href="/tuyen-dung"
            className="font-pixel inline-flex items-center gap-2 border-2 border-ink/40 px-7 py-3 text-lg uppercase tracking-wider text-ink transition-colors duration-200 hover:border-ember hover:bg-ink/5 hover:text-ember"
          >
            Gia nhập đội ngũ
          </a>
        </div>
      </div>

      {/* NO `ActGap` HERE. That spacer is a chapter break — a hairline with a lit
          node, meaning "this beat is over, the next one is coming". This is the
          last section on the page; the only thing after it is the footer, so the
          divider was promising something that never arrives. The footer's own top
          border is the boundary now. */}
    </section>
  );
}
