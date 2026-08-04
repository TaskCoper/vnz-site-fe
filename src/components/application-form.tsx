"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  INITIAL_STATE,
  submitApplication,
  type ApplicationState,
} from "@/actions/application";
import {
  AVAILABILITY,
  FIELDS,
  LIMITS,
  SOURCES,
  START_DATES,
  gradYears,
} from "@/lib/application-form";
import { ROLES } from "@/lib/careers";
import { APPLY_UI, FORM } from "@/lib/dictionary";
import { t, type Locale } from "@/lib/i18n";

/**
 * The `/ung-tuyen` application form.
 *
 * A SEPARATE FORM FROM `contact-form.tsx`, not a variant of it — the reasoning is
 * in `src/lib/application-form.ts`. The two share an approach (server action,
 * native validation, honeypot, focused result banner) and nothing else, because
 * the field sets barely overlap.
 *
 * IT DEGRADES, IT DOESN'T BREAK. `useActionState` posts to a server action and
 * React wires the plain `<form action>` as the no-JS fallback, so a submission
 * before hydration still reaches the server and re-renders with the result. That
 * is why validation lives in the action rather than an onSubmit handler.
 *
 * FIELD NAMES COME FROM `FIELDS`, never typed as literals: the markup, the action
 * and the outgoing payload have to agree, and a field renamed on one side only
 * arrives empty on the other — with an application, that means a CV link quietly
 * going missing.
 *
 * `presetRole` is a slug the page resolved against `ROLES`; it preselects the
 * position. The select stays editable — someone who opened the wrong ad should be
 * able to fix it here instead of going back.
 *
 * `gradYears()` IS CALLED IN RENDER, not hoisted to a module constant, so the
 * range follows the current year instead of the year this was built.
 */

const LABEL = "block font-pixel text-sm uppercase tracking-[0.18em] text-ink-soft";

function Required() {
  return (
    <span aria-hidden className="ml-1 text-ember">
      *
    </span>
  );
}

function Hint({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 font-viet text-xs font-light text-ink-soft">
      {children}
    </p>
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
 * Split out so it can read `useFormStatus` — that hook reports only on the form
 * it is rendered INSIDE, so calling it in the parent always returns false.
 */
function Submit({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-pixel font-pixel inline-flex items-center gap-2 px-8 py-3.5 text-lg uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-70"
    >
      {t(pending ? FORM.sending : APPLY_UI.submit, locale)}
      <span aria-hidden>▸</span>
    </button>
  );
}

export function ApplicationForm({
  locale,
  presetRole,
}: {
  locale: Locale;
  presetRole?: string;
}) {
  const [state, formAction] = useActionState<ApplicationState, FormData>(
    submitApplication,
    INITIAL_STATE,
  );

  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const errId = (name: string) => `${uid}-${name}-error`;
  const hintId = (name: string) => `${uid}-${name}-hint`;

  const form = useRef<HTMLFormElement>(null);
  const banner = useRef<HTMLDivElement>(null);

  const years = gradYears();

  // Clear the form only once a submission actually went out. Resetting on
  // failure would throw away a long self-introduction and hand the applicant an
  // empty form plus an error — which is where an application gets abandoned.
  useEffect(() => {
    if (state.status === "ok") form.current?.reset();
  }, [state.status, state.attempt]);

  // Announce every new result. Keyed on `attempt` as well as `status`, so two
  // identical failures in a row still move focus.
  useEffect(() => {
    if (state.status !== "idle") banner.current?.focus();
  }, [state.status, state.attempt]);

  const err = state.errors ?? {};
  const describedBy = (name: string, hint?: boolean) =>
    [err[name] ? errId(name) : null, hint ? hintId(name) : null]
      .filter(Boolean)
      .join(" ") || undefined;
  const invalid = (name: string) => (err[name] ? true : undefined);

  return (
    <form ref={form} action={formAction} className="w-full">
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
            {t(state.status === "ok" ? APPLY_UI.received : FORM.notSent, locale)}
          </p>
          <p className="mt-1.5">{state.message}</p>
        </div>
      ) : null}

      {/* WHICH LANGUAGE THIS WAS FILLED IN — see `FIELDS.locale`. Without it
          an English applicant gets Vietnamese validation errors. */}
      <input type="hidden" name={FIELDS.locale} value={locale} />

      {/* Honeypot — hidden from sight and from assistive tech, never tabbable. */}
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

      {/* ── Vị trí ── */}
      <fieldset className="border-0 p-0">
        <legend className="font-pixel text-sm uppercase tracking-[0.3em] text-clay">
          {t(APPLY_UI.groupRole, locale)}
        </legend>
        <div className="mt-4">
          <label htmlFor={id(FIELDS.role)} className={LABEL}>
            {t(APPLY_UI.role, locale)}
            <Required />
          </label>
          {/* Editable even when preselected — someone who opened the wrong ad
              should fix it here, not by going back. */}
          <select
            id={id(FIELDS.role)}
            name={FIELDS.role}
            required
            defaultValue={presetRole ?? ""}
            aria-invalid={invalid(FIELDS.role)}
            aria-describedby={describedBy(FIELDS.role)}
            className="pixel-input mt-2"
          >
            <option value="" disabled>
              {t(APPLY_UI.rolePlaceholder, locale)}
            </option>
            {ROLES.map((r) => (
              <option key={r.slug} value={r.slug}>
                {t(r.role, locale)} · {t(r.department, locale)}
              </option>
            ))}
          </select>
          <FieldError id={errId(FIELDS.role)} message={err[FIELDS.role]} />
        </div>
      </fieldset>

      {/* ── Thông tin cá nhân ── */}
      <fieldset className="mt-10 border-0 p-0">
        <legend className="font-pixel text-sm uppercase tracking-[0.3em] text-clay">
          {t(APPLY_UI.groupPersonal, locale)}
        </legend>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={id(FIELDS.name)} className={LABEL}>
              {t(APPLY_UI.name, locale)}
              <Required />
            </label>
            <input
              id={id(FIELDS.name)}
              name={FIELDS.name}
              type="text"
              required
              maxLength={LIMITS.name}
              autoComplete="name"
              placeholder={t(APPLY_UI.namePlaceholder, locale)}
              aria-invalid={invalid(FIELDS.name)}
              aria-describedby={describedBy(FIELDS.name)}
              className="pixel-input mt-2"
            />
            <FieldError id={errId(FIELDS.name)} message={err[FIELDS.name]} />
          </div>

          <div>
            <label htmlFor={id(FIELDS.email)} className={LABEL}>
              {t(APPLY_UI.email, locale)}
              <Required />
            </label>
            <input
              id={id(FIELDS.email)}
              name={FIELDS.email}
              type="email"
              required
              maxLength={LIMITS.email}
              autoComplete="email"
              placeholder={t(APPLY_UI.emailPlaceholder, locale)}
              aria-invalid={invalid(FIELDS.email)}
              aria-describedby={describedBy(FIELDS.email)}
              className="pixel-input mt-2"
            />
            <FieldError id={errId(FIELDS.email)} message={err[FIELDS.email]} />
          </div>

          <div>
            {/* Required here, unlike on the contact form: interviews get
                scheduled by phone and applicants expect to be called. */}
            <label htmlFor={id(FIELDS.phone)} className={LABEL}>
              {t(APPLY_UI.phone, locale)}
              <Required />
            </label>
            <input
              id={id(FIELDS.phone)}
              name={FIELDS.phone}
              type="tel"
              required
              maxLength={LIMITS.phone}
              autoComplete="tel"
              inputMode="tel"
              placeholder={t(APPLY_UI.phonePlaceholder, locale)}
              aria-invalid={invalid(FIELDS.phone)}
              aria-describedby={describedBy(FIELDS.phone)}
              className="pixel-input mt-2"
            />
            <FieldError id={errId(FIELDS.phone)} message={err[FIELDS.phone]} />
          </div>

          <div>
            <label htmlFor={id(FIELDS.gradYear)} className={LABEL}>
              {t(APPLY_UI.gradYear, locale)}
            </label>
            <select
              id={id(FIELDS.gradYear)}
              name={FIELDS.gradYear}
              defaultValue=""
              aria-invalid={invalid(FIELDS.gradYear)}
              aria-describedby={describedBy(FIELDS.gradYear)}
              className="pixel-input mt-2"
            >
              <option value="">{t(FORM.optional, locale)}</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <FieldError
              id={errId(FIELDS.gradYear)}
              message={err[FIELDS.gradYear]}
            />
          </div>

          <div>
            <label htmlFor={id(FIELDS.school)} className={LABEL}>
              {t(APPLY_UI.school, locale)}
            </label>
            <input
              id={id(FIELDS.school)}
              name={FIELDS.school}
              type="text"
              maxLength={LIMITS.school}
              placeholder={t(APPLY_UI.schoolPlaceholder, locale)}
              aria-invalid={invalid(FIELDS.school)}
              aria-describedby={describedBy(FIELDS.school)}
              className="pixel-input mt-2"
            />
            <FieldError id={errId(FIELDS.school)} message={err[FIELDS.school]} />
          </div>

          <div>
            <label htmlFor={id(FIELDS.major)} className={LABEL}>
              {t(APPLY_UI.major, locale)}
            </label>
            <input
              id={id(FIELDS.major)}
              name={FIELDS.major}
              type="text"
              maxLength={LIMITS.major}
              placeholder={t(APPLY_UI.majorPlaceholder, locale)}
              aria-invalid={invalid(FIELDS.major)}
              aria-describedby={describedBy(FIELDS.major)}
              className="pixel-input mt-2"
            />
            <FieldError id={errId(FIELDS.major)} message={err[FIELDS.major]} />
          </div>
        </div>
      </fieldset>

      {/* ── Hồ sơ ── */}
      <fieldset className="mt-10 border-0 p-0">
        <legend className="font-pixel text-sm uppercase tracking-[0.3em] text-clay">
          {t(APPLY_UI.groupProfile, locale)}
        </legend>

        <div className="mt-4 flex flex-col gap-5">
          <div>
            <label htmlFor={id(FIELDS.cvUrl)} className={LABEL}>
              {t(APPLY_UI.cvUrl, locale)}
              <Required />
            </label>
            <input
              id={id(FIELDS.cvUrl)}
              name={FIELDS.cvUrl}
              type="url"
              required
              maxLength={LIMITS.cvUrl}
              placeholder="https://drive.google.com/..."
              aria-invalid={invalid(FIELDS.cvUrl)}
              aria-describedby={describedBy(FIELDS.cvUrl, true)}
              className="pixel-input mt-2"
            />
            {/* A LINK, NOT AN UPLOAD, and the hint says why so nobody hunts for a
                missing file button. See the note in `application-form.ts`. */}
            <Hint id={hintId(FIELDS.cvUrl)}>
              {t(APPLY_UI.cvHint, locale)}
            </Hint>
            <FieldError id={errId(FIELDS.cvUrl)} message={err[FIELDS.cvUrl]} />
          </div>

          <div>
            <label htmlFor={id(FIELDS.portfolio)} className={LABEL}>
              {t(APPLY_UI.portfolio, locale)}
            </label>
            <input
              id={id(FIELDS.portfolio)}
              name={FIELDS.portfolio}
              type="url"
              maxLength={LIMITS.portfolio}
              placeholder="https://github.com/..."
              aria-invalid={invalid(FIELDS.portfolio)}
              aria-describedby={describedBy(FIELDS.portfolio)}
              className="pixel-input mt-2"
            />
            <FieldError
              id={errId(FIELDS.portfolio)}
              message={err[FIELDS.portfolio]}
            />
          </div>

          <div>
            <label htmlFor={id(FIELDS.intro)} className={LABEL}>
              {t(APPLY_UI.intro, locale)}
              <Required />
            </label>
            <textarea
              id={id(FIELDS.intro)}
              name={FIELDS.intro}
              required
              rows={7}
              maxLength={LIMITS.intro}
              placeholder={t(APPLY_UI.introPlaceholder, locale)}
              aria-invalid={invalid(FIELDS.intro)}
              aria-describedby={describedBy(FIELDS.intro)}
              className="pixel-input mt-2"
            />
            <FieldError id={errId(FIELDS.intro)} message={err[FIELDS.intro]} />
          </div>
        </div>
      </fieldset>

      {/* ── Thời gian ── */}
      <fieldset className="mt-10 border-0 p-0">
        <legend className="font-pixel text-sm uppercase tracking-[0.3em] text-clay">
          {t(APPLY_UI.groupTiming, locale)}
        </legend>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={id(FIELDS.availability)} className={LABEL}>
              {t(APPLY_UI.availability, locale)}
            </label>
            <select
              id={id(FIELDS.availability)}
              name={FIELDS.availability}
              defaultValue=""
              className="pixel-input mt-2"
            >
              <option value="">{t(FORM.optional, locale)}</option>
              {AVAILABILITY.map((o) => (
                <option key={o.value} value={o.value}>
                  {t(o.label, locale)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={id(FIELDS.startDate)} className={LABEL}>
              {t(APPLY_UI.startDate, locale)}
            </label>
            <select
              id={id(FIELDS.startDate)}
              name={FIELDS.startDate}
              defaultValue=""
              className="pixel-input mt-2"
            >
              <option value="">{t(FORM.optional, locale)}</option>
              {START_DATES.map((o) => (
                <option key={o.value} value={o.value}>
                  {t(o.label, locale)}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor={id(FIELDS.source)} className={LABEL}>
              {t(APPLY_UI.source, locale)}
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
      </fieldset>

      {/* ── Consent ──
          Unticked by default and required. Narrow scope on purpose: permission to
          PROCESS THIS APPLICATION, not a standing licence to keep the CV forever
          or a marketing opt-in. */}
      <div className="mt-9">
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
            {t(APPLY_UI.consent, locale)}
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
