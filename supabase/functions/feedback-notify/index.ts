import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const MIN_FEEDBACK_MESSAGE_LENGTH = 8;

type FeedbackMessage = {
  id: string;
  route: string;
  page_url: string;
  message: string;
  contact: string | null;
  user_email: string | null;
  status: "pending" | "notified" | "notification_failed";
  notification_attempts: number;
  created_at: string;
};

type FeedbackSubmitPayload = {
  feedbackId?: string;
  route?: string;
  pageUrl?: string;
  message?: string;
  contact?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  source?: string | null;
};

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function buildTelegramMessage(feedback: FeedbackMessage) {
  return [
    "Alpha Tracker feedback",
    `ID: ${feedback.id}`,
    `Page: ${feedback.route}`,
    `URL: ${feedback.page_url}`,
    `User: ${feedback.user_email ?? "-"}`,
    `Contact: ${feedback.contact ?? "-"}`,
    `Created: ${feedback.created_at}`,
    "",
    feedback.message,
  ].join("\n");
}

async function updateFeedbackStatus(
  admin: ReturnType<typeof createClient>,
  feedback: FeedbackMessage,
  payload: {
    status: "notified" | "notification_failed";
    notification_error: string | null;
    notified_at?: string | null;
  },
) {
  await admin
    .from("feedback_messages")
    .update({
      status: payload.status,
      notification_attempts: feedback.notification_attempts + 1,
      notification_error: payload.notification_error,
      notified_at: payload.notified_at ?? null,
    })
    .eq("id", feedback.id);
}

function sanitizeFeedbackPayload(payload: FeedbackSubmitPayload) {
  const route = payload.route?.trim();
  const pageUrl = payload.pageUrl?.trim();
  const message = payload.message?.trim();

  if (!route || !pageUrl || !message || message.length < MIN_FEEDBACK_MESSAGE_LENGTH) {
    return null;
  }

  return {
    route,
    pageUrl,
    message,
    contact: payload.contact?.trim() || null,
    userId: payload.userId?.trim() || null,
    userEmail: payload.userEmail?.trim() || null,
    source: payload.source?.trim() || "floating_widget",
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const telegramChatId = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse(500, {
        ok: false,
        status: "failed",
        error: "Supabase admin credentials are not configured.",
      });
    }

    const payload = (await request.json()) as FeedbackSubmitPayload;

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    let feedbackId = payload.feedbackId;

    if (!feedbackId) {
      const sanitized = sanitizeFeedbackPayload(payload);
      if (!sanitized) {
        return jsonResponse(400, {
          ok: false,
          status: "failed",
          error: `route, pageUrl, and message with at least ${MIN_FEEDBACK_MESSAGE_LENGTH} characters are required.`,
        });
      }

      const { data: insertedFeedback, error: insertError } = await admin
        .from("feedback_messages")
        .insert([
          {
            user_id: sanitized.userId,
            route: sanitized.route,
            page_url: sanitized.pageUrl,
            message: sanitized.message,
            contact: sanitized.contact,
            user_email: sanitized.userEmail,
            source: sanitized.source,
          },
        ])
        .select(
          "id, route, page_url, message, contact, user_email, status, notification_attempts, created_at",
        )
        .single<FeedbackMessage>();

      if (insertError || !insertedFeedback) {
        return jsonResponse(500, {
          ok: false,
          status: "failed",
          error: insertError?.message ?? "Failed to store feedback message.",
        });
      }

      feedbackId = insertedFeedback.id;
    }

    if (!feedbackId || typeof feedbackId !== "string") {
      return jsonResponse(400, {
        ok: false,
        status: "failed",
        error: "feedbackId is required.",
      });
    }

    const { data: feedback, error: feedbackError } = await admin
      .from("feedback_messages")
      .select(
        "id, route, page_url, message, contact, user_email, status, notification_attempts, created_at",
      )
      .eq("id", feedbackId)
      .single<FeedbackMessage>();

    if (feedbackError || !feedback) {
      return jsonResponse(404, {
        ok: false,
        status: "failed",
        error: feedbackError?.message ?? "Feedback message not found.",
      });
    }

    if (!telegramBotToken || !telegramChatId) {
      await updateFeedbackStatus(admin, feedback, {
        status: "notification_failed",
        notification_error: "Telegram bot token or chat id is not configured.",
      });

      return jsonResponse(200, {
        ok: false,
        status: "failed",
        id: feedback.id,
        error: "Telegram bot token or chat id is not configured.",
      });
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: buildTelegramMessage(feedback),
          disable_web_page_preview: true,
        }),
      },
    );

    if (!telegramResponse.ok) {
      const responseText = await telegramResponse.text();

      await updateFeedbackStatus(admin, feedback, {
        status: "notification_failed",
        notification_error: responseText.slice(0, 1000),
      });

      return jsonResponse(200, {
        ok: false,
        status: "failed",
        id: feedback.id,
        error: responseText,
      });
    }

    await updateFeedbackStatus(admin, feedback, {
      status: "notified",
      notification_error: null,
      notified_at: new Date().toISOString(),
    });

    return jsonResponse(200, {
      ok: true,
      status: "sent",
      id: feedback.id,
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      status: "failed",
      error: error instanceof Error ? error.message : "Unexpected error.",
    });
  }
});
