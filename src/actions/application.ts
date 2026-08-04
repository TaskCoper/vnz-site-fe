"use server";

import { ERRORS, ERRORS_N, RESULTS } from "@/lib/dictionary";
import { DEFAULT_LOCALE, isLocale, t, type Locale } from "@/lib/i18n";
import {
  AVAILABILITY,
  FIELDS,
  LIMITS,
  MIN_INTRO,
  SOURCES,
  START_DATES,
  gradYears,
  isHttpUrl,
  labelOf,
} from "@/lib/application-form";
import { roleBySlug } from "@/lib/careers";

/**
 * The `/ung-tuyen` submit handler.
 *
 * SAME TRANSPORT CONTRACT AS THE CONTACT FORM, one env var, no mail server:
 *
 *   CAREERS_WEBHOOK_URL    an https endpoint that receives the JSON payload
 *   CAREERS_WEBHOOK_TOKEN  optional; sent as `Authorization: Bearer <token>`
 *
 * It falls back to `CONTACT_WEBHOOK_URL` / `CONTACT_WEBHOOK_TOKEN` when the
 * careers-specific pair is unset, so a site with one inbox needs one variable and
 * a site that wants applications routed somewhere else (an ATS, a different Slack
 * channel, HR's own flow) sets the second pair without touching code.
 *
 * WITH NEITHER SET the action does NOT pretend to have sent anything — it returns
 * `unconfigured` and the form says so. An application silently discarded is worse
 * than a contact enquiry silently discarded: the applicant waits, assumes they
 * were rejected, and never writes again. This one cannot get into that state.
 *
 * VALIDATION IS SERVER-SIDE BECAUSE IT HAS TO BE. The client mirrors these rules,
 * but an attacker posts straight here.
 *
 * The role slug is resolved against `ROLES` rather than trusted, and forwarded
 * with its real job title attached so the payload names the position rather than
 * a slug the reader has to decode.
 */

export type ApplicationState = {
  status: "idle" | "ok" | "error" | "unconfigured";
  message?: string;
  errors?: Partial<Record<string, string>>;
  /** Bumped on every submit so the form can tell a NEW result from a repeat. */
  attempt?: number;
};

export const INITIAL_STATE: ApplicationState = { status: "idle", attempt: 0 };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(data: FormData, key: string) {
  const v = data.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** Reject anything not on the list; empty stays empty. */
function pick(options: readonly { value: string }[], value: string) {
  return options.some((o) => o.value === value) ? value : "";
}

export async function submitApplication(
  prev: ApplicationState,
  data: FormData,
): Promise<ApplicationState> {
  const attempt = (prev.attempt ?? 0) + 1;

  // A server action cannot see the request URL, so the form posts the language
  // as a hidden field. `isLocale` guards it; a tampered value changes nothing
  // but the language of the reply. See `FIELDS.locale`.
  const rawLocale = str(data, FIELDS.locale);
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  // Honeypot — report success so a bot learns nothing, forward nothing.
  if (str(data, FIELDS.honeypot)) {
    return { status: "ok", message: t(RESULTS.applyOk, locale), attempt };
  }

  const roleSlug = str(data, FIELDS.role);
  const role = roleBySlug(roleSlug);

  const name = str(data, FIELDS.name);
  const email = str(data, FIELDS.email);
  const phone = str(data, FIELDS.phone);
  const school = str(data, FIELDS.school);
  const major = str(data, FIELDS.major);
  const gradYear = str(data, FIELDS.gradYear);
  const cvUrl = str(data, FIELDS.cvUrl);
  const portfolio = str(data, FIELDS.portfolio);
  const intro = str(data, FIELDS.intro);
  const availability = pick(AVAILABILITY, str(data, FIELDS.availability));
  const startDate = pick(START_DATES, str(data, FIELDS.startDate));
  const source = pick(SOURCES, str(data, FIELDS.source));
  const consent = str(data, FIELDS.consent) !== "";

  const errors: Record<string, string> = {};

  if (!role) errors[FIELDS.role] = t(ERRORS.roleRequired, locale);

  if (!name) errors[FIELDS.name] = t(ERRORS.nameRequired, locale);
  else if (name.length > LIMITS.name)
    errors[FIELDS.name] = t(ERRORS.nameTooLong, locale);

  if (!email) errors[FIELDS.email] = t(ERRORS.emailRequiredApply, locale);
  else if (email.length > LIMITS.email || !EMAIL.test(email))
    errors[FIELDS.email] = t(ERRORS.emailInvalid, locale);

  // Phone IS required here, unlike on the contact form: an interview gets
  // scheduled by phone, and an applicant expects to be called.
  if (!phone) errors[FIELDS.phone] = t(ERRORS.phoneRequired, locale);
  else if (phone.length > LIMITS.phone)
    errors[FIELDS.phone] = t(ERRORS.phoneTooLong, locale);

  if (school.length > LIMITS.school) errors[FIELDS.school] = t(ERRORS.tooLong, locale);
  if (major.length > LIMITS.major) errors[FIELDS.major] = t(ERRORS.tooLong, locale);
  if (gradYear && !gradYears().includes(gradYear))
    errors[FIELDS.gradYear] = t(ERRORS.gradYearInvalid, locale);

  if (!cvUrl) errors[FIELDS.cvUrl] = t(ERRORS.cvRequired, locale);
  else if (cvUrl.length > LIMITS.cvUrl)
    errors[FIELDS.cvUrl] = t(ERRORS.linkTooLong, locale);
  else if (!isHttpUrl(cvUrl))
    errors[FIELDS.cvUrl] = t(ERRORS.linkInvalid, locale);

  if (portfolio) {
    if (portfolio.length > LIMITS.portfolio)
      errors[FIELDS.portfolio] = t(ERRORS.linkTooLong, locale);
    else if (!isHttpUrl(portfolio))
      errors[FIELDS.portfolio] = t(ERRORS.linkInvalid, locale);
  }

  if (!intro) errors[FIELDS.intro] = t(ERRORS.introRequired, locale);
  else if (intro.length < MIN_INTRO)
    errors[FIELDS.intro] = t(ERRORS_N.introTooShort, locale)(MIN_INTRO);
  else if (intro.length > LIMITS.intro)
    errors[FIELDS.intro] = t(ERRORS.introTooLong, locale);

  if (!consent)
    errors[FIELDS.consent] = t(ERRORS.consentRequiredApply, locale);

  if (Object.keys(errors).length) {
    return {
      status: "error",
      message: t(RESULTS.checkFields, locale),
      errors,
      attempt,
    };
  }

  const endpoint =
    process.env.CAREERS_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) {
    return {
      status: "unconfigured",
      message: t(RESULTS.applyUnconfigured, locale),
      attempt,
    };
  }

  const token =
    process.env.CAREERS_WEBHOOK_TOKEN || process.env.CONTACT_WEBHOOK_TOKEN;

  // `role` is non-null here — the guard above would have returned otherwise —
  // but TypeScript can't see that through the errors object, hence the check.
  const payload = {
    kind: "application",
    source: "vnzdna.com/ung-tuyen",
    submittedAt: new Date().toISOString(),
    locale,
    // `.vi` for the same reason as every other label below: whoever reads the
    // inbox should see one consistent wording whichever language the applicant
    // used, and `locale` above already records which that was. Sending the whole
    // `{ vi, en }` object instead would make every consumer of this payload —
    // an ATS field mapping, a Slack template — have to reach into it.
    role: role
      ? { slug: role.slug, title: role.role.vi, department: role.department.vi }
      : null,
    name,
    email,
    phone,
    school: school || null,
    major: major || null,
    gradYear: gradYear || null,
    cvUrl,
    portfolio: portfolio || null,
    availability: availability
      ? { value: availability, label: labelOf(AVAILABILITY, availability).vi }
      : null,
    startDate: startDate
      ? { value: startDate, label: labelOf(START_DATES, startDate).vi }
      : null,
    heardFrom: source ? { value: source, label: labelOf(SOURCES, source).vi } : null,
    intro,
  };

  try {
    // A hung endpoint must not hold the applicant's browser open indefinitely.
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (!res.ok) {
      // Log the status for the operator; never leak the endpoint or its response
      // body to the browser.
      console.error(`[ung-tuyen] webhook responded ${res.status}`);
      return {
        status: "error",
        message: t(RESULTS.applyFailed, locale),
        attempt,
      };
    }
  } catch (err) {
    console.error("[ung-tuyen] webhook request failed", err);
    return {
      status: "error",
      message: t(RESULTS.applyFailed, locale),
      attempt,
    };
  }

  return { status: "ok", message: t(RESULTS.applyOk, locale), attempt };
}


