import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowLeftRight, ArrowUpRight, Layers, Sparkles, Zap } from "lucide-react";
import type { CSSProperties } from "react";

type SwapTool = {
  name: string;
  description: string;
  url: string;
  logo?: string;
  accent: string;
  tags?: string[];
};

const dexTools: SwapTool[] = [
  {
    name: "Uniswap",
    description: "Blue-chip Ethereum DEX for swaps, pools, and common routing.",
    url: "https://app.uniswap.org",
    logo: "/logos/uniswap.png",
    accent: "#ff2ced",
    tags: ["ethereum", "swap"],
  },
  {
    name: "Jupiter",
    description: "Best-known Solana routing layer for fast and efficient token swaps.",
    url: "https://jup.ag",
    logo: "/logos/jupiter.png",
    accent: "#00fc9f",
    tags: ["solana", "aggregator"],
  },
  {
    name: "DEX Screener",
    description: "Realtime DEX analytics for pair discovery, charts, and liquidity checks.",
    url: "https://dexscreener.com",
    logo: "/logos/dex.png",
    accent: "#000000",
    tags: ["analytics", "pairs"],
  },
  {
    name: "Hyperliquid",
    description: "High-speed onchain trading venue for spot and perps with deep activity.",
    url: "https://app.hyperliquid.xyz",
    logo: "/logos/hyp.png",
    accent: "#72ffcb",
    tags: ["perps", "trading"],
  },
  {
    name: "Aster",
    description: "Next-gen perp DEX aimed at active traders and faster execution.",
    url: "https://www.asterdex.com/en",
    logo: "/logos/aster.png",
    accent: "#ffd498",
    tags: ["perps", "traders"],
  },
  {
    name: "Lighter",
    description: "Low-latency Ethereum L2 venue with orderbook trading and tight execution.",
    url: "https://lighter.xyz",
    logo: "/logos/light.png",
    accent: "#000000",
    tags: ["orderbook", "l2"],
  },
  {
    name: "1inch",
    description: "Widely used routing engine for better prices across multiple DEX venues.",
    url: "https://1inch.io",
    logo: "/logos/1inch.png",
    accent: "#000000",
    tags: ["routing", "aggregator"],
  },
  {
    name: "PancakeSwap",
    description: "BNB-native DEX with swaps, pools, farms, and multi-chain expansion.",
    url: "https://pancakeswap.finance",
    logo: "/logos/pancake.png",
    accent: "#1FC7D4",
    tags: ["bnb", "dex"],
  },
  {
    name: "SushiSwap",
    description: "Multi-chain DEX suite for swapping and liquidity across several networks.",
    url: "https://www.sushi.com/swap",
    logo: "/logos/sushi.png",
    accent: "#FA52A0",
    tags: ["multi-chain", "swap"],
  },
  {
    name: "Curve",
    description: "Stable-focused AMM that still matters for low-slippage stablecoin routing.",
    url: "https://curve.fi",
    logo: "/logos/curve.png",
    accent: "#FF8C00",
    tags: ["stablecoins", "amm"],
  },
  {
    name: "Balancer",
    description: "AMM and vault-based liquidity venue useful for advanced pool structures.",
    url: "https://balancer.fi",
    logo: "/logos/balancer.png",
    accent: "#1E1E1E",
    tags: ["amm", "pools"],
  },
  {
    name: "TraderJoe",
    description: "Avalanche-native trading venue with swaps and liquidity for that ecosystem.",
    url: "https://traderjoexyz.com",
    logo: "/logos/traderjoe.png",
    accent: "#9151ff",
    tags: ["avalanche", "dex"],
  },
  {
    name: "Raydium",
    description: "Core Solana trading venue for ecosystem tokens and launch-adjacent liquidity.",
    url: "https://raydium.io/swap/",
    logo: "/logos/ray.png",
    accent: "#7c3aed",
    tags: ["solana", "launchpad"],
  },
  {
    name: "Aerodrome",
    description: "Base-native liquidity hub for routing, pools, and incentive-heavy volume.",
    url: "https://aerodrome.finance/swap",
    logo: "/logos/aero.png",
    accent: "#2563eb",
    tags: ["base", "liquidity"],
  },
  {
    name: "KyberSwap",
    description: "DEX and routing interface for multi-chain swaps with concentrated routes.",
    url: "https://kyberswap.com/swap",
    logo: "/logos/kyber.png",
    accent: "#16a34a",
    tags: ["multi-chain", "routing"],
  },
  {
    name: "GMX",
    description: "Perp trading venue for onchain leverage, especially on Arbitrum and Avalanche.",
    url: "https://app.gmx.io",
    logo: "/logos/gmx.png",
    accent: "#38bdf8",
    tags: ["perps", "leverage"],
  },
];

const bridgeTools: SwapTool[] = [
  {
    name: "Stargate",
    description: "Liquidity-based bridge for moving assets across supported EVM chains.",
    url: "https://stargate.finance",
    logo: "/logos/stargate.png",
    accent: "#a7a7a7",
    tags: ["evm", "liquidity"],
  },
  {
    name: "Across",
    description: "Fast and cheap bridge with strong reputation for practical day-to-day routes.",
    url: "https://across.to",
    logo: "/logos/across.png",
    accent: "#00ffea",
    tags: ["fast", "cheap"],
  },
  {
    name: "Orbiter",
    description: "Popular L2-focused bridge for moving between Ethereum rollups quickly.",
    url: "https://orbiter.finance",
    logo: "/logos/orbiter.png",
    accent: "#e4e4e4",
    tags: ["l2", "bridge"],
  },
  {
    name: "Hop",
    description: "Classic bridge option for common rollup routes and token movement.",
    url: "https://hop.exchange",
    logo: "/logos/hop.png",
    accent: "#e48aff",
    tags: ["rollups", "tokens"],
  },
  {
    name: "Synapse",
    description: "Cross-chain liquidity network for swaps and token transfers.",
    url: "https://synapseprotocol.com",
    logo: "/logos/synapse.png",
    accent: "#a200f9",
    tags: ["liquidity", "cross-chain"],
  },
  {
    name: "deBridge",
    description: "Bridge stack for moving assets and messages across multiple chains.lagi eror ",
    url: "https://app.debridge.finance",
    accent: "#f97316",
    tags: ["bridge", "messaging"],
  },
  {
    name: "Bungee",
    description: "Socket-powered bridge interface focused on route comparison and convenience.",
    url: "https://www.bungee.exchange",
     logo: "/logos/buge.png",
    accent: "#8b5cf6",
    tags: ["socket", "routes"],
  },
  {
    name: "Mayan",
    description: "Cross-chain swap and bridge flow often used for Solana to EVM routes.",
    url: "https://mayan.finance",
    logo: "/logos/mayan.png",
    accent: "#14b8a6",
    tags: ["solana", "evm"],
  },
];

const aggregatorTools: SwapTool[] = [
  {
    name: "Matcha",
    description: "Clean DEX aggregator from 0x with solid route execution for common swaps.",
    url: "https://matcha.xyz",
    logo: "/logos/matcha.png",
    accent: "#06f686",
    tags: ["0x", "routing"],
  },
  {
    name: "ParaSwap",
    description: "Aggregator for better rates across liquidity sources on major EVM chains.",
    url: "https://www.paraswap.io",
    logo: "/logos/paraswap.png",
    accent: "#ff9100",
    tags: ["evm", "rates"],
  },
  {
    name: "OpenOcean",
    description: "Aggregator for swaps across chains and DEX venues in one interface.",
    url: "https://openocean.finance",
    logo: "/logos/openocean.png",
    accent: "#000000",
    tags: ["multi-chain", "aggregator"],
  },
  {
    name: "Li.Fi",
    description: "Powerful bridge and swap routing layer for cross-chain user flows.",
    url: "https://li.fi",
    logo: "/logos/lifi.png",
    accent: "#f0acff",
    tags: ["bridge", "routing"],
  },
  {
    name: "Cow Swap",
    description: "Intent-based swap venue focused on MEV-aware execution and price quality.",
    url: "https://swap.cow.fi",
     logo: "/logos/caw.png",
    accent: "#fb7185",
    tags: ["intent", "mev aware"],
  },
  {
    name: "Odos",
    description: "Smart order router for batching and multi-token swap paths on EVM chains.",
    url: "https://app.odos.xyz",
    logo: "/logos/odos.png",
    accent: "#22c55e",
    tags: ["router", "batching"],
  },
  {
    name: "Rango",
    description: "Cross-chain aggregator for swaps, bridges, and route discovery in one flow.",
    url: "https://app.rango.exchange",
    logo: "/logos/rango.png",
    accent: "#f59e0b",
    tags: ["cross-chain", "routing"],
  },
  {
    name: "Rubic",
    description: "Bridge and swap aggregator aimed at broad chain coverage and simple execution.",
    url: "https://app.rubic.exchange",
    logo: "/logos/rubic.png",
    accent: "#35da9d",
    tags: ["bridge", "coverage"],
  },
];

const getToolInitials = (name: string) => {
  const parts = name
    .replace(/[^a-zA-Z0-9 ]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "SB";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const swapSections = [
  {
    key: "dex",
    title: "Decentralized Exchanges",
    note: "Venue utama buat spot, perps, liquidity, dan eksekusi langsung per chain.",
    icon: ArrowLeftRight,
    iconClassName: "border border-alpha-border bg-[color:var(--alpha-hover-soft)] text-[var(--alpha-highlight)]",
    tools: dexTools,
  },
  {
    key: "bridge",
    title: "Cross-Chain Bridges",
    note: "Daftar bridge yang lebih practical buat pindah aset antar chain tanpa slot kosong.",
    icon: Layers,
    iconClassName: "border border-alpha-border bg-[color:var(--alpha-hover-soft)] text-[var(--alpha-highlight)]",
    tools: bridgeTools,
  },
  {
    key: "aggregator",
    title: "Aggregators",
    note: "Router dan meta-layer buat cari rate, route, dan jalur bridge yang lebih efisien.",
    icon: Zap,
    iconClassName: "border border-alpha-border bg-[color:var(--alpha-hover-soft)] text-[var(--alpha-highlight)]",
    tools: aggregatorTools,
  },
] as const;

export function SwapPage() {
  const totalTools = swapSections.reduce((sum, section) => sum + section.tools.length, 0);
  const curatedDesk = [dexTools[1], bridgeTools[1], aggregatorTools[3]].filter(Boolean);

  const renderToolCard = (tool: SwapTool, index: number) => (
    <a
      key={tool.name}
      href={tool.url}
      target="_blank"
      rel="noreferrer"
      style={
        {
          borderColor: "var(--alpha-border)",
          background: "linear-gradient(160deg, color-mix(in srgb, var(--alpha-surface) 98%, transparent), color-mix(in srgb, var(--alpha-panel) 94%, transparent))",
          boxShadow: "var(--alpha-shadow)",
          "--mac-delay": `${index * 22}ms`,
        } as CSSProperties
      }
      className="macos-premium-card macos-card-entry group relative block min-h-[148px] overflow-hidden rounded-[1.45rem] border p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--alpha-border-strong)] hover:shadow-lg"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-70"
        style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--alpha-text) 6%, transparent) 0%, transparent 72%)" }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border text-sm font-semibold uppercase tracking-[0.18em] ${
              "border-[var(--alpha-border)] bg-[color:var(--alpha-hover-soft)]"
            }`}
            style={{ color: "var(--alpha-text)" }}
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
              style={{ color: "var(--alpha-text)" }}
            >
              {getToolInitials(tool.name)}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate text-[15px] font-semibold alpha-text">{tool.name}</h3>
              <ArrowUpRight
                className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                style={{ color: "var(--alpha-text)" }}
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
          style={{ background: "color-mix(in srgb, var(--alpha-text) 45%, transparent)" }}
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
                <ArrowLeftRight className="h-3.5 w-3.5" />
                DeFi Hub
              </div>
              <h1 className="macos-page-title">Swap &amp; Bridge</h1>
              <p className="macos-page-subtitle">
                Daftar DEX, bridge, dan aggregator
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="macos-card rounded-[1.2rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Total venues</p>
                <p className="mt-2 text-[1.55rem] font-semibold alpha-text">{totalTools}</p>
              </div>
              <div className="macos-card rounded-[1.2rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">DEX stack</p>
                <p className="mt-2 text-[1.55rem] font-semibold alpha-text">{dexTools.length}</p>
              </div>
              <div className="macos-card rounded-[1.2rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Bridge routes</p>
                <p className="mt-2 text-[1.55rem] font-semibold alpha-text">{bridgeTools.length}</p>
              </div>
              <div className="macos-card rounded-[1.2rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Aggregators</p>
                <p className="mt-2 text-[1.55rem] font-semibold alpha-text">{aggregatorTools.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mb-7 overflow-hidden rounded-[1.6rem] border p-5"
          style={{
            borderColor: "var(--alpha-border)",
            background: "linear-gradient(135deg, color-mix(in srgb, var(--alpha-surface) 98%, transparent), color-mix(in srgb, var(--alpha-panel) 92%, transparent))",
            boxShadow: "var(--alpha-shadow)",
          }}
        >
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] alpha-text-muted">
                <Sparkles className="h-3.5 w-3.5 alpha-text" />
                Curated desk
              </div>
              <h2 className="mt-3 text-2xl font-semibold alpha-text">Venue yang paling kepakai buat route cepat</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 alpha-text-muted">
               
              </p>
            </div>

            <div className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
              {curatedDesk.length} focus routes
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {curatedDesk.map((tool, index) => renderToolCard(tool, index))}
          </div>
        </section>

        <div className="mt-8 space-y-8">
          {swapSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon;

            return (
              <section key={section.key}>
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${section.iconClassName}`}>
                      <SectionIcon className="h-4 w-4 alpha-text" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xs font-mono font-bold uppercase tracking-widest alpha-text">
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
                    <Sparkles className="h-3.5 w-3.5 alpha-text" />
                    Curated routes
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {section.tools.map((tool, index) =>
                    renderToolCard(
                      tool,
                      index + sectionIndex * 24
                    )
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
