import type { StaticImageData } from "next/image";
import binhImg from "../../public/members/cutout/binh.png";
import viImg from "../../public/members/cutout/vi.png";
import duongImg from "../../public/members/cutout/duong.png";
import tanImg from "../../public/members/cutout/tan.png";
import danhImg from "../../public/members/cutout/danh.png";
import giahuyImg from "../../public/members/cutout/giahuy.png";
import tanhungImg from "../../public/members/cutout/tanhung.png";
import nguyenhuongImg from "../../public/members/cutout/nguyenhuong.png";
import quanImg from "../../public/members/cutout/quan.png";
import duongtruongImg from "../../public/members/cutout/duongtruong.png";
import namImg from "../../public/members/cutout/nam.png";

// Hometown scenes — full-bleed pixel-art backdrops shown behind the selected
// member in the hero. Each is a 16:9 cityscape/landscape of that person's quê quán.
import bentreImg from "../../public/members/place/bentre.png";
import binhdinhImg from "../../public/members/place/binhdinh.png";
import binhduongImg from "../../public/members/place/binhduong.png";
import haiduongImg from "../../public/members/place/haiduong.png";
import kontumImg from "../../public/members/place/kontum.png";
import namdinhImg from "../../public/members/place/namdinh.png";
import nhatrangImg from "../../public/members/place/nhatrang.png";
import nhontrachImg from "../../public/members/place/nhontrach.png";
import ninhbinhImg from "../../public/members/place/ninhbinh.png";
import quangngaiImg from "../../public/members/place/quangngai.png";
import saigonImg from "../../public/members/place/saigon.png";

/**
 * Team roster data.
 *
 * Two naming layers on purpose:
 *  - `name` is kept ASCII — it feeds the pixel display fonts (Pixelify Sans /
 *    Silkscreen), which ship NO Vietnamese diacritic glyphs, so full names would
 *    render as missing-glyph boxes. Used by the TeamRoster "player cards".
 *  - `fullName` + the rest of the Vietnamese profile block (`title`, `hometown`,
 *    `hobbies`, `joinDate`, `motto`) carry full diacritics and are rendered in
 *    the `font-viet` (Be Vietnam Pro) face in the hero profile panel.
 *
 * `tint` drives that member's accent everywhere: stat-bar fill, role label, the
 * hero's feet-glow, and the selected-avatar frame.
 */
export type Skill = { label: string; value: number };

/**
 * Where this member stands in the hero lineup. (Legacy: the current hero is a
 * single-character viewer, not a plaza lineup, so `pose` is unused there — it is
 * kept for the data shape / future layouts. TeamRoster order follows the array.)
 */
export type Pose = {
  order?: number;
  scale?: number;
  x?: number;
  y?: number;
  z?: number;
  flip?: boolean;
};

export type Member = {
  slug: string;
  name: string; // ASCII short name (pixel fonts) — TeamRoster cards
  role: string; // English role — TeamRoster cards
  klass: string; // RPG-style "class"
  level: number;
  img: StaticImageData; // statically imported so Next derives the real
  // width/height — the image always renders at its true aspect ratio, even if
  // a future member's art isn't square. Swap the import, not a hardcoded size.
  tint: string; // CSS color for accents
  blurb: string;
  skills: Skill[];
  pose?: Pose; // standing position (legacy lineup field)

  // --- Vietnamese profile block (hero panel; rendered in font-viet) ---
  fullName: string; // Họ và tên — e.g. "Trần Đình Thiên Tân"
  title: string; // Chức vụ — e.g. "Founder"
  hometown: string; // Quê quán — e.g. "Nam Định"
  hobbies: string; // Sở thích — e.g. "Lập trình, Thể thao, Âm nhạc"
  joinDate: string; // Ngày gia nhập công ty — e.g. "01/06/2026"
  motto: string; // Châm ngôn sống
  hometownImg: StaticImageData; // full-bleed backdrop of the member's hometown
};

/** Company identity shown in the hero (constant across members). */
export const COMPANY_NAME = "VIET NAM Z - DNA";
export const COMPANY_QUOTE = "Cùng việt nam kiến tạo đội ngũ thế hệ trẻ mới";

// Founder is first so he is the default-selected character + leading avatar.
export const MEMBERS: Member[] = [
  {
    slug: "tan",
    name: "Tan",
    role: "Founder",
    klass: "Visionary",
    level: 50,
    img: tanImg,
    tint: "var(--color-gold)",
    blurb: "Sets the vision and reads three moves ahead of the market.",
    skills: [
      { label: "Vision", value: 96 },
      { label: "Leadership", value: 92 },
      { label: "Strategy", value: 90 },
      { label: "Negotiation", value: 88 },
    ],
    pose: { order: 0, y: 3.4 },
    fullName: "Trần Đình Thiên Tân",
    title: "Founder",
    hometown: "Nam Định",
    hobbies: "Lập trình, Thể Thao, Âm Nhạc",
    joinDate: "01/06/2026",
    motto: "Sống là phải để lại tiếng thơm cho đời",
    hometownImg: namdinhImg,
  },
  {
    slug: "binh",
    name: "Binh",
    role: "Lead Architect",
    klass: "Guardian",
    level: 42,
    img: binhImg,
    tint: "var(--color-sunset)",
    blurb: "Holds the whole system together. Designs for the long game.",
    skills: [
      { label: "System Design", value: 96 },
      { label: "Backend", value: 91 },
      { label: "Mentoring", value: 84 },
      { label: "Code Review", value: 88 },
    ],
    pose: { order: 1, y: 2 },
    fullName: "Nguyễn Thái Bình",
    title: "Kiến trúc sư trưởng",
    hometown: "Hải Dương",
    hobbies: "Đọc sách, Cờ vua, Cà phê",
    joinDate: "15/06/2026",
    motto: "Nền móng có vững thì nhà mới cao",
    hometownImg: haiduongImg,
  },
  {
    slug: "vi",
    name: "Vi",
    role: "Product Designer",
    klass: "Artisan",
    level: 38,
    img: viImg,
    tint: "var(--color-lotus)",
    blurb: "Turns rough ideas into pixel-perfect, joyful interfaces.",
    skills: [
      { label: "UI / UX", value: 95 },
      { label: "Illustration", value: 89 },
      { label: "Prototyping", value: 82 },
      { label: "Pixel Art", value: 93 },
    ],
    pose: { order: 2, y: 3.5 },
    fullName: "Lê Thảo Vi",
    title: "Thiết kế sản phẩm",
    hometown: "Kon Tum",
    hobbies: "Vẽ tranh, Nhiếp ảnh, Cây cảnh",
    joinDate: "20/06/2026",
    motto: "Đơn giản là đỉnh cao của sự tinh tế",
    hometownImg: kontumImg,
  },
  {
    slug: "giahuy",
    name: "Gia Huy",
    role: "Strategy Lead",
    klass: "Strategist",
    level: 40,
    img: giahuyImg,
    tint: "var(--color-jade)",
    blurb: "Sets the roadmap and reads three moves ahead of the market.",
    skills: [
      { label: "Roadmapping", value: 91 },
      { label: "Analytics", value: 85 },
      { label: "Negotiation", value: 88 },
      { label: "Vision", value: 94 },
    ],
    pose: { order: 3, y: 3.4 },
    fullName: "Phạm Gia Huy",
    title: "Trưởng nhóm Chiến lược",
    hometown: "Nha Trang",
    hobbies: "Bóng đá, Du lịch, Đầu tư",
    joinDate: "01/07/2026",
    motto: "Nhìn xa trông rộng, đi trước một bước",
    hometownImg: nhatrangImg,
  },
  {
    slug: "duong-truong",
    name: "Duong",
    role: "Full-Stack Engineer",
    klass: "Ranger",
    level: 36,
    img: duongtruongImg,
    tint: "var(--color-terracotta)",
    blurb: "Ships features end to end and hunts bugs across the stack.",
    skills: [
      { label: "Frontend", value: 92 },
      { label: "APIs", value: 86 },
      { label: "DevOps", value: 78 },
      { label: "Debugging", value: 90 },
    ],
    pose: { order: 4, y: 1.6 },
    fullName: "Trương Tùng Dương",
    title: "Kỹ sư Full-Stack",
    hometown: "Quảng Ngãi",
    hobbies: "Leo núi, Game, Phim ảnh",
    joinDate: "10/07/2026",
    motto: "Không gì là không thể, chỉ là chưa làm",
    hometownImg: quangngaiImg,
  },
  {
    slug: "duong",
    name: "Duong",
    role: "Full-Stack Engineer",
    klass: "Ranger",
    level: 36,
    img: duongImg,
    tint: "var(--color-jade)",
    blurb: "Ships features end to end and hunts bugs across the stack.",
    skills: [
      { label: "Frontend", value: 92 },
      { label: "APIs", value: 86 },
      { label: "DevOps", value: 78 },
      { label: "Debugging", value: 90 },
    ],
    pose: { order: 5, y: 1.6 },
    fullName: "Đỗ Hải Dương",
    title: "Kỹ sư Full-Stack",
    hometown: "Bình Dương",
    hobbies: "Chạy bộ, Nấu ăn, Podcast",
    joinDate: "15/07/2026",
    motto: "Mỗi ngày học thêm một điều mới",
    hometownImg: binhduongImg,
  },
  {
    slug: "danh",
    name: "Danh",
    role: "Strategy Lead",
    klass: "Strategist",
    level: 40,
    img: danhImg,
    tint: "var(--color-lantern)",
    blurb: "Sets the roadmap and reads three moves ahead of the market.",
    skills: [
      { label: "Roadmapping", value: 91 },
      { label: "Analytics", value: 85 },
      { label: "Negotiation", value: 88 },
      { label: "Vision", value: 94 },
    ],
    pose: { order: 6, y: 3.4 },
    fullName: "Võ Thành Danh",
    title: "Trưởng nhóm Chiến lược",
    hometown: "Nhơn Trạch",
    hobbies: "Cầu lông, Lịch sử, Trà đạo",
    joinDate: "01/08/2026",
    motto: "Kiên trì là chìa khóa của thành công",
    hometownImg: nhontrachImg,
  },
  {
    slug: "nguyenhuong",
    name: "Nguyen Huong",
    role: "Strategy Lead",
    klass: "Strategist",
    level: 40,
    img: nguyenhuongImg,
    tint: "var(--color-lotus)",
    blurb: "Sets the roadmap and reads three moves ahead of the market.",
    skills: [
      { label: "Roadmapping", value: 91 },
      { label: "Analytics", value: 85 },
      { label: "Negotiation", value: 88 },
      { label: "Vision", value: 94 },
    ],
    pose: { order: 7, y: 3.4 },
    fullName: "Nguyễn Thu Hương",
    title: "Trưởng nhóm Chiến lược",
    hometown: "Ninh Bình",
    hobbies: "Yoga, Viết lách, Làm bánh",
    joinDate: "12/08/2026",
    motto: "Tâm sáng thì việc gì cũng thành",
    hometownImg: ninhbinhImg,
  },
  {
    slug: "tanhung",
    name: "Tan Hung",
    role: "Strategy Lead",
    klass: "Strategist",
    level: 40,
    img: tanhungImg,
    tint: "var(--color-ember)",
    blurb: "Sets the roadmap and reads three moves ahead of the market.",
    skills: [
      { label: "Roadmapping", value: 91 },
      { label: "Analytics", value: 85 },
      { label: "Negotiation", value: 88 },
      { label: "Vision", value: 94 },
    ],
    pose: { order: 8, y: 3.4 },
    fullName: "Lý Tấn Hùng",
    title: "Trưởng nhóm Chiến lược",
    hometown: "Bình Định",
    hobbies: "Guitar, Phượt, Bóng rổ",
    joinDate: "01/09/2026",
    motto: "Làm hết sức, chơi hết mình",
    hometownImg: binhdinhImg,
  },
  {
    slug: "nam",
    name: "Nam",
    role: "Strategy Lead",
    klass: "Strategist",
    level: 40,
    img: namImg,
    tint: "var(--color-clay)",
    blurb: "Sets the roadmap and reads three moves ahead of the market.",
    skills: [
      { label: "Roadmapping", value: 91 },
      { label: "Analytics", value: 85 },
      { label: "Negotiation", value: 88 },
      { label: "Vision", value: 94 },
    ],
    pose: { order: 9, y: 3.4 },
    fullName: "Huỳnh Hoài Nam",
    title: "Trưởng nhóm Chiến lược",
    hometown: "Bến Tre",
    hobbies: "Câu cá, Bơi lội, Làm vườn",
    joinDate: "15/09/2026",
    motto: "Chậm mà chắc, chắc mà bền",
    hometownImg: bentreImg,
  },
  {
    slug: "quan",
    name: "Quan",
    role: "Strategy Lead",
    klass: "Strategist",
    level: 40,
    img: quanImg,
    tint: "var(--color-terracotta)",
    blurb: "Sets the roadmap and reads three moves ahead of the market.",
    skills: [
      { label: "Roadmapping", value: 91 },
      { label: "Analytics", value: 85 },
      { label: "Negotiation", value: 88 },
      { label: "Vision", value: 94 },
    ],
    pose: { order: 10, y: 3.4 },
    fullName: "Đặng Minh Quân",
    title: "Trưởng nhóm Chiến lược",
    hometown: "Sài Gòn",
    hobbies: "Cờ tướng, Sưu tầm, Thiền",
    joinDate: "01/10/2026",
    motto: "Tĩnh để chế ngự động",
    hometownImg: saigonImg,
  },
];
