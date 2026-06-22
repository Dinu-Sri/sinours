"use client";

import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "./actions";
import { useLocale } from "next-intl";

const initialState: ContactState | undefined = undefined;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, formAction] = useFormState(submitContact, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          {t("formName")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none transition-colors focus:border-foreground"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          {t("formEmail")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none transition-colors focus:border-foreground"
        />
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
          {t("formSubject")}
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none transition-colors focus:border-foreground"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          {t("formMessage")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
        />
      </div>

      {state && (
        <p
          className={`text-sm ${
            state.ok ? "text-foreground" : "text-muted-foreground"
          }`}
          role="status"
        >
          {state.ok ? t("formSuccess") : t("formError")}
        </p>
      )}

      <SubmitButton label={t("formSend")} />
    </form>
  );
}
