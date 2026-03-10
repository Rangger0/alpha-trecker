const DEFAULT_FEEDBACK_INBOX_OWNER_EMAILS = ["allgazali011@gmail.com"];

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || "";
}

function parseOwnerEmails(value?: string | null) {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => normalizeEmail(item))
        .filter(Boolean),
    ),
  );
}

export function getFeedbackInboxOwnerEmails() {
  const configured = parseOwnerEmails(import.meta.env.VITE_FEEDBACK_INBOX_OWNER_EMAILS);
  return configured.length ? configured : DEFAULT_FEEDBACK_INBOX_OWNER_EMAILS;
}

export function isFeedbackInboxOwner(email?: string | null) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return false;
  }

  return getFeedbackInboxOwnerEmails().includes(normalized);
}
