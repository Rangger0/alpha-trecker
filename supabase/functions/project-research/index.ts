const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-v4-flash";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ProjectResearchInput = {
  projectUrl?: string;
  docsUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  notes?: string;
};

type ProjectResearchResult = {
  name: string;
  score: number;
  recommendation: "EXECUTE" | "WATCHLIST" | "SKIP";
  summary: string[];
  metadata: Record<string, unknown> | null;
  github: Record<string, unknown> | null;
  funding: Record<string, unknown> | null;
  social: Record<string, unknown> | null;
};

type DeepSeekChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
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

function normalizeUrl(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function hasValidHostname(value: string) {
  try {
    const url = new URL(normalizeUrl(value));
    return Boolean(url.hostname && url.hostname.includes("."));
  } catch {
    return false;
  }
}

function sanitizeInput(payload: ProjectResearchInput) {
  const input = {
    projectUrl: normalizeUrl(payload.projectUrl),
    docsUrl: normalizeUrl(payload.docsUrl),
    githubUrl: normalizeUrl(payload.githubUrl),
    twitterUrl: normalizeUrl(payload.twitterUrl),
    notes: payload.notes?.trim().slice(0, 1200) || "",
  };

  const hasInput = Boolean(input.projectUrl || input.docsUrl || input.githubUrl || input.twitterUrl);
  if (!hasInput) {
    return { ok: false as const, error: "Minimal isi satu link project." };
  }

  for (const [key, value] of Object.entries(input)) {
    if (key === "notes" || !value) continue;
    if (!hasValidHostname(value)) {
      return { ok: false as const, error: `${key} tidak valid.` };
    }
  }

  return { ok: true as const, input };
}

function buildResearchPrompt({ projectUrl, docsUrl, githubUrl, twitterUrl, notes }: ProjectResearchInput) {
  return `
Analyze this crypto/web3 project for an airdrop hunter.

Inputs:
- Project URL: ${projectUrl || "-"}
- Docs URL: ${docsUrl || "-"}
- GitHub URL: ${githubUrl || "-"}
- Twitter/X URL: ${twitterUrl || "-"}
- Notes: ${notes || "-"}

Return only valid JSON with this exact shape:
{
  "name": "string",
  "score": 0,
  "recommendation": "EXECUTE | WATCHLIST | SKIP",
  "summary": ["short bullet", "short bullet"],
  "metadata": {
    "title": "string",
    "description": "string",
    "ecosystem": "string",
    "hasToken": false,
    "url": "string"
  } | null,
  "github": {
    "fullName": "string",
    "sourceType": "repository",
    "description": null,
    "stars": 0,
    "forks": 0,
    "openIssues": 0,
    "pushedAt": null,
    "htmlUrl": "string"
  } | null,
  "funding": {
    "total": "string",
    "investors": ["string"],
    "sourceUrl": "string",
    "sourceName": "string"
  } | null,
  "social": {
    "profileUrl": "string",
    "handle": "string",
    "source": "twitter"
  } | null
}

Keep the summary concise and evidence-oriented. Do not fabricate exact numbers when the input does not provide them.
`;
}

function extractJson(content: string) {
  const trimmed = content.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first >= 0 && last > first) {
    return trimmed.slice(first, last + 1);
  }

  return trimmed;
}

function clampScore(value: unknown) {
  const score = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(10, Number(score.toFixed(1))));
}

function normalizeRecommendation(value: unknown): ProjectResearchResult["recommendation"] {
  if (value === "EXECUTE" || value === "WATCHLIST" || value === "SKIP") {
    return value;
  }
  return "WATCHLIST";
}

function normalizeStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : [];
}

function normalizeResult(value: unknown): ProjectResearchResult {
  const parsed = (value && typeof value === "object" ? value : {}) as Partial<ProjectResearchResult>;

  return {
    name: typeof parsed.name === "string" && parsed.name.trim() ? parsed.name.trim() : "Unknown project",
    score: clampScore(parsed.score),
    recommendation: normalizeRecommendation(parsed.recommendation),
    summary: normalizeStringArray(parsed.summary),
    metadata: parsed.metadata && typeof parsed.metadata === "object" ? parsed.metadata : null,
    github: parsed.github && typeof parsed.github === "object" ? parsed.github : null,
    funding: parsed.funding && typeof parsed.funding === "object" ? parsed.funding : null,
    social: parsed.social && typeof parsed.social === "object" ? parsed.social : null,
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method not allowed." });
  }

  try {
    const apiKey = Deno.env.get("DEEPSEEK_API_KEY")?.trim();
    if (!apiKey) {
      return jsonResponse(500, {
        ok: false,
        error: "DEEPSEEK_API_KEY belum diset di Supabase Edge Function secrets.",
      });
    }

    const payload = (await request.json().catch(() => ({}))) as ProjectResearchInput;
    const sanitized = sanitizeInput(payload);
    if (!sanitized.ok) {
      return jsonResponse(400, { ok: false, error: sanitized.error });
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a web3 airdrop research analyst. Return compact JSON only.",
          },
          {
            role: "user",
            content: buildResearchPrompt(sanitized.input),
          },
        ],
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
        temperature: 0.2,
        max_tokens: 1600,
      }),
    });

    const data = (await response.json().catch(() => null)) as DeepSeekChatResponse | null;
    if (!response.ok) {
      return jsonResponse(response.status, {
        ok: false,
        error: data?.error?.message || "DeepSeek research request failed.",
      });
    }

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      return jsonResponse(502, { ok: false, error: "DeepSeek research response kosong." });
    }

    const parsed = JSON.parse(extractJson(content));
    return jsonResponse(200, {
      ok: true,
      result: normalizeResult(parsed),
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Unexpected project research error.",
    });
  }
});
