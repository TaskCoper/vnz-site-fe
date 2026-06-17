/**
 * Recruitment data — drives the "Tuyển dụng" section (see
 * `src/components/careers.tsx`). Edit copy here, not in the component.
 *
 * Framed as a JRPG "class select": every open position is a playable "class"
 * you can pick to join the party. Like the team/product/partner data, each role
 * carries a `tint` (a palette token from the `@theme` block in globals.css) that
 * recolors its whole card — the sigil glow, accent bar, labels, tech tags and
 * stat bars — through the `--tint` CSS var.
 *
 * Two naming layers, same reason as members.ts: `klass` + `sigil` are kept ASCII
 * because they feed the pixel DISPLAY fonts (Pixelify Sans / VT323), which ship
 * NO Vietnamese diacritic glyphs. All Vietnamese copy (`role`, `summary`,
 * `duties`, `requirements`, …) renders in `font-viet` / `font-pixel`, both
 * diacritic-capable.
 *
 * `stats` reuse the NES-style `.statbar` primitive — a playful "class sheet" in
 * keeping with the character-select aesthetic. They are flavour, not literal
 * metrics.
 */

export type RoleStat = { label: string; value: number };

export type Role = {
  slug: string;
  klass: string; // RPG class name (ASCII — pixel display font)
  sigil: string; // big monogram drawn on the card's stage (ASCII)
  role: string; // real job title (Vietnamese)
  type: string; // employment-type pill (Vietnamese)
  level: string; // seniority framing (Vietnamese)
  slots: number; // open headcount
  tint: string; // CSS palette-token reference, e.g. "var(--color-jade)"
  summary: string; // one-line pitch (Vietnamese)
  stack: string[]; // tech "skill tree" tags (ASCII brand names)
  duties: string[]; // "Nhiệm vụ" — responsibilities (Vietnamese)
  requirements: string[]; // "Yêu cầu" (Vietnamese)
  stats: RoleStat[]; // class-attribute stat bars
};

/**
 * Where applications go. Routes to the on-page contact/footer like every other
 * CTA on the site (#contact). Swap to a real recruitment inbox once one exists,
 * e.g. `mailto:tuyendung@<domain>?subject=Ứng tuyển VNZ`.
 */
export const APPLY_HREF = "#contact";

export const ROLES: Role[] = [
  {
    slug: "backend-dotnet",
    klass: "Backend Guardian",
    sigil: "C#",
    role: "Thực tập sinh Backend (.NET)",
    type: "Thực tập",
    level: "Intern",
    slots: 2,
    tint: "var(--color-jade)",
    summary:
      "Người giữ nền móng hệ thống — học cách dựng API vững chắc, dữ liệu sạch và dịch vụ chạy bền bỉ dưới mọi tải.",
    stack: [".NET", "C#", "ASP.NET Core", "SQL Server", "EF Core", "Docker"],
    duties: [
      "Cùng team xây dựng API & service bằng .NET",
      "Tham gia mô hình hóa và tối ưu truy vấn dữ liệu",
      "Học cách đảm bảo hiệu năng và độ ổn định hệ thống",
      "Viết test và đọc, review code cùng mentor",
    ],
    requirements: [
      "Sinh viên năm cuối hoặc mới tốt nghiệp CNTT",
      "Có kiến thức nền tảng về C# / .NET và OOP",
      "Hiểu cơ bản về cơ sở dữ liệu và API",
      "Ham học hỏi, chủ động và có trách nhiệm",
    ],
    stats: [
      { label: "Logic", value: 92 },
      { label: "Performance", value: 88 },
      { label: "Reliability", value: 90 },
      { label: "Security", value: 85 },
    ],
  },
  {
    slug: "frontend-react",
    klass: "Frontend Artisan",
    sigil: "</>",
    role: "Thực tập sinh Frontend (React)",
    type: "Thực tập",
    level: "Intern",
    slots: 2,
    tint: "var(--color-lotus)",
    summary:
      "Người thổi hồn vào sản phẩm — học cách biến thiết kế thành giao diện mượt mà, pixel-perfect và sống động trên mọi màn hình.",
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Zustand", "REST API"],
    duties: [
      "Cùng team xây dựng giao diện bằng React / Next.js",
      "Hiện thực thiết kế thành UI responsive, pixel-perfect",
      "Tham gia tối ưu hiệu năng & trải nghiệm người dùng",
      "Kết nối API và quản lý trạng thái ứng dụng",
    ],
    requirements: [
      "Sinh viên năm cuối hoặc mới tốt nghiệp CNTT",
      "Có kiến thức nền tảng về React và JavaScript",
      "Yêu thích lập trình giao diện, chú trọng chi tiết",
      "Ham học hỏi và biết dùng Git là một lợi thế",
    ],
    stats: [
      { label: "Craft", value: 94 },
      { label: "UI / UX", value: 92 },
      { label: "Speed", value: 86 },
      { label: "Detail", value: 90 },
    ],
  },
  {
    slug: "pm-ba-intern",
    klass: "Strategist Apprentice",
    sigil: "PM",
    role: "Thực tập sinh PM / BA",
    type: "Thực tập",
    level: "Intern",
    slots: 1,
    tint: "var(--color-gold)",
    summary:
      "Người vẽ đường cho cả đội — lắng nghe nhu cầu, phân tích bài toán và biến ý tưởng thành kế hoạch rõ ràng.",
    stack: ["Agile", "Scrum", "User Story", "Figma", "Jira", "Notion"],
    duties: [
      "Thu thập và phân tích yêu cầu nghiệp vụ",
      "Viết tài liệu, user story và đặc tả tính năng",
      "Phối hợp giữa đội phát triển và các bên liên quan",
      "Theo dõi tiến độ và hỗ trợ quản lý dự án",
    ],
    requirements: [
      "Sinh viên năm cuối hoặc mới tốt nghiệp",
      "Tư duy logic, giao tiếp và trình bày tốt",
      "Ham học hỏi, chủ động và cẩn thận",
      "Đọc hiểu tài liệu tiếng Anh là một lợi thế",
    ],
    stats: [
      { label: "Analysis", value: 88 },
      { label: "Communication", value: 90 },
      { label: "Planning", value: 86 },
      { label: "Learning", value: 95 },
    ],
  },
];

/** Why join — small framed perk chips shown under the section intro. */
export const PERKS: { glyph: string; label: string }[] = [
  { glyph: "❖", label: "Môi trường trẻ, năng động" },
  { glyph: "✦", label: "Học từ sản phẩm thật" },
  { glyph: "◆", label: "Lộ trình phát triển rõ ràng" },
  { glyph: "★", label: "Văn hóa cởi mở, sáng tạo" },
];

/** Recruitment journey — rendered as a numbered JRPG "quest path". */
export const STEPS: { title: string; desc: string }[] = [
  { title: "Nộp hồ sơ", desc: "Gửi CV cùng đôi dòng giới thiệu về bạn." },
  { title: "Sàng lọc", desc: "Đội ngũ VNZ xem xét hồ sơ trong 3–5 ngày." },
  { title: "Phỏng vấn", desc: "Cùng trò chuyện về kỹ năng và định hướng." },
  { title: "Nhập cuộc", desc: "Onboard, nhận quest đầu tiên và bắt đầu." },
];
