import Image from "next/image";

/**
 * "Giới thiệu công ty" — the VNZ brand story as a cinematic, scroll-driven
 * manifesto (lenis.dev-inspired). Server-rendered: every motion effect is a
 * NATIVE CSS scroll-driven animation (see the `.s-*` / `.clip-art` / `.h-pin-*`
 * primitives in globals.css) — no client JS, no library, no scroll-snap tie-in.
 *
 * The "wow" is carried by GIANT pixel type whose letterforms are clipped to a
 * Vietnamese pixel scene (a moving window onto Việt Nam), big full-viewport
 * beats, parallax backdrops and warm ember motes. Body copy is Vietnamese →
 * `font-viet` (Be Vietnam Pro); headlines use the pixel face (`font-pixel`).
 *
 * Pixel art used for the "window" fills + backdrops lives in /public:
 *   /members/place/saigon.png  — dramatic Saigon sunset skyline
 *   /general/hero.png          — Hanoi lakeside at dusk
 */

const SAIGON = "url(/members/place/saigon.png)";

// Pre-baked rising ember motes (no Math.random → deterministic SSR). Each act
// gets its own field via <Motes/>.
const MOTES = [
  {
    left: "5%",
    size: 6,
    dur: "17s",
    delay: "0s",
    mx: "26px",
    c: "var(--color-gold)",
  },
  {
    left: "14%",
    size: 4,
    dur: "21s",
    delay: "3s",
    mx: "-18px",
    c: "var(--color-sunset)",
  },
  {
    left: "23%",
    size: 7,
    dur: "15s",
    delay: "1.5s",
    mx: "34px",
    c: "var(--color-ember)",
  },
  {
    left: "32%",
    size: 3,
    dur: "24s",
    delay: "5s",
    mx: "-24px",
    c: "var(--color-gold)",
  },
  {
    left: "41%",
    size: 5,
    dur: "18s",
    delay: "2s",
    mx: "20px",
    c: "var(--color-lotus)",
  },
  {
    left: "50%",
    size: 4,
    dur: "22s",
    delay: "6s",
    mx: "-30px",
    c: "var(--color-gold)",
  },
  {
    left: "59%",
    size: 6,
    dur: "16s",
    delay: "0.8s",
    mx: "28px",
    c: "var(--color-sunset)",
  },
  {
    left: "68%",
    size: 3,
    dur: "25s",
    delay: "4s",
    mx: "-16px",
    c: "var(--color-gold)",
  },
  {
    left: "77%",
    size: 7,
    dur: "14s",
    delay: "2.6s",
    mx: "36px",
    c: "var(--color-ember)",
  },
  {
    left: "86%",
    size: 4,
    dur: "20s",
    delay: "5.5s",
    mx: "-22px",
    c: "var(--color-gold)",
  },
  {
    left: "94%",
    size: 5,
    dur: "19s",
    delay: "1.2s",
    mx: "24px",
    c: "var(--color-lotus)",
  },
];

const ADMIRED = [
  {
    brand: "Google",
    stat: "Tỷ +",
    label: "người tra cứu tri thức mỗi ngày",
    note: "Cánh cửa dẫn tới tri thức của cả nhân loại.",
    tint: "var(--color-gold)",
  },
  {
    brand: "Apple",
    stat: "~20 năm",
    label: "định hình cách ta chạm vào công nghệ",
    note: "iPhone tái định nghĩa thiết bị cá nhân.",
    tint: "var(--color-lotus)",
  },
  {
    brand: "Samsung",
    stat: "74",
    label: "quốc gia có mặt sản phẩm",
    note: "Công nghệ một quốc gia hiện diện toàn cầu.",
    tint: "var(--color-jade)",
  },
  {
    brand: "WeChat",
    stat: "1,4 tỷ",
    label: "người dùng mỗi tháng",
    note: "Nền tảng không thể thiếu trong đời sống.",
    tint: "var(--color-sunset)",
  },
];

const PILLARS = [
  {
    no: "01",
    tint: "var(--color-sunset)",
    title: "Doanh nghiệp",
    desc: "Đồng hành cùng doanh nghiệp trên hành trình lớn lên — vận hành hiệu quả hơn, nâng cao năng lực cạnh tranh.",
  },
  {
    no: "02",
    tint: "var(--color-jade)",
    title: "Người dùng",
    desc: "Phát triển những sản phẩm số thuận tiện hơn, nâng cao chất lượng cuộc sống cho hàng triệu người.",
  },
  {
    no: "03",
    tint: "var(--color-lotus)",
    title: "Khu vực công",
    desc: "Xây dựng các giải pháp quản lý hiện đại để tổ chức phục vụ cộng đồng tốt hơn.",
  },
];

const EDGE = [
  {
    tint: "var(--color-jade)",
    title: "Linh hoạt",
    desc: "Sự trẻ trung giúp chúng tôi thích nghi nhanh với mọi thay đổi của thị trường.",
  },
  {
    tint: "var(--color-sunset)",
    title: "Dám thử nghiệm",
    desc: "Tinh thần khởi nghiệp cho chúng tôi can đảm bước vào những điều chưa ai làm.",
  },
  {
    tint: "var(--color-gold)",
    title: "Tận tâm & Trách nhiệm",
    desc: "Điều giữ chân khách hàng không phải tốc độ — mà là sự trung thực và cam kết đồng hành.",
  },
];

const VALUES = [
  {
    glyph: "✦",
    tint: "var(--color-gold)",
    title: "Học hỏi",
    desc: "Tiếp cận tri thức toàn cầu gần như không khoảng cách, học từ những mô hình thành công của thế giới.",
  },
  {
    glyph: "◈",
    tint: "var(--color-jade)",
    title: "Đổi mới",
    desc: "Tinh thần khởi nghiệp giúp chúng tôi dám thử nghiệm và nhanh chóng thích nghi với thị trường.",
  },
  {
    glyph: "❖",
    tint: "var(--color-lotus)",
    title: "Chính trực",
    desc: "Trung thực, tinh thần phụng sự và cam kết đồng hành là lợi thế cạnh tranh bền vững nhất.",
  },
  {
    glyph: "▲",
    tint: "var(--color-ember)",
    title: "Giá trị thực",
    desc: "Không chạy theo công nghệ vì công nghệ — chọn công nghệ phù hợp để tạo ra giá trị thật mỗi ngày.",
  },
];

/** Per-act rising ember field. Absolute overlay; sits just behind the copy. */
function Motes() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden"
    >
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="mote"
          style={{
            left: m.left,
            width: m.size,
            height: m.size,
            animationDuration: m.dur,
            animationDelay: m.delay,
            ["--mx" as string]: m.mx,
            ["--mc" as string]: m.c,
          }}
        />
      ))}
    </div>
  );
}

/** Kinetic word-by-word reveal (scroll-scrubbed via .s-words in globals.css). */
function Kinetic({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`s-words ${className}`}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} style={{ ["--i" as string]: i }}>
          {word}
        </span>
      ))}
    </span>
  );
}

export function About() {
  return (
    <section
      id="about"
      className="relative isolate w-full overflow-x-clip bg-ink [view-timeline-name:--about]"
    >
      {/* Faint global scanlines over the whole act. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-25 mix-blend-soft-light [background:repeating-linear-gradient(0deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_3px)]"
      />

      {/* Reading-progress rail (desktop). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-5 z-20 hidden lg:block"
      >
        <div className="sticky top-1/2 -translate-y-1/2">
          <div className="relative h-44 w-[3px] overflow-hidden bg-cream/10">
            <span className="s-progress absolute inset-x-0 top-0 h-full bg-gradient-to-b from-gold via-sunset to-ember [box-shadow:0_0_14px_var(--color-sunset)]" />
          </div>
        </div>
      </div>

      {/* ════════ ACT 1 · Opening — full-bleed title beat ════════ */}
      <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 py-28 text-center sm:px-8">
        {/* Parallax pixel-city backdrop, scrimmed almost to black. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <Image
            src="/members/place/saigon.png"
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="s-bgpar pixelated object-cover opacity-[0.16]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />
          <div className="absolute inset-0 [background:radial-gradient(70%_60%_at_50%_45%,transparent,rgba(15,20,32,0.75))]" />
        </div>
        <Motes />

        <span className="s-fade inline-flex items-center gap-2 font-pixel text-sm uppercase tracking-[0.4em] text-gold sm:text-base">
          <span className="h-px w-10 bg-gold/50" />
          Chương 01 · Câu chuyện VNZ
          <span className="h-px w-10 bg-gold/50" />
        </span>
        <h2 className="s-rise mt-8 font-pixel text-[clamp(2.75rem,10vw,9.5rem)] uppercase leading-[0.82] text-cream [text-shadow:0_4px_40px_rgba(0,0,0,0.6)]">
          Khởi nguồn
          <br />
          từ một <span className="text-gold">câu hỏi</span>
        </h2>
        <p className="s-fade mt-9 max-w-2xl font-viet text-base font-light leading-relaxed text-cream/70 sm:text-lg">
          Khi nhắc đến công nghệ Việt Nam, người ta tự hào về những kỹ sư giỏi —
          những con người âm thầm đứng sau hàng nghìn sản phẩm quốc tế. Nhưng
          càng quan sát thế giới, chúng tôi càng nhận ra một sự thật.
        </p>
        <span
          aria-hidden
          className="animate-float absolute bottom-8 left-1/2 -translate-x-1/2 font-pixel text-2xl text-cream/55"
        >
          ▾
        </span>
      </div>

      {/* ════════ ACT 2 · The dichotomy — giant ≠ beat ════════ */}
      <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8">
        <Motes />
        <p className="s-fade font-pixel text-sm uppercase tracking-[0.4em] text-cream/60 sm:text-base">
          Một sự thật chúng tôi nhận ra
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 font-pixel uppercase leading-[0.82] sm:flex-row sm:gap-7">
          <span className="s-left text-[clamp(2.5rem,8.5vw,7.5rem)] text-cream">
            Tạo ra
            <br />
            công nghệ
          </span>
          <span className="s-grow text-[clamp(3.5rem,12vw,11rem)] leading-none text-ember [text-shadow:0_0_50px_rgba(232,84,31,0.65)]">
            ≠
          </span>
          <span className="s-right text-[clamp(2.5rem,8.5vw,7.5rem)] text-gold">
            Sở hữu
            <br />
            công nghệ
          </span>
        </div>
        <p className="s-fade mx-auto mt-12 max-w-2xl font-viet text-base font-light leading-relaxed text-cream/60 sm:text-lg">
          Một quốc gia có thể sở hữu hàng triệu kỹ sư tài năng. Nhưng chỉ khi
          tạo ra những sản phẩm, nền tảng và giải pháp của riêng mình, quốc gia
          đó mới thực sự để lại dấu ấn trên bản đồ công nghệ thế giới.
        </p>
      </div>

      {/* ════════ ACT 3 · The question — pixel-art "window" headline ════════ */}
      <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8">
        <Motes />
        <span
          aria-hidden
          className="s-fade font-pixel text-7xl leading-none text-gold/30 sm:text-8xl"
        >
          “
        </span>
        <p className="-mt-4 font-pixel uppercase leading-[0.85] text-cream sm:-mt-6">
          <span className="s-fade block text-[clamp(1.75rem,5.5vw,4.5rem)]">
            Nếu người Việt đủ năng lực
          </span>
          <span className="s-fade block text-[clamp(1.75rem,5.5vw,4.5rem)]">
            xây dựng công nghệ cho thế giới —
          </span>
          <span
            className="clip-art mt-4 block text-[clamp(2.5rem,9.5vw,9rem)] leading-[0.85]"
            style={{ ["--clip-img" as string]: SAIGON }}
          >
            tại sao chưa có dấu ấn{" "}
            <span className="whitespace-nowrap">Việt Nam?</span>
          </span>
        </p>
        <p className="s-fade mt-12 font-pixel text-sm uppercase tracking-[0.4em] text-cream/65">
          Đó là điều đã thôi thúc VNZ ra đời
        </p>
      </div>

      {/* ════════ ACT 4 · The name — Vietnam Z-DNA ════════ */}
      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <span className="s-rise block text-center font-pixel text-sm uppercase tracking-[0.4em] text-cream/60">
          Đó cũng là ý nghĩa cái tên
        </span>
        <h3 className="s-rise mx-auto mt-5 max-w-5xl bg-gradient-to-br from-gold via-sunset to-lantern bg-clip-text text-center font-pixel text-[clamp(2.25rem,8vw,7rem)] uppercase leading-[0.84] text-transparent [filter:drop-shadow(0_6px_30px_rgba(232,84,31,0.4))]">
          Vietnam Z-DNA
        </h3>
        <p className="s-fade mx-auto mt-8 max-w-3xl text-center font-viet text-base font-light leading-relaxed text-cream/80 sm:text-lg">
          <span className="text-gold">Vietnam Z-DNA Technology</span> — DNA của
          một thế hệ người Việt lớn lên trong thời đại số, mang trong mình khát
          vọng làm chủ công nghệ, tạo ra giá trị bằng công nghệ và ghi dấu ấn
          của riêng mình trên bản đồ công nghệ thế giới. Một thế hệ lớn lên cùng
          Internet, chứng kiến thế giới đổi thay từng ngày bởi công nghệ.
        </p>
      </div>

      {/* ════════ ACT 5 · Inspirations — horizontal pinned scroll ════════ */}
      <div className="h-pin relative">
        <div className="h-pin-sticky">
          <div className="mx-auto mb-8 w-full max-w-7xl shrink-0 px-6 sm:mb-10 sm:px-10">
            <span className="font-pixel text-sm uppercase tracking-[0.3em] text-gold">
              Những dấu ấn chúng tôi ngưỡng mộ
            </span>
            <div className="mt-3 flex items-end justify-between gap-4">
              <h3 className="font-pixel text-[clamp(1.85rem,4.5vw,3.5rem)] uppercase leading-[0.9] text-cream">
                Sản phẩm hóa thành
                <br className="hidden sm:block" /> dấu ấn quốc gia
              </h3>
              <span className="hidden shrink-0 items-center gap-2 font-pixel text-sm uppercase tracking-[0.25em] text-cream/60 sm:flex">
                Cuộn để khám phá
                <span className="animate-float text-lg">▸</span>
              </span>
            </div>
          </div>

          <div className="h-pin-track">
            {ADMIRED.map((it, i) => (
              <article
                key={it.brand}
                style={{ ["--tint" as string]: it.tint }}
                className="h-pin-panel relative flex h-[58vh] max-h-[30rem] w-[80vw] shrink-0 flex-col justify-between overflow-hidden border border-cream/10 bg-ink/60 p-7 backdrop-blur-md transition-colors duration-300 hover:border-[color:var(--tint)] sm:w-[60vw] sm:p-9 lg:w-[26rem]"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px] bg-[color:var(--tint)] [box-shadow:0_0_16px_var(--tint)]"
                />
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-sm uppercase tracking-[0.3em] text-cream/55">
                    {`0${i + 1}`}
                  </span>
                  <span aria-hidden className="text-[color:var(--tint)]">
                    ❖
                  </span>
                </div>
                <div>
                  <h4 className="font-pixel text-3xl uppercase leading-none text-cream sm:text-4xl">
                    {it.brand}
                  </h4>
                  <p className="mt-6 font-pixel text-5xl leading-none text-[color:var(--tint)] sm:text-6xl">
                    {it.stat}
                  </p>
                  <p className="mt-3 font-viet text-sm font-light leading-snug text-cream/70 sm:text-base">
                    {it.label}
                  </p>
                </div>
                <p className="font-viet text-sm font-light italic leading-snug text-cream/65">
                  {it.note}
                </p>
              </article>
            ))}

            <article
              style={{ ["--tint" as string]: "var(--color-ember)" }}
              className="h-pin-panel relative flex h-[58vh] max-h-[30rem] w-[80vw] shrink-0 flex-col justify-between overflow-hidden border border-ember/30 bg-gradient-to-br from-ember/10 to-lantern/5 p-7 backdrop-blur-md sm:w-[60vw] sm:p-9 lg:w-[28rem]"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] bg-ember [box-shadow:0_0_16px_var(--color-ember)]"
              />
              <span className="font-pixel text-sm uppercase tracking-[0.3em] text-ember">
                Còn Việt Nam?
              </span>
              <p className="font-pixel text-2xl uppercase leading-tight text-cream sm:text-3xl">
                Vẫn được biết đến với vai trò{" "}
                <span className="text-ember">gia công</span> & cung cấp nhân
                lực.
              </p>
              <p className="font-viet text-base font-light leading-relaxed text-cream/70">
                Một thành tựu đáng tự hào. Nhưng chúng tôi tin{" "}
                <span className="text-cream">
                  đó chưa phải đích đến cuối cùng.
                </span>
              </p>
            </article>
          </div>
        </div>
      </div>

      {/* ════════ ACT 6 · The path — "bao nhiêu người" scale-up ════════ */}
      <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8">
        <Motes />
        <span className="s-rise font-pixel text-sm uppercase tracking-[0.4em] text-gold sm:text-base">
          Con đường VNZ chọn
        </span>
        <p className="s-fade mt-7 max-w-5xl font-pixel text-[clamp(1.6rem,4.8vw,4rem)] uppercase leading-[0.95] text-cream">
          Giá trị của công nghệ không nằm ở việc nó được tạo ra ở đâu — mà ở
          việc nó tạo ra ảnh hưởng tích cực đến
        </p>
        <p className="s-grow mt-4 bg-gradient-to-r from-gold via-sunset to-ember bg-clip-text font-pixel text-[clamp(3.5rem,14vw,13rem)] uppercase leading-[0.8] text-transparent">
          bao nhiêu người
        </p>
        <p className="s-fade mx-auto mt-12 max-w-2xl font-viet text-base font-light leading-relaxed text-cream/60 sm:text-lg">
          Mỗi sản phẩm tại VNZ đều bắt đầu bằng một câu hỏi giản dị —{" "}
          <span className="text-cream">
            “Vấn đề nào đang cần được giải quyết?”
          </span>{" "}
          Chúng tôi không chạy theo công nghệ vì công nghệ, mà chọn thứ phù hợp
          nhất để tạo ra giá trị thực tế nhất.
        </p>
      </div>

      {/* ════════ ACT 7 · Who we serve — one journey, many links ════════ */}
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
        <div className="s-rise mb-12 text-center">
          <span className="font-pixel text-sm uppercase tracking-[0.4em] text-gold">
            Một hành trình, nhiều mắt xích
          </span>
          <h3 className="mt-3 font-pixel text-[clamp(1.85rem,5vw,3.75rem)] uppercase tracking-wide text-cream">
            Công nghệ phục vụ xã hội
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <div
              key={p.title}
              style={{ ["--tint" as string]: p.tint, ["--i" as string]: i }}
              className="s-rise relative h-full overflow-hidden border border-cream/10 bg-ink/50 p-7 backdrop-blur-md"
            >
              <span
                aria-hidden
                className="font-pixel text-5xl leading-none text-[color:var(--tint)]/30"
              >
                {p.no}
              </span>
              <h4 className="mt-3 font-pixel text-2xl uppercase tracking-wide text-cream">
                {p.title}
              </h4>
              <p className="mt-3 font-viet text-sm font-light leading-relaxed text-cream/70">
                {p.desc}
              </p>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[3px] bg-[color:var(--tint)] [box-shadow:0_0_16px_var(--tint)]"
              />
            </div>
          ))}
        </div>
        <p className="s-fade mx-auto mt-12 max-w-3xl text-center font-viet text-xl font-light leading-relaxed text-cream/90 sm:text-2xl">
          Công nghệ tiên tiến phải đi cùng{" "}
          <span className="font-medium text-ember">khả năng tiếp cận</span> —
          những giải pháp tốt không nên chỉ dành cho số ít.
        </p>
      </div>

      {/* ════════ ACT 8 · What makes us different — "cam kết thì không" ════════ */}
      <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8">
        <Motes />
        <p className="s-fade font-pixel text-[clamp(1.75rem,6vw,5rem)] uppercase leading-[0.9] text-cream/50">
          Công nghệ có thể
          <br /> sao chép.
        </p>
        <p className="s-grow mt-3 font-pixel text-[clamp(2.75rem,10vw,9rem)] uppercase leading-[0.82] text-gold [text-shadow:0_0_44px_rgba(240,179,74,0.35)]">
          Cam kết thì không.
        </p>
        <p className="s-fade mx-auto mt-9 max-w-2xl font-viet text-base font-light leading-relaxed text-cream/65 sm:text-lg">
          Sự trẻ trung giúp chúng tôi linh hoạt. Tinh thần khởi nghiệp giúp
          chúng tôi dám thử nghiệm. Nhưng chính sự tận tâm và trách nhiệm mới là
          điều giữ chân khách hàng.
        </p>
      </div>

      {/* EDGE cards — normal-flow block after the headline moment. */}
      <div className="mx-auto -mt-10 max-w-5xl px-5 pb-24 sm:px-8 sm:pb-28">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {EDGE.map((e, i) => (
            <div
              key={e.title}
              style={{ ["--tint" as string]: e.tint, ["--i" as string]: i }}
              className="s-rise group h-full border border-cream/10 bg-ink/40 p-6 text-left backdrop-blur-md transition-colors duration-300 hover:border-[color:var(--tint)]"
            >
              <span
                aria-hidden
                className="block h-[3px] w-10 bg-[color:var(--tint)] transition-all duration-300 group-hover:w-16 [box-shadow:0_0_14px_var(--tint)]"
              />
              <h4 className="mt-4 font-pixel text-xl uppercase tracking-wide text-cream">
                {e.title}
              </h4>
              <p className="mt-2 font-viet text-sm font-light leading-relaxed text-cream/65">
                {e.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ════════ ACT 9 · The principles we won't trade ════════ */}
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
        <div className="s-rise mb-10 text-center">
          <span className="font-pixel text-sm uppercase tracking-[0.4em] text-gold">
            Không muốn được nhớ đến như một công ty Gen Z
          </span>
          <h3 className="mt-3 font-pixel text-[clamp(1.85rem,5vw,3.75rem)] uppercase tracking-wide text-cream">
            Những nguyên tắc không đánh đổi
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              style={{ ["--tint" as string]: v.tint, ["--i" as string]: i }}
              className="s-rise group h-full border border-cream/10 bg-ink/50 p-6 backdrop-blur-md transition-colors duration-300 hover:border-[color:var(--tint)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--tint)]/40 text-xl text-[color:var(--tint)] transition-transform duration-300 group-hover:scale-110">
                {v.glyph}
              </span>
              <h4 className="mt-4 font-pixel text-xl uppercase tracking-wide text-cream">
                {v.title}
              </h4>
              <p className="mt-2 font-viet text-sm font-light leading-relaxed text-cream/65">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ════════ ACT 10 · The 10-year vision + finale ════════ */}
      <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 py-28 text-center sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <Image
            src="/members/place/saigon.png"
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="s-bgpar pixelated object-cover opacity-[0.18]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />
          <div className="absolute inset-0 [background:radial-gradient(75%_60%_at_50%_55%,transparent,rgba(15,20,32,0.78))]" />
        </div>
        <Motes />

        <span className="s-rise font-pixel text-sm uppercase tracking-[0.4em] text-gold sm:text-base">
          Tầm nhìn 10 năm
        </span>
        <h2 className="s-fade mt-5 font-pixel text-[clamp(1.5rem,4.5vw,3.25rem)] uppercase leading-tight text-cream">
          Những giá trị công nghệ
        </h2>
        <p
          className="clip-art mt-2 font-pixel text-[clamp(3rem,13vw,12rem)] uppercase leading-[0.8]"
          style={{ ["--clip-img" as string]: SAIGON }}
        >
          Made by
          <br />
          Việt Nam
        </p>
        <p className="s-fade mx-auto mt-10 max-w-3xl font-viet text-base font-light leading-relaxed text-cream/80 sm:text-lg">
          Nếu thế hệ trước đưa Việt Nam thành điểm đến của ngành gia công, thì
          thế hệ chúng tôi mong muốn đưa Việt Nam trở thành{" "}
          <span className="text-cream">
            nơi sản sinh ra những sản phẩm công nghệ có giá trị toàn cầu.
          </span>
        </p>

        <p className="s-fade mx-auto mt-14 max-w-3xl font-viet text-base font-light italic leading-relaxed text-cream/65 sm:text-lg">
          “Dấu ấn của mỗi thời đại không được tạo nên bởi những tuyên ngôn lớn
          lao, mà bởi những con người dám bắt đầu, dám theo đuổi và kiên trì tạo
          ra giá trị.”
        </p>
        <p className="mx-auto mt-10 max-w-4xl font-pixel text-[clamp(1.35rem,3.4vw,2.75rem)] uppercase leading-tight text-cream">
          <Kinetic text="VNZ không được xây dựng để gia công —" />{" "}
          <Kinetic
            text="chúng tôi được xây dựng để kiến tạo dấu ấn công nghệ thế hệ mới."
            className="text-gold"
          />
        </p>
      </div>
    </section>
  );
}
