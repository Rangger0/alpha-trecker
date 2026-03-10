import { supabase } from "@/lib/supabase";

export type FeedbackInboxStatus = "pending" | "notified" | "notification_failed";

export interface FeedbackInboxItem {
  id: string;
  route: string;
  pageUrl: string;
  message: string;
  contact: string | null;
  userEmail: string | null;
  status: FeedbackInboxStatus;
  notificationAttempts: number;
  notificationError: string | null;
  notifiedAt: string | null;
  createdAt: string;
  source: string;
}

export interface FeedbackInboxStats {
  total: number;
  notified: number;
  failed: number;
  pending: number;
  today: number;
  uniqueReporters: number;
}

export interface FeedbackInboxResult {
  ownerEmail: string;
  items: FeedbackInboxItem[];
  stats: FeedbackInboxStats;
}

type FeedbackMessageRow = {
  id: string;
  route: string;
  page_url: string;
  message: string;
  contact: string | null;
  user_email: string | null;
  status: FeedbackInboxStatus;
  notification_attempts: number;
  notification_error: string | null;
  notified_at: string | null;
  created_at: string;
  source: string;
};

export async function getFeedbackInbox(): Promise<FeedbackInboxResult> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    const error = new Error("Owner session not found.");
    (error as Error & { code?: string }).code = "FORBIDDEN";
    throw error;
  }

  const { data, error } = await supabase
    .from("feedback_messages")
    .select(
      "id, route, page_url, message, contact, user_email, status, notification_attempts, notification_error, notified_at, created_at, source",
    )
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<FeedbackMessageRow[]>();

  if (error) {
    const failure = new Error(error.message || "Failed to load feedback inbox.");
    const code = String((error as { code?: string }).code || "");
    if (code === "42501" || code === "PGRST301" || code === "401" || code === "403") {
      (failure as Error & { code?: string }).code = "FORBIDDEN";
    }
    throw failure;
  }

  const items = (data || []).map((item) => ({
    id: item.id,
    route: item.route,
    pageUrl: item.page_url,
    message: item.message,
    contact: item.contact,
    userEmail: item.user_email,
    status: item.status,
    notificationAttempts: item.notification_attempts,
    notificationError: item.notification_error,
    notifiedAt: item.notified_at,
    createdAt: item.created_at,
    source: item.source,
  }));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    ownerEmail: session.user.email || "",
    items,
    stats: {
      total: items.length,
      notified: items.filter((item) => item.status === "notified").length,
      failed: items.filter((item) => item.status === "notification_failed").length,
      pending: items.filter((item) => item.status === "pending").length,
      today: items.filter((item) => new Date(item.createdAt).getTime() >= today.getTime()).length,
      uniqueReporters: new Set(items.map((item) => item.userEmail || item.contact || item.id)).size,
    },
  };
}
