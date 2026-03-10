import { supabase } from "@/lib/supabase";

export type FeedbackSource = "floating_widget";
export type FeedbackNotificationStatus = "sent" | "failed" | "skipped";

export interface SubmitFeedbackInput {
  route: string;
  pageUrl: string;
  message: string;
  contact?: string;
  userId?: string | null;
  userEmail?: string | null;
  source?: FeedbackSource;
}

export interface SubmitFeedbackResult {
  id: string;
  notificationStatus: FeedbackNotificationStatus;
  notificationError: string | null;
}

type FeedbackNotifyResponse = {
  ok?: boolean;
  status?: FeedbackNotificationStatus;
  error?: string | null;
};

const FEEDBACK_NOTIFY_FUNCTION = "feedback-notify";

export async function submitFeedback(input: SubmitFeedbackInput): Promise<SubmitFeedbackResult> {
  const { data: sessionData } = await supabase.auth.getSession();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const authToken = anonKey; // force anon token to avoid expired user JWT issues

  if (!authToken) {
    throw new Error("Supabase anon key tidak tersedia. Set VITE_SUPABASE_ANON_KEY di environment.");
  }

  const headers = {
    apikey: authToken,
    Authorization: `Bearer ${authToken}`,
  };

  const { data: notificationData, error: invokeError } =
    await supabase.functions.invoke<FeedbackNotifyResponse & { id?: string }>(
      FEEDBACK_NOTIFY_FUNCTION,
      {
        headers,
        body: {
          route: input.route,
          pageUrl: input.pageUrl,
          message: input.message,
          contact: input.contact?.trim() || null,
          userId: input.userId ?? null,
          userEmail: sessionData.session?.user.email ?? (input.userEmail?.trim() || null),
          source: input.source ?? "floating_widget",
        },
      },
    );

  if (invokeError) {
    // Try direct insert fallback for auth failures
    if (invokeError.message?.includes("401")) {
      const fallback = await supabase
        .from("feedback_messages")
        .insert({
          route: input.route,
          page_url: input.pageUrl,
          message: input.message,
          contact: input.contact?.trim() || null,
          user_email: sessionData.session?.user.email ?? (input.userEmail?.trim() || null),
          source: input.source ?? "floating_widget",
        })
        .select("id")
        .single();

      if (!fallback.error && fallback.data?.id) {
        return {
          id: String(fallback.data.id),
          notificationStatus: "skipped",
          notificationError: "Edge function 401; fallback insert tanpa notifikasi.",
        };
      }

      throw new Error("Tidak bisa kirim feedback (401). Periksa anon key atau login ulang.");
    }
    throw new Error(invokeError.message || "Feedback submit failed.");
  }

  let notificationStatus: FeedbackNotificationStatus = "skipped";
  let notificationError: string | null = null;

  if (notificationData?.status === "sent" || notificationData?.ok) {
    notificationStatus = "sent";
  } else if (notificationData?.status === "failed") {
    notificationStatus = "failed";
    notificationError = notificationData.error ?? null;
  } else {
    notificationStatus = "skipped";
    notificationError = notificationData?.error ?? null;
  }

  return {
    id: String(notificationData?.id ?? ""),
    notificationStatus,
    notificationError,
  };
}
