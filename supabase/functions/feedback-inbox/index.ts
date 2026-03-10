import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_OWNER_EMAILS = ["allgazali011@gmail.com"];

type FeedbackMessageRow = {
  id: string;
  route: string;
  page_url: string;
  message: string;
  contact: string | null;
  user_email: string | null;
  status: "pending" | "notified" | "notification_failed";
  notification_attempts: number;
  notification_error: string | null;
  notified_at: string | null;
  created_at: string;
  source: string;
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

function normalizeEmail(value?: string | null) {
  return value?.trim().toLowerCase() || "";
}

function getBearerToken(authHeader?: string | null) {
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token?.trim()) {
    return null;
  }

  return token.trim();
}

function parseOwnerEmails(raw?: string | null) {
  if (!raw) {
    return [];
  }

  return Array.from(
    new Set(
      raw
        .split(",")
        .map((item) => normalizeEmail(item))
        .filter(Boolean),
    ),
  );
}

function getOwnerEmails() {
  const configured = parseOwnerEmails(Deno.env.get("FEEDBACK_INBOX_OWNER_EMAILS"));
  return configured.length ? configured : DEFAULT_OWNER_EMAILS;
}

function collectUserEmails(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
  identities?: Array<{ identity_data?: Record<string, unknown> | null }> | null;
}) {
  const candidates = new Set<string>();

  const addCandidate = (value: unknown) => {
    if (typeof value !== "string") {
      return;
    }

    const normalized = normalizeEmail(value);
    if (normalized) {
      candidates.add(normalized);
    }
  };

  addCandidate(user.email);
  addCandidate(user.user_metadata?.email);
  addCandidate(user.user_metadata?.preferred_email);

  for (const identity of user.identities || []) {
    addCandidate(identity.identity_data?.email);
  }

  return Array.from(candidates);
}

function buildStats(items: FeedbackMessageRow[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    total: items.length,
    notified: items.filter((item) => item.status === "notified").length,
    failed: items.filter((item) => item.status === "notification_failed").length,
    pending: items.filter((item) => item.status === "pending").length,
    today: items.filter((item) => new Date(item.created_at).getTime() >= today.getTime()).length,
    uniqueReporters: new Set(
      items.map((item) => normalizeEmail(item.user_email) || item.contact || item.id),
    ).size,
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const authHeader = request.headers.get("Authorization");
    const accessToken = getBearerToken(authHeader);

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse(500, {
        ok: false,
        error: "Supabase credentials are not configured.",
      });
    }

    if (!accessToken) {
      return jsonResponse(401, {
        ok: false,
        accessDenied: true,
        error: "Authorization header is required.",
      });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user },
      error: userError,
    } = await admin.auth.getUser(accessToken);

    if (userError || !user) {
      return jsonResponse(401, {
        ok: false,
        accessDenied: true,
        error: userError?.message ?? "Owner session not found.",
      });
    }

    const ownerEmails = getOwnerEmails();
    const userEmails = collectUserEmails(user);

    if (!userEmails.some((email) => ownerEmails.includes(email))) {
      return jsonResponse(403, {
        ok: false,
        accessDenied: true,
        error: `Feedback inbox is restricted to the owner account. Known emails: ${userEmails.join(", ") || "none"}.`,
      });
    }

    const { data, error } = await admin
      .from("feedback_messages")
      .select(
        "id, route, page_url, message, contact, user_email, status, notification_attempts, notification_error, notified_at, created_at, source",
      )
      .order("created_at", { ascending: false })
      .limit(200)
      .returns<FeedbackMessageRow[]>();

    if (error) {
      return jsonResponse(500, {
        ok: false,
        error: error.message,
      });
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

    return jsonResponse(200, {
      ok: true,
      ownerEmail: user.email || userEmails[0] || "",
      items,
      stats: buildStats(data || []),
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Unexpected error.",
    });
  }
});
