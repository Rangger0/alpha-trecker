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
  const { data: notificationData, error: invokeError } =
    await supabase.functions.invoke<FeedbackNotifyResponse & { id?: string }>(
      FEEDBACK_NOTIFY_FUNCTION,
      {
        body: {
          route: input.route,
          pageUrl: input.pageUrl,
          message: input.message,
          contact: input.contact?.trim() || null,
          userId: input.userId ?? null,
          userEmail: input.userEmail?.trim() || null,
          source: input.source ?? "floating_widget",
        },
      },
    );

  if (invokeError) {
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
