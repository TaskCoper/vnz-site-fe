/**
 * Site-wide identity + contact details, in one place.
 *
 * WHY THIS FILE EXISTS. The footer needs real contact affordances, and there were
 * none anywhere in the repo — only a placeholder comment in `careers.ts`. Rather
 * than invent an email, a phone number and an address (which would ship as facts
 * and be wrong), every contact field here starts EMPTY and the footer renders each
 * block only when its field is filled. So the footer is complete and correct today
 * and grows the moment these strings are set — nothing to remember, nothing fake.
 *
 * Fill in what exists, leave the rest as "".
 */

export const SITE = {
  name: "VNZ",
  legalName: "Vietnam Z-DNA Technology",
  tagline: "Vietnamese Minds · Global Solutions",
  /** One-sentence positioning shown under the logo. */
  positioning:
    "Một thế hệ người Việt làm chủ công nghệ — tạo ra sản phẩm của riêng mình và ghi dấu ấn trên bản đồ công nghệ thế giới.",
} as const;

/** Every field optional on purpose — see the note above. */
export type Contact = {
  /** General enquiries, e.g. "hello@vnzdna.com". */
  email: string;
  /** Recruitment inbox, e.g. "tuyendung@vnzdna.com". */
  recruitEmail: string;
  /** Display phone, e.g. "+84 28 1234 5678". */
  phone: string;
  /** Office address, one line. */
  address: string;
};

export const CONTACT: Contact = {
  email: "",
  recruitEmail: "",
  phone: "",
  address: "",
};

export type SocialLink = { label: string; href: string };

/** Add entries as accounts go live; the footer hides the column when empty. */
export const SOCIALS: SocialLink[] = [];

/**
 * Footer navigation, grouped into columns. In-page `#` targets must resolve to a
 * section mounted on the homepage; anything that has moved to its own route uses
 * a real path. Keep in step with `NAV` in `src/components/site-nav.tsx`.
 */
export const FOOTER_NAV: { heading: string; links: SocialLink[] }[] = [
  {
    heading: "Câu chuyện",
    links: [
      { label: "Trang chủ", href: "/" },
      { label: "Câu chuyện VNZ", href: "/#story" },
      { label: "Dấu ấn VNZ", href: "/#products" },
    ],
  },
  {
    heading: "Công ty",
    links: [
      { label: "Đội ngũ", href: "/doi-ngu" },
      { label: "Tuyển dụng", href: "/tuyen-dung" },
      { label: "Đối tác", href: "/#partners" },
    ],
  },
];
