"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  INITIAL_STATE,
  submitContact,
  type ContactState,
} from "@/actions/contact";
import {
  BUDGETS,
  FIELDS,
  LIMITS,
  SOURCES,
  TIMELINES,
  TOPICS,
} from "@/lib/contact-form";
import { CONTACT_FORM_UI, FORM } from "@/lib/dictionary";
import { t, type Locale } from "@/lib/i18n";

/**
 * The `/lien-he` enquiry form — the left column of the contact page.
 *
 * THE ONLY CLIENT COMPONENT ON THE PAGE, and the only one on the site outside
 * the nav, the cursor shell and the member viewer. It needs state for exactly
 * one reason: the submit result has to appear without a page reload. Everything
 * else — required fields, email format, length caps — is native HTML validation,
 * so the form is still usable with JS disabled or still loading.
 *
 * IT DEGRADES, IT DOESN'T BREAK. `useActionState` posts to a server action, and
 * React wires a plain `<form action={...}>` as the no-JS fallback, so a
 * submission before hydration still reaches the server and re-renders with the
 * result. That is why validation lives in the action rather than in an onSubmit
 * handler — see the long note in `src/app/lien-he/actions.ts`.
 *
 * FIELD NAMES COME FROM `FIELDS`, never typed as string literals: the markup,
 * the action and the outgoing payload have to agree, and a field renamed on one
 * side only arrives empty on the other — a failure nobody notices until a real
 * enquiry is lost.
 *
 * ERRORS ARE ANNOUNCED, NOT JUST COLOURED. The summary banner is a live region
 * and takes focus on each new result, and every failing control gets
 * `aria-invalid` plus `aria-describedby` pointing at its own message. A red
 * border alone is invisible to a screen reader and to anyone who can't
 * distinguish it.
 *
 * `fallbackEmail` is `CONTACT.email` when one exists. It is passed in rather
 * than imported so this component never has to reason about whether the address
 * is real — the page decides, this renders it only if given.
 */

/** Shared label styling — pixel face, small caps, ink. */
const LABEL = "block font-pixel text-sm uppercase tracking-[0.18em] text-ink-soft";

/** Marks a field the action will reject when empty. */
function Required() {
  return (
    <span aria-hidden className="ml-1 text-ember">
      *
    </span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 font-viet text-xs font-light text-lantern">
      {message}
    </p>
  );
}

/**
 * The submit button, split out so it can read `useFormStatus` — that hook only
 * reports the status of the form it is rendered INSIDE, so calling it in the
 * parent would always return `pending: false`.
 */
function Submit({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-pixel font-pixel inline-flex items-center gap-2 px-8 py-3.5 text-lg uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-70"
    >
      {t(pending ? FORM.sending : CONTACT_FORM_UI.submit, locale)}
      <span aria-hidden>▸</span>
    </button>
  );
}

export function ContactForm({
  locale,
  fallbackEmail,
}: {
  locale: Locale;
  fallbackEmail?: string;
}) {
  const [state, formAction] = useActionState<ContactState, FormData>(
    submitContact,
    INITIAL_STATE,
  );

  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const errId = (name: string) => `${uid}-${name}-error`;

  const form = useRef<HTMLFormElement>(null);
  const banner = useRef<HTMLDivElement>(null);

  // Reset the fields once a submission actually went out — but ONLY then. A
  // reset on failure would throw away everything the visitor typed and hand them
  // an empty form plus an error, which is how a long enquiry gets abandoned.
  useEffect(() => {
    if (state.status === "ok") form.current?.reset();
  }, [state.status, state.attempt]);

  // Move focus to the result banner on every new result. Keyed on `attempt`
  // rather than `status`, so two identical failures in a row still announce —
  // `status` alone would not change and the effect would not re-run.
  useEffect(() => {
    if (state.status !== "idle") banner.current?.focus();
  }, [state.status, state.attempt]);

  const err = state.errors ?? {};
  const describedBy = (name: string) => (err[name] ? errId(name) : undefined);
  const invalid = (name: string) => (err[name] ? true : undefined);

  return (
    <form ref={form} action={formAction} noValidate={false} className="w-full">
      {/* ── Result banner ──
          `tabIndex={-1}` so the effect above can focus it; `role="status"` +
          `aria-live` so it is announced even when focus lands elsewhere. It is
          rendered (not hidden) only when there is something to say. */}
      {state.status !== "idle" && state.message ? (
        <div
          ref={banner}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className={`mb-8 border-l-[3px] p-4 font-viet text-sm font-light leading-relaxed outline-none sm:text-base ${
            state.status === "ok"
              ? "border-jade bg-jade/10 text-ink"
              : "border-lantern bg-lantern/10 text-ink"
          }`}
        >
          <p className="font-pixel text-base uppercase tracking-[0.15em]">
            {t(state.status === "ok" ? FORM.sent : FORM.notSent, locale)}
          </p>
          <p className="mt-1.5">{state.message}</p>
          {/* On a failure — including "channel not connected" — offer the direct
              address if one exists. Without it there is nothing honest to add,
              so nothing is added. */}
          {state.status !== "ok" && fallbackEmail ? (
            <p className="mt-1.5">
              {t(FORM.orEmail, locale)}{" "}
              <a
                href={`mailto:${fallbackEmail}`}
                className="underline underline-offset-2 transition-colors hover:text-ember"
              >
                {fallbackEmail}
              </a>
              .
            </p>
          ) : null}
        </div>
      ) : null}

      {/* WHICH LANGUAGE THIS WAS FILLED IN. A server action cannot see the
          request URL, so the error messages it returns would come back in
          Vietnamese to an English reader without this. See `FIELDS.locale`. */}
      <input type="hidden" name={FIELDS.locale} value={locale} />

      {/* ── Honeypot ── hidden from sight AND from assistive tech, never
          autofilled, never tabbable. See the note in `contact-form.ts`. */}
      <div aria-hidden className="hidden">
        <label htmlFor={id(FIELDS.honeypot)}>Website</label>
        <input
          id={id(FIELDS.honeypot)}
          type="text"
          name={FIELDS.honeypot}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Topic — full width, and FIRST. It frames everything under it: someone
            here to apply for a job should not have to read past a budget field
            to work out the form is not for them. */}
        <div className="sm:col-span-2">
          <label htmlFor={id(FIELDS.topic)} className={LABEL}>
            {t(CONTACT_FORM_UI.topic, locale)}
            <Required />
          </label>
          <select
            id={id(FIELDS.topic)}
            name={FIELDS.topic}
            required
            defaultValue=""
            aria-invalid={invalid(FIELDS.topic)}
            aria-describedby={describedBy(FIELDS.topic)}
            className="pixel-input mt-2"
          >
            <option value="" disabled>
              {t(CONTACT_FORM_UI.topicPlaceholder, locale)}
            </option>
            {TOPICS.map((o) => (
              <option key={o.value} value={o.value}>
                {t(o.label, locale)}
              </option>
            ))}
          </select>
          <FieldError id={errId(FIELDS.topic)} message={err[FIELDS.topic]} />
        </div>

        <div>
          <label htmlFor={id(FIELDS.name)} className={LABEL}>
            {t(CONTACT_FORM_UI.name, locale)}
            <Required />
          </label>
          <input
            id={id(FIELDS.name)}
            name={FIELDS.name}
            type="text"
            required
            maxLength={LIMITS.name}
            autoComplete="name"
            placeholder={t(CONTACT_FORM_UI.namePlaceholder, locale)}
            aria-invalid={invalid(FIELDS.name)}
            aria-describedby={describedBy(FIELDS.name)}
            className="pixel-input mt-2"
          />
          <FieldError id={errId(FIELDS.name)} message={err[FIELDS.name]} />
        </div>

        <div>
          <label htmlFor={id(FIELDS.email)} className={LABEL}>
            {t(CONTACT_FORM_UI.email, locale)}
            <Required />
          </label>
          <input
            id={id(FIELDS.email)}
            name={FIELDS.email}
            type="email"
            required
            maxLength={LIMITS.email}
            autoComplete="email"
            placeholder={t(CONTACT_FORM_UI.emailPlaceholder, locale)}
            aria-invalid={invalid(FIELDS.email)}
            aria-describedby={describedBy(FIELDS.email)}
            className="pixel-input mt-2"
          />
          <FieldError id={errId(FIELDS.email)} message={err[FIELDS.email]} />
        </div>

        <div>
          {/* Phone is OPTIONAL. Requiring one on a first contact costs more
              enquiries than it gains calls — anyone who wants to be phoned will
              fill it in. */}
          <label htmlFor={id(FIELDS.phone)} className={LABEL}>
            {t(CONTACT_FORM_UI.phone, locale)}
          </label>
          <input
            id={id(FIELDS.phone)}
            name={FIELDS.phone}
            type="tel"
            maxLength={LIMITS.phone}
            autoComplete="tel"
            inputMode="tel"
            placeholder={t(CONTACT_FORM_UI.phonePlaceholder, locale)}
            aria-invalid={invalid(FIELDS.phone)}
            aria-describedby={describedBy(FIELDS.phone)}
            className="pixel-input mt-2"
          />
          <FieldError id={errId(FIELDS.phone)} message={err[FIELDS.phone]} />
        </div>

        <div>
          <label htmlFor={id(FIELDS.company)} className={LABEL}>
            {t(CONTACT_FORM_UI.company, locale)}
          </label>
          <input
            id={id(FIELDS.company)}
            name={FIELDS.company}
            type="text"
            maxLength={LIMITS.company}
            autoComplete="organization"
            placeholder={t(CONTACT_FORM_UI.companyPlaceholder, locale)}
            aria-invalid={invalid(FIELDS.company)}
            aria-describedby={describedBy(FIELDS.company)}
            className="pixel-input mt-2"
          />
          <FieldError id={errId(FIELDS.company)} message={err[FIELDS.company]} />
        </div>

        <div>
          <label htmlFor={id(FIELDS.budget)} className={LABEL}>
            {t(CONTACT_FORM_UI.budget, locale)}
          </label>
          <select
            id={id(FIELDS.budget)}
            name={FIELDS.budget}
            defaultValue=""
            className="pixel-input mt-2"
          >
            <option value="">{t(FORM.optional, locale)}</option>
            {BUDGETS.map((o) => (
              <option key={o.value} value={o.value}>
                {t(o.label, locale)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={id(FIELDS.timeline)} className={LABEL}>
            {t(CONTACT_FORM_UI.timeline, locale)}
          </label>
          <select
            id={id(FIELDS.timeline)}
            name={FIELDS.timeline}
            defaultValue=""
            className="pixel-input mt-2"
          >
            <option value="">{t(FORM.optional, locale)}</option>
            {TIMELINES.map((o) => (
              <option key={o.value} value={o.value}>
                {t(o.label, locale)}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={id(FIELDS.message)} className={LABEL}>
            {t(CONTACT_FORM_UI.message, locale)}
            <Required />
          </label>
          <textarea
            id={id(FIELDS.message)}
            name={FIELDS.message}
            required
            rows={7}
            maxLength={LIMITS.message}
            placeholder={t(CONTACT_FORM_UI.messagePlaceholder, locale)}
            aria-invalid={invalid(FIELDS.message)}
            aria-describedby={describedBy(FIELDS.message)}
            className="pixel-input mt-2"
          />
          <FieldError id={errId(FIELDS.message)} message={err[FIELDS.message]} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={id(FIELDS.source)} className={LABEL}>
            {t(CONTACT_FORM_UI.source, locale)}
          </label>
          <select
            id={id(FIELDS.source)}
            name={FIELDS.source}
            defaultValue=""
            className="pixel-input mt-2"
          >
            <option value="">{t(FORM.optional, locale)}</option>
            {SOURCES.map((o) => (
              <option key={o.value} value={o.value}>
                {t(o.label, locale)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Consent ──
          Unticked by default and required, which is the only version of this
          that means anything. The scope is narrow on purpose: permission to
          REPLY, not a marketing opt-in — there is no mailing list to join, and
          asking for one here would be collecting a permission nothing uses. */}
      <div className="mt-7">
        <div className="flex items-start gap-3">
          <input
            id={id(FIELDS.consent)}
            name={FIELDS.consent}
            type="checkbox"
            value="yes"
            required
            aria-invalid={invalid(FIELDS.consent)}
            aria-describedby={describedBy(FIELDS.consent)}
            className="mt-1 size-4 shrink-0 rounded-none border border-ink/30 accent-[var(--color-ember)]"
          />
          <label
            htmlFor={id(FIELDS.consent)}
            className="font-viet text-sm font-light leading-relaxed text-ink-soft"
          >
            {t(CONTACT_FORM_UI.consent, locale)}
            <Required />
          </label>
        </div>
        <FieldError id={errId(FIELDS.consent)} message={err[FIELDS.consent]} />
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Submit locale={locale} />
        <p className="font-viet text-xs font-light leading-relaxed text-ink-soft">
          {t(FORM.requiredNoteLead, locale)}{" "}
          <span className="text-ember">*</span> {t(FORM.requiredNote, locale)}
        </p>
      </div>
    </form>
  );
}
