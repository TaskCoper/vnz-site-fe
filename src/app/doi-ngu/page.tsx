import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Member } from "@/components/member";

/**
 * /doi-ngu — the full-screen character viewer, restored from the old vnzdna.com
 * "Đội ngũ" section (`src/components/member.tsx`).
 *
 * This page used to be eleven stacked full-width profile rows. That version is
 * gone: the viewer IS the roster now — one member on stage at a time over their
 * own quê quán, dossier panel on the right, and the avatar dock at the bottom
 * cycling all eleven (hover / click / focus, plus ← →). Every field the stacked
 * rows showed still renders, just one member at a time instead of all at once.
 *
 * `Member` is left byte-identical to the original component on purpose — it is
 * the shipped design, not a re-interpretation. Everything it needs (`scanlines`,
 * `pixelated`, the `--color-*` tokens, `animate-layer-in` / `layer-out` /
 * `hero-rise`) still exists in the current `globals.css`, so it needed no edits.
 *
 * THE PAGE IS DARK. `Member` opens on a full-bleed `bg-ink` stage, which is why
 * `SiteNav` gets `tone="dark"` — the default light tone paints an ink menu glyph
 * that is invisible against this backdrop until the first scroll.
 *
 * No breadcrumb here, deliberately (unlike `/tuyen-dung`): the stage is the whole
 * page and anything stacked over its top-left corner competes with the character.
 * The nav's logo and menu already lead back home.
 */
export const metadata: Metadata = {
  title: "Đội ngũ — VNZ",
  description:
    "11 thành viên từ 11 vùng quê Việt Nam — những người bắt đầu VNZ, Vietnam Z-DNA Technology.",
};

export default function DoiNguPage() {
  return (
    <div className="relative bg-ink">
      <SiteNav tone="dark" />
      <main>
        <Member />
      </main>
      <SiteFooter />
    </div>
  );
}
