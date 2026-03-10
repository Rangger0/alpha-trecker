import { useTheme } from "@/contexts/ThemeContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowUpRight, Bot, Brain, Code, Sparkles, Terminal } from "lucide-react";
import type { CSSProperties } from "react";

type AITool = {
  name: string;
  description: string;
  url: string;
  logo?: string;
  accent: string;
  tags?: string[];
};

const codingAI: AITool[] = [
  {
    name: "ChatGPT",
    description: "General-purpose copilot for coding, debugging, planning, and quick product thinking.",
    url: "https://chatgpt.com",
    logo: "/logos/chatgpt.png",
    accent: "#fafafa",
    tags: ["coding", "reasoning"],
  },
  {
    name: "Claude",
    description: "Strong long-context assistant for refactors, writing specs, and code review.",
    url: "https://claude.ai",
    logo: "/logos/claude.png",
    accent: "#D97706",
    tags: ["context", "review"],
  },
  {
    name: "Kimi AI",
    description: "Fast analysis assistant with strong document digestion for research-heavy work.",
    url: "https://kimi.moonshot.cn",
    logo: "/logos/kimi.png",
    accent: "#ffffff",
    tags: ["docs", "analysis"],
  },
  {
    name: "Cursor",
    description: "AI-first editor for codebase chat, edits, and workflow inside the IDE.",
    url: "https://cursor.com",
    logo: "/logos/cursor.png",
    accent: "#ffffff",
    tags: ["editor", "ide"],
  },
  {
    name: "GitHub Copilot",
    description: "Pair programmer for inline completion, chat, and everyday coding assist.",
    url: "https://github.com/features/copilot",
    logo: "/logos/github.png",
    accent: "#ffffff",
    tags: ["autocomplete", "pairing"],
  },
  {
    name: "Windsurf",
    description: "Code editor with agent-style flows for planning, edits, and execution loops.",
    url: "https://windsurf.com/editor",
    logo: "/logos/windsurf.png",
    accent: "#f1f1f1",
    tags: ["editor", "agentic"],
  },
  {
    name: "Codeium",
    description: "Fast free autocomplete and chat assistant for multi-language dev work.",
    url: "https://codeium.com",
    logo: "/logos/code.png",
    accent: "#ffffff",
    tags: ["free", "autocomplete"],
  },
  {
    name: "Replit AI",
    description: "Browser-first coding assistant for prototypes, apps, and quick product shipping.",
    url: "https://replit.com/ai",
    logo: "/logos/replit.png",
    accent: "#f96800",
    tags: ["browser", "prototype"],
  },
];

const researchAI: AITool[] = [
  {
    name: "DeepSeek",
    description: "Useful for dense reasoning, market reading, and rough technical synthesis.",
    url: "https://www.deepseek.com",
    logo: "/logos/deepseek.png",
    accent: "#265ee0",
    tags: ["reasoning", "market"],
  },
  {
    name: "Perplexity",
    description: "Research engine with web grounding for fast fact-finding and exploration.",
    url: "https://www.perplexity.ai",
    logo: "/logos/perplexity.png",
    accent: "#225e37",
    tags: ["web", "research"],
  },
  {
    name: "NotebookLM",
    description: "Source-grounded workspace for studying docs, notes, transcripts, and summaries.",
    url: "https://notebooklm.google.com",
    logo: "/logos/note.png",
    accent: "#ffffff",
    tags: ["notes", "source-grounded"],
  },
  {
    name: "Grok",
    description: "Fast real-time assistant that is useful for broad search and current-event context.",
    url: "https://grok.com",
    logo: "/logos/grok.png",
    accent: "#ffffff",
    tags: ["realtime", "search"],
  },
  {
    name: "Phind",
    description: "Developer search assistant for debugging paths, libraries, and code explanations.",
    url: "https://phind.com",
    logo: "/logos/phind.png",
    accent: "var(--alpha-signal)",
    tags: ["developer", "search"],
  },
  {
    name: "You.com",
    description: "Search-centric assistant with privacy angle and multiple answer modes.",
    url: "https://you.com",
    logo: "/logos/you.png",
    accent: "#bfa2f1",
    tags: ["privacy", "search"],
  },
  {
    name: "Exa",
    description: "Search API and research workflow focused on high-signal web retrieval.",
    url: "https://exa.ai",
    logo: "/logos/exa.png",
    accent: "#22d3ee",
    tags: ["retrieval", "api"],
  },
  {
    name: "Elicit",
    description: "Research assistant for reading papers, comparing evidence, and synthesis.",
    url: "https://elicit.com",
    logo: "/logos/elicit.png",
    accent: "#34d399",
    tags: ["papers", "evidence"],
  },
];

const agentAI: AITool[] = [
  {
    name: "OpenHands",
    description: "Agent platform for code tasks that can inspect, edit, and iterate on repos.",
    url: "https://openhands.dev",
    logo: "/logos/openhands.png",
    accent: "#7dd3fc",
    tags: ["coding agent", "automation"],
  },
  {
    name: "AutoGPT",
    description: "Autonomous workflow runner for long-horizon tasks and chained actions.",
    url: "https://agpt.co",
    logo: "/logos/auto.png",
    accent: "#381b69",
    tags: ["autonomous", "task loop"],
  },
  {
    name: "CrewAI",
    description: "Multi-agent orchestration layer for role-based teams and repeatable flows.",
    url: "https://www.crewai.com",
    logo: "/logos/crew.png",
    accent: "var(--alpha-violet)",
    tags: ["multi-agent", "orchestration"],
  },
  {
    name: "LangChain",
    description: "Framework for building LLM applications, tools, memory, and chains.",
    url: "https://www.langchain.com",
    logo: "/logos/langchain.png",
    accent: "#86cef4",
    tags: ["framework", "llm apps"],
  },
  {
    name: "LangGraph",
    description: "Graph-based runtime for stateful multi-step and multi-agent execution.",
    url: "https://www.langchain.com/langgraph",
    logo: "/logos/lang.png",
    accent: "#27beff",
    tags: ["stateful", "graph"],
  },
  {
    name: "AutoGen",
    description: "Microsoft framework for agent conversations, tooling, and structured execution.",
    url: "https://microsoft.github.io/autogen/stable/",
    logo: "/logos/ag.png",
    accent: "#999999",
    tags: ["framework", "microsoft"],
  },
  {
    name: "Flowise",
    description: "Visual builder for chatflows, agent graphs, and internal AI automation.",
    url: "https://flowiseai.com",
    logo: "/logos/flowise.png",
    accent: "#0b4cfe",
    tags: ["visual", "builder"],
  },
  {
    name: "Dify",
    description: "Platform to ship AI apps, workflows, agents, and internal copilots faster.",
    url: "https://dify.ai",
    logo: "/logos/dify.png",
    accent: "#007bff",
    tags: ["workflow", "app platform"],
  },
];

const getToolInitials = (name: string) => {
  const parts = name
    .replace(/[^a-zA-Z0-9 ]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "AI";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const getAccentGlow = (accent: string) => `color-mix(in srgb, ${accent} 14%, transparent)`;

const aiSections = [
  {
    key: "coding",
    title: "Coding & Development",
    note: "Editors, copilots, dan assistants buat ngoding lebih cepat dan lebih rapi.",
    icon: Code,
    iconClassName: "border border-alpha-border bg-[color:var(--alpha-hover-soft)] text-[var(--alpha-highlight)]",
    tools: codingAI,
  },
  {
    key: "research",
    title: "Research & Analysis",
    note: "Stack buat cari context, baca source, dan bantu screening project lebih cepat.",
    icon: Brain,
    iconClassName: "border border-alpha-border bg-[color:var(--alpha-hover-soft)] text-[var(--alpha-highlight)]",
    tools: researchAI,
  },
  {
    key: "agents",
    title: "AI Agents",
    note: "Framework dan platform agentic buat workflow yang lebih otomatis dan repeatable.",
    icon: Terminal,
    iconClassName: "border border-alpha-border bg-[color:var(--alpha-hover-soft)] text-[var(--alpha-highlight)]",
    tools: agentAI,
  },
] as const;

export function AIToolsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const totalTools = aiSections.reduce((sum, section) => sum + section.tools.length, 0);

  const renderToolCard = (tool: AITool, index: number) => (
    <a
      key={tool.name}
      href={tool.url}
      target="_blank"
      rel="noreferrer"
      style={
        {
          borderLeft: `3px solid ${tool.accent}`,
          "--mac-delay": `${index * 24}ms`,
        } as CSSProperties
      }
      className={`
        macos-premium-card macos-card-entry group relative block min-h-[136px] overflow-hidden rounded-[1.35rem] p-4
        transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg
        ${isDark
          ? "bg-[var(--alpha-surface)] border-[var(--alpha-border)] hover:border-[var(--alpha-border-strong)]"
          : "bg-[var(--alpha-panel)] border-[var(--alpha-border)] hover:border-[var(--alpha-border-strong)]"}
      `}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(135deg, ${getAccentGlow(tool.accent)} 0%, transparent 54%)` }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border text-sm font-semibold uppercase tracking-[0.18em] ${
              isDark
                ? "border-[var(--alpha-border)] bg-[color:var(--alpha-hover-soft)]"
                : "border-[var(--alpha-border)] bg-[color:var(--alpha-hover-soft)]"
            }`}
            style={{ color: tool.accent }}
          >
            {tool.logo ? (
              <img
                src={tool.logo}
                alt={tool.name}
                className="h-6 w-6 object-contain"
                onError={(event) => {
                  const target = event.currentTarget;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLSpanElement | null;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}
            <span
              className={`${tool.logo ? "hidden" : "flex"} h-6 w-6 items-center justify-center text-[11px] font-bold`}
              style={{ color: tool.accent }}
            >
              {getToolInitials(tool.name)}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate text-[15px] font-semibold alpha-text">{tool.name}</h3>
              <ArrowUpRight
                className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                style={{ color: tool.accent }}
              />
            </div>
            <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 alpha-text-muted">{tool.description}</p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {(tool.tags ?? []).slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${
                "border-[var(--alpha-border)] bg-[color:var(--alpha-hover-soft)]"
              } alpha-text-muted`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
          style={{ background: tool.accent }}
        />
      </div>
    </a>
  );

  return (
    <DashboardLayout disableMonochrome>
      <div className="macos-root macos-page-shell">
        <section className="macos-page-header macos-animate-up">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
            <div>
              <div className="macos-page-kicker">
                <Brain className="h-3.5 w-3.5" />
                AI Stack
              </div>
              <h1 className="macos-page-title">AI Tools</h1>
              <p className="macos-page-subtitle">
                Stack AI yang lebih lengkap buat coding, research, dan workflow agentic. Saya isi section-nya
                biar nggak ada slot kosong dan lebih enak dipakai sebagai command center harian.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="macos-card rounded-[1.2rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Total tools</p>
                <p className="mt-2 text-[1.55rem] font-semibold alpha-text">{totalTools}</p>
              </div>
              <div className="macos-card rounded-[1.2rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Categories</p>
                <p className="mt-2 text-[1.55rem] font-semibold alpha-text">{aiSections.length}</p>
              </div>
              <div className="macos-card rounded-[1.2rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Coding stack</p>
                <p className="mt-2 text-[1.55rem] font-semibold alpha-text">{codingAI.length}</p>
              </div>
              <div className="macos-card rounded-[1.2rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Agent builders</p>
                <p className="mt-2 text-[1.55rem] font-semibold alpha-text">{agentAI.length}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-8">
          {aiSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon;

            return (
              <section key={section.key}>
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${section.iconClassName}`}>
                      <SectionIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--alpha-signal)]">
                          {section.title}
                        </h2>
                        <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
                          {section.tools.length} tools
                        </span>
                      </div>
                      <p className="mt-1 text-sm alpha-text-muted">{section.note}</p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] alpha-text-muted">
                    <Sparkles className="h-3.5 w-3.5 text-gold" />
                    Curated stack
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {section.tools.map((tool, index) =>
                    renderToolCard(
                      tool,
                      index + sectionIndex * 20
                    )
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-8">
          <div className="macos-card flex flex-col gap-3 rounded-[1.4rem] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Workflow note</p>
                <p className="mt-1 text-sm leading-6 alpha-text-muted">
                  Pakai kombinasi satu editor AI, satu research engine, dan satu agent framework biar halaman ini
                  jadi stack operasional, bukan cuma bookmark list.
                </p>
              </div>
            </div>
            <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold">
              Ready to use
            </span>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
