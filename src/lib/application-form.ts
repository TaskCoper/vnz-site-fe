import type { L } from "@/lib/i18n";

/**
 * The `/ung-tuyen` application form — its fields, options and limits.
 *
 * SEPARATE FROM `contact-form.ts` ON PURPOSE. The two forms were briefly one, and
 * the seams showed immediately: an applicant was being asked for a "ngân sách dự
 * kiến" and had nowhere to put a CV link or a graduation year. Merging them again
 * means one of the two audiences reads a field that is visibly not for them, on
 * the page where they are deciding whether this company is worth their time.
 *
 * Same contract as the contact form, for the same reason: the markup, the server
 * action and the receiving endpoint must all agree on field names, so all three
 * read `FIELDS` from here and none of them types a name as a string literal.
 *
 * NO FILE UPLOAD, DELIBERATELY. There is no object storage in this repo and no
 * budget decision behind adding one, and a CV upload that silently drops the file
 * is worse than no upload at all. `cvUrl` takes a link instead — Google Drive,
 * OneDrive, Dropbox — which is already how most Vietnamese intern applications
 * arrive. Wire real uploads (Vercel Blob) when someone owns that decision; the
 * field name is where to start.
 *
 * All copy is Vietnamese and renders in `font-viet` / `font-pixel`. Never route it
 * through `font-display` / `font-ui` — no diacritics in those faces.
 */

/** Field names. The single source of truth for markup ⇄ action ⇄ payload. */
export const FIELDS = {
  /** Which language the applicant is using — see the note in `contact-form.ts`. */
  locale: "locale",
  role: "role",
  name: "name",
  email: "email",
  phone: "phone",
  school: "school",
  major: "major",
  gradYear: "gradYear",
  cvUrl: "cvUrl",
  portfolio: "portfolio",
  availability: "availability",
  startDate: "startDate",
  intro: "intro",
  source: "source",
  consent: "consent",
  /** Honeypot — see the note in `contact-form.ts`; identical mechanism. */
  honeypot: "website",
} as const;

/**
 * Graduation years, generated rather than typed so the list cannot go stale.
 * Runs from four years back (already graduated) to three ahead (current
 * students), which covers every intern applicant and no one else.
 *
 * NOT EVALUATED AT MODULE SCOPE AT BUILD TIME — it is a function, so a page
 * rendered in 2028 offers 2024–2031 rather than whatever was baked in when this
 * file was written. That is the whole reason it isn't a constant array.
 */
export function gradYears(now = new Date().getFullYear()) {
  const years: string[] = [];
  for (let y = now - 4; y <= now + 3; y++) years.push(String(y));
  return years;
}

/**
 * An option in a `<select>`. `value` is the stable identifier and is never
 * translated — only `label` changes with the language. Same contract as
 * `contact-form.ts`; the note there explains why.
 */
export type Option = { value: string; label: L };

/** How much time the applicant can commit — the question interns get asked. */
export const AVAILABILITY = [
  { value: "full-time", label: { vi: "Toàn thời gian", en: "Full time" } },
  {
    value: "part-time-4",
    label: { vi: "Bán thời gian — 4 buổi/tuần", en: "Part time — 4 days a week" },
  },
  {
    value: "part-time-3",
    label: { vi: "Bán thời gian — 3 buổi/tuần", en: "Part time — 3 days a week" },
  },
  { value: "thoa-thuan", label: { vi: "Có thể thỏa thuận", en: "Negotiable" } },
] as const satisfies readonly Option[];

/** When they can start. */
export const START_DATES = [
  { value: "ngay", label: { vi: "Có thể bắt đầu ngay", en: "Available now" } },
  {
    value: "trong-1-thang",
    label: { vi: "Trong vòng 1 tháng", en: "Within a month" },
  },
  {
    value: "trong-2-3-thang",
    label: { vi: "Trong 2 – 3 tháng", en: "In 2 – 3 months" },
  },
  {
    value: "sau-tot-nghiep",
    label: { vi: "Sau khi tốt nghiệp", en: "After I graduate" },
  },
] as const satisfies readonly Option[];

/** Attribution — optional. */
export const SOURCES = [
  { value: "website", label: { vi: "Website VNZ", en: "The VNZ website" } },
  {
    value: "truong",
    label: { vi: "Trường / khoa giới thiệu", en: "My university or faculty" },
  },
  { value: "mang-xa-hoi", label: { vi: "Mạng xã hội", en: "Social media" } },
  { value: "ban-be", label: { vi: "Bạn bè giới thiệu", en: "A friend" } },
  {
    value: "trang-tuyen-dung",
    label: { vi: "Trang tuyển dụng khác", en: "Another job board" },
  },
  { value: "khac", label: { vi: "Khác", en: "Somewhere else" } },
] as const satisfies readonly Option[];

/**
 * Server-side limits. The markup mirrors them in `maxLength`, but THE ACTION IS
 * THE ONE THAT COUNTS — an attacker posts straight to it and never renders the
 * form.
 */
export const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  school: 200,
  major: 160,
  cvUrl: 500,
  portfolio: 500,
  intro: 4000,
} as const;

/** The shortest self-introduction worth forwarding to a hiring manager. */
export const MIN_INTRO = 30;

/**
 * A CV link has to be a link. Accepts http(s) only — `javascript:` and `data:`
 * URLs are rejected outright rather than stored and later clicked by whoever
 * reviews the application.
 */
export function isHttpUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * The label for a value, in both languages — see the note on the same function
 * in `contact-form.ts`. The form renders the applicant's language; the payload
 * carries Vietnamese so the inbox reads consistently.
 */
export function labelOf(options: readonly Option[], value: string): L {
  return (
    options.find((o) => o.value === value)?.label ?? { vi: value, en: value }
  );
}
