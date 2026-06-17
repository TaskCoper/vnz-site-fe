import type { StaticImageData } from "next/image";

// Product art lives in /public/products/<slug>/. The *-trim.png variants are the
// originals cropped to their alpha bounding box (see scripts/trim.py) so they sit
// tightly in the showcase frame. `logo` is the square app-icon/box mark; `text`
// is the brand wordmark lockup. Both are pixel art → rendered `unoptimized` +
// `.pixelated`. Swap the import (not a hardcoded size) to change art.
import stylaiLogo from "../../public/products/stylaibox/logo-trim.png";
import stylaiText from "../../public/products/stylaibox/text-trim.png";
import taskcoperLogo from "../../public/products/taskcoper/logo-trim.png";
import taskcoperText from "../../public/products/taskcoper/text-trim.png";

/**
 * Product showcase data — drives the "Sản phẩm" section (see
 * `src/components/products.tsx`). Edit copy here, not in the component.
 *
 * Like the team roster, each product carries a `tint` (a palette token from the
 * `@theme` block in globals.css) that recolors its whole panel: the logo glow,
 * the tagline accent, the stat-bar fills and the CTA. `name` is ASCII so it can
 * feed the pixel display fonts; all Vietnamese copy (`tagline`, `desc`,
 * `features`) renders in `font-viet` / `font-pixel`, both diacritic-capable.
 *
 * `stat`s reuse the NES-style `.statbar` primitive — playful "product DNA"
 * meters in keeping with the JRPG character-sheet aesthetic.
 */
export type ProductStat = { label: string; value: number };

export type Product = {
  slug: string;
  name: string; // ASCII brand short-name (pixel fonts / alt text)
  category: string; // eyebrow — e.g. "Thời trang · AI"
  status: string; // gaming status pill — e.g. "Bản thử nghiệm"
  // Public detail copy. OMITTED on purpose for `locked` products: the real text
  // must never reach the browser (not in the DOM, not in the JS bundle), so a
  // locked product ships nothing here and the panel renders a blurred placeholder
  // skeleton instead. Keep the real draft in a code comment (stripped at build).
  tagline?: string; // big headline line (Vietnamese)
  desc?: string; // supporting paragraph (Vietnamese)
  features?: string[]; // 3–4 short capability bullets (Vietnamese)
  stats?: ProductStat[]; // "product DNA" stat bars
  tint: string; // CSS palette-token reference, e.g. "var(--color-violet)"
  logo: StaticImageData; // square app-icon / box mark
  logoRatio: string; // intrinsic aspect for the framed stage (avoids CLS)
  wordmark: StaticImageData; // brand logotype lockup
  wordmarkClass?: string; // optional Tailwind height for the wordmark (defaults
  // to "h-9 w-auto sm:h-11" in the component) — wordmarks have different aspect
  // ratios, so some need to run larger to read at the same visual weight.
  cta: string; // "play" button label (Vietnamese)
  href: string; // CTA target — routes interest to #contact until products are live
  locked?: boolean; // unreleased → blur the detail block behind a "Sắp ra mắt"
  // lock so the specifics stay hidden. Brand art, name, status + CTA still show
  // (teaser). Flip to false (or remove) when the product launches.
};

export const PRODUCTS: Product[] = [
  {
    slug: "stylaibox",
    name: "StylaiBox",
    category: "Thời trang · Trí tuệ nhân tạo",
    status: "Sắp ra mắt",
    // 🔒 LOCKED (chưa ra mắt). tagline/desc/features/stats are deliberately
    // omitted so the real copy NEVER ships to the browser (no DOM, no JS
    // bundle) — the panel renders a blurred placeholder skeleton instead.
    // The launch draft is kept ONLY in this comment (comments are stripped from
    // the production build). When StylaiBox goes live, paste these back into
    // real fields and set `locked: false`:
    //   tagline: "Tủ đồ thông minh, dẫn lối phong cách"
    //   desc: "StylaiBox là người bạn thời trang số — dùng trí tuệ nhân tạo để
    //     gợi ý cách phối đồ, sắp xếp tủ quần áo và giúp bạn tự tin tỏa sáng mỗi
    //     ngày, dù là đi làm, đi học hay xuống phố."
    //   features:
    //     - "Gợi ý phối đồ bằng AI theo gu riêng của bạn"
    //     - "Số hóa tủ đồ — biết mình đang có gì, mặc gì"
    //     - "Phối theo thời tiết, dịp & xu hướng mới nhất"
    //     - "Lưu lại và chia sẻ những set đồ tâm đắc"
    //   stats: Phong cách 94 · Cá nhân hóa 90 · Dễ dùng 88
    tint: "var(--color-violet)",
    logo: stylaiLogo,
    logoRatio: "749 / 889",
    wordmark: stylaiText,
    cta: "Nhận tin ra mắt",
    href: "#contact",
    locked: true, // chưa ra mắt — làm mờ phần thông tin chi tiết
  },
  {
    slug: "taskcoper",
    name: "TaskCoper",
    category: "Năng suất · Quản lý công việc",
    status: "Bản chính thức",
    tagline: "Chinh phục mọi công việc, từng nhiệm vụ một",
    desc: "TaskCoper biến mớ công việc hỗn độn thành một hành trình rõ ràng — lập kế hoạch, chia nhỏ nhiệm vụ và theo dõi tiến độ của cả nhóm trong cùng một không gian duy nhất.",
    features: [
      "Quản lý nhiệm vụ & dự án một cách trực quan",
      "Cộng tác nhóm theo thời gian thực",
      "Theo dõi tiến độ bằng bảng & biểu đồ",
      "Nhắc việc thông minh, không bỏ lỡ deadline",
    ],
    stats: [
      { label: "Tốc độ", value: 92 },
      { label: "Cộng tác", value: 89 },
      { label: "Tổ chức", value: 95 },
    ],
    tint: "var(--color-azure)",
    logo: taskcoperLogo,
    logoRatio: "1049 / 1072",
    wordmark: taskcoperText,
    wordmarkClass: "h-14 w-auto sm:h-20", // runs larger than StylaiBox's lockup
    cta: "Trải nghiệm thử",
    href: "https://taskcoper.com",
  },
];
