"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export type ContactState = { ok: boolean; error?: string };

/**
 * Phase 1: persists the message to the ContactMessage table.
 * Phase 2+: also send an email (Resend/SMTP) once keys are configured.
 */
export async function submitContact(
  _prev: ContactState | undefined,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const locale = String(formData.get("locale") ?? "en").trim();

  if (!name || !email || !message) {
    return { ok: false, error: "missing-fields" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "invalid-email" };
  }

  try {
    await prisma.contactMessage.create({
      data: { name, email, subject, message, locale },
    });
    return { ok: true };
  } catch (e) {
    console.error("contact submit failed", e);
    return { ok: false, error: "server" };
  }
}

// Re-export so callers can redirect after success if needed.
export { redirect };
