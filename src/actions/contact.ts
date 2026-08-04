"use server";

import { ERRORS, ERRORS_N, RESULTS } from "@/lib/dictionary";
import { DEFAULT_LOCALE, isLocale, t, type Locale } from "@/lib/i18n";
import {
  BUDGETS,
  FIELDS,
  LIMITS,
  MIN_MESSAGE,
  SOURCES,
  TIMELINES,
  TOPICS,
  labelOf,
} from "@/lib/contact-form";

/**
 * The `/lien-he` form's submit handler.
 *
 * THERE IS NO MAIL SERVER IN THIS REPO, and inventing one would be worse than
 * saying so. What this does instead is validate the submission properly and then
 * hand it to ONE configurable outbound hop:
 *
 *   CONTACT_WEBHOOK_URL   an https endpoint that receives the JSON payload
 *   CONTACT_WEBHOOK_TOKEN optional; sent as `Authorization: Bearer <token>`
 *
 * That single variable is deliberately transport-agnostic — Formspree,
 * Web3Forms, a Slack or Discord incoming webhook, an n8n / Make flow, a Google
 * Apps Script, or your own API all accept a JSON POST. So the form is finished
 * and correct today, and going live is a matter of setting one env var rather
 * than a code change. Add it in the Vercel project settings (or a local
 * `.env.local`) and redeploy.
 *
 * WITH THE VARIABLE UNSET the action does NOT pretend to have sent anything. It
 * returns `unconfigured`, and the form tells the visitor plainly that the channel
 * is not open yet rather than showing a green tick over a message that went
 * nowhere. A contact form that silently discards enquiries is the single worst
 * failure mode a company site has; this one cannot get into that state.
 *
 * VALIDATION IS SERVER-SIDE BECAUSE IT HAS TO BE. The client mirrors these rules
 * for a decent typing experience, but an attacker posts straight here and never
 * renders the form, so every limit in `LIMITS` is enforced again below.
 *
 * ── LANGUAGE ────────────────────────────────────────────────────────────────
 * A server action cannot see the request URL, so it cannot infer which language
 * the visitor is reading. The form posts it as a hidden `locale` field and this
 * reads it back through `isLocale`, falling back to Vietnamese. A tampered value
 * therefore changes nothing except the language of the reply — no decision here
 * depends on it.
 *
 * THE PAYLOAD CARRIES VIETNAMESE LABELS whatever language was used, plus the
 * `locale` the enquiry came from. Whoever reads the inbox should see one
 * consistent wording rather than a mix of two, and still know which language to
 * answer in. The raw `value` travels alongside so nothing has to be parsed back.
 */

export type ContactState = {
  status: "idle" | "ok" | "error" | "unconfigured";
  /** Human-readable message for the visitor, already in their language. */
  message?: string;
  /** Per-field errors, keyed by field name. */
  errors?: Partial<Record<string, string>>;
  /**
   * Bumped on every submit. The form watches it to know a NEW result arrived —
   * two identical failures in a row are otherwise indistinguishable to the
   * effect that moves focus to the error summary.
   */
  attempt?: number;
};

export const INITIAL_STATE: ContactState = { status: "idle", attempt: 0 };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(data: FormData, key: string) {
  const v = data.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** Reject anything not on the list; empty stays empty. */
function pick(options: readonly { value: string }[], value: string) {
  return options.some((o) => o.value === value) ? value : "";
}

export async function submitContact(
  prev: ContactState,
  data: FormData,
): Promise<ContactState> {
  const attempt = (prev.attempt ?? 0) + 1;

  const rawLocale = str(data, FIELDS.locale);
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  // ── Honeypot ── see the note in `contact-form.ts`. Report success so a bot
  // learns nothing, but forward nothing.
  if (str(data, FIELDS.honeypot)) {
    return { status: "ok", message: t(RESULTS.contactOk, locale), attempt };
  }

  const name = str(data, FIELDS.name);
  const email = str(data, FIELDS.email);
  const phone = str(data, FIELDS.phone);
  const company = str(data, FIELDS.company);
  const message = str(data, FIELDS.message);
  const topic = pick(TOPICS, str(data, FIELDS.topic));
  const budget = pick(BUDGETS, str(data, FIELDS.budget));
  const timeline = pick(TIMELINES, str(data, FIELDS.timeline));
  const source = pick(SOURCES, str(data, FIELDS.source));
  const consent = str(data, FIELDS.consent) !== "";

  const errors: Record<string, string> = {};

  if (!name) errors[FIELDS.name] = t(ERRORS.nameRequired, locale);
  else if (name.length > LIMITS.name)
    errors[FIELDS.name] = t(ERRORS.nameTooLong, locale);

  if (!email) errors[FIELDS.email] = t(ERRORS.emailRequired, locale);
  else if (email.length > LIMITS.email || !EMAIL.test(email))
    errors[FIELDS.email] = t(ERRORS.emailInvalid, locale);

  if (phone.length > LIMITS.phone)
    errors[FIELDS.phone] = t(ERRORS.phoneTooLong, locale);
  if (company.length > LIMITS.company)
    errors[FIELDS.company] = t(ERRORS.companyTooLong, locale);

  if (!message) errors[FIELDS.message] = t(ERRORS.messageRequired, locale);
  else if (message.length < MIN_MESSAGE)
    errors[FIELDS.message] = t(ERRORS_N.messageTooShort, locale)(MIN_MESSAGE);
  else if (message.length > LIMITS.message)
    errors[FIELDS.message] = t(ERRORS.messageTooLong, locale);

  if (!topic) errors[FIELDS.topic] = t(ERRORS.topicRequired, locale);
  if (!consent) errors[FIELDS.consent] = t(ERRORS.consentRequired, locale);

  if (Object.keys(errors).length) {
    return {
      status: "error",
      message: t(RESULTS.checkFields, locale),
      errors,
      attempt,
    };
  }

  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) {
    return {
      status: "unconfigured",
      message: t(RESULTS.contactUnconfigured, locale),
      attempt,
    };
  }

  // Vietnamese labels travel WITH the raw values — see the LANGUAGE note above.
  const payload = {
    source: "vnzdna.com/lien-he",
    submittedAt: new Date().toISOString(),
    locale,
    topic: { value: topic, label: labelOf(TOPICS, topic).vi },
    name,
    email,
    phone: phone || null,
    company: company || null,
    budget: budget ? { value: budget, label: labelOf(BUDGETS, budget).vi } : null,
    timeline: timeline
      ? { value: timeline, label: labelOf(TIMELINES, timeline).vi }
      : null,
    heardFrom: source
      ? { value: source, label: labelOf(SOURCES, source).vi }
      : null,
    message,
  };

  try {
    // A hung endpoint must not hold the visitor's browser open indefinitely —
    // they would sit on a spinner with no idea whether to resend.
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(process.env.CONTACT_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (!res.ok) {
      // Log the status for the operator; never leak the endpoint or its response
      // body to the browser.
      console.error(`[lien-he] webhook responded ${res.status}`);
      return {
        status: "error",
        message: t(RESULTS.contactFailed, locale),
        attempt,
      };
    }
  } catch (err) {
    console.error("[lien-he] webhook request failed", err);
    return {
      status: "error",
      message: t(RESULTS.contactFailed, locale),
      attempt,
    };
  }

  return { status: "ok", message: t(RESULTS.contactOk, locale), attempt };
}
