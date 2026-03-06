import { useTheme } from "@/contexts/ThemeContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
<div className="flex-shrink-0 h-16 flex items-center gap-3 px-4 border-b" style={{ borderColor: 'var(--alpha-border)' }}>
  <img src="/logo.png" alt="Alpha Tracker" className="h-8 w-8" />
  <span className="font-bold font-mono text-lg alpha-text tracking-tighter">
    ALPHA<span className="alpha-text-muted">_TRACKER</span>
  </span>
</div>
import { ArrowUpRight, ArrowLeftRight, Layers, Zap } from "lucide-react";
import { motion } from "framer-motion";

type SwapTool = {
  name: string;
  description: string;
  url: string;
  logo: string;
  accent: string;
  category: string;
};

export function SwapPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const dexTools: SwapTool[] = [
    {
      name: "Uniswap",
      description: "Decentralized exchange on Ethereum",
      url: "https://app.uniswap.org",
      logo: "/logos/uniswap.png",
      accent: "#ff2ced",
      category: "DEX"
    },
    {
      name: "Jupiter",
      description: "Best swap rates on Solana",
      url: "https://jup.ag",
      logo: "/logos/jupiter.png",
      accent: "#00fc9f",
      category: "DEX"
    },
    {
      name: "DEX Screener",
      description: "Realtime DEX analytics",
      url: "https://dexscreener.com",
      logo: "/logos/dex.png",
      accent: "#000000",
      category: "DEX"
    },
    {
      name: "Hyperliquid",
      description: "The blockchain to house all finance. Trade, build apps, and launch tokens on the same hyper-performant chain",
      url: "https://hyperfoundation.org",
      logo: "/logos/hyp.png",
      accent: "#72ffcb",
      category: "DEX"
    },
    {
      name: "Aster",
      description: "The Next-Gen Perp DEX for All Traders",
      url: "https://www.asterdex.com/en",
      logo: "/logos/aster.png",
      accent: "#ffd498",
      category: "DEX"
    },
    {
      name: "Lighter",
      description: "Trade digital assets with low costs and low latency on Ethereum L2 with custom ZK circuits for verifiable matching and liquidations",
      url: "https://lighter.xyz",
      logo: "/logos/light.png",
      accent: "#000000",
      category: "DEX"
    },
    {
      name: "1inch",
      description: "DEX aggregator for best prices",
      url: "https://1inch.io",
      logo: "/logos/1inch.png",
      accent: "#000000",
      category: "DEX"
    },
    {
      name: "PancakeSwap",
      description: "DEX on BNB Chain",
      url: "https://pancakeswap.finance",
      logo: "/logos/pancake.png",
      accent: "#1FC7D4",
      category: "DEX"
    },
    {
      name: "SushiSwap",
      description: "Multi-chain DEX",
      url: "https://sushi.com",
      logo: "/logos/sushi.png",
      accent: "#FA52A0",
      category: "DEX"
    },
    {
      name: "Curve",
      description: "Stablecoin exchange",
      url: "https://curve.fi",
      logo: "/logos/curve.png",
      accent: "#FF8C00",
      category: "DEX"
    },
    {
      name: "Balancer",
      description: "Automated portfolio manager",
      url: "https://balancer.fi",
      logo: "/logos/balancer.png",
      accent: "#1E1E1E",
      category: "DEX"
    },
    {
      name: "TraderJoe",
      description: "DEX on Avalanche",
      url: "https://traderjoexyz.com",
      logo: "/logos/traderjoe.png",
      accent: "#9151ff",
      category: "DEX"
    },
  ];

  const bridgeTools: SwapTool[] = [
    {
      name: "Stargate",
      description: "Cross-chain bridge for tokens",
      url: "https://stargate.finance",
      logo: "/logos/stargate.png",
      accent: "#a7a7a7",
      category: "Bridge"
    },
    {
      name: "Across",
      description: "Fast and cheap bridging",
      url: "https://across.to",
      logo: "/logos/across.png",
      accent: "#00ffea",
      category: "Bridge"
    },
    {
      name: "Orbiter",
      description: "Layer 2 bridge solution",
      url: "https://orbiter.finance",
      logo: "/logos/orbiter.png",
      accent: "#e4e4e4",
      category: "Bridge"
    },
    {
      name: "Hop",
      description: "Token bridge for L2s",
      url: "https://hop.exchange",
      logo: "/logos/hop.png",
      accent: "#e48afffc",
      category: "Bridge"
    },
    {
      name: "Synapse",
      description: "Cross-chain liquidity",
      url: "https://synapseprotocol.com",
      logo: "/logos/synapse.png",
      accent: "#a200f9",
      category: "Bridge"
    },
    {
      name: "LayerZero",
      description: "Omnichain interoperability",
      url: "https://layerzero.network",
      logo: "/logos/layerzero.png",
      accent: "#000000",
      category: "Bridge"
    },
  ];

  const aggregatorTools: SwapTool[] = [
    {
      name: "Matcha",
      description: "DEX aggregator with best rates",
      url: "https://matcha.xyz",
      logo: "/logos/matcha.png",
      accent: "#06f686",
      category: "Aggregator"
    },
    {
      name: "ParaSwap",
      description: "DeFi aggregator",
      url: "https://paraswap.io",
      logo: "/logos/paraswap.png",
      accent: "#ff9100",
      category: "Aggregator"
    },
    {
      name: "OpenOcean",
      description: "Cross-chain swap aggregator",
      url: "https://openocean.finance",
      logo: "/logos/openocean.png",
      accent: "#000000",
      category: "Aggregator"
    },
    {
      name: "Li.Fi",
      description: "Advanced bridge & DEX aggregator",
      url: "https://li.fi",
      logo: "/logos/lifi.png",
      accent: "#f0acff",
      category: "Aggregator"
    },
  ];

  const handleClick = (url: string) => {
    window.open(url, "_blank");
  };

  const renderToolCard = (tool: SwapTool, index: number) => (
    <motion.div
      key={tool.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => handleClick(tool.url)}
      style={{
        borderLeft: `3px solid ${tool.accent}` }}
      className={`
        macos-premium-card relative p-4 overflow-hidden group
        transition-all duration-300 ease-out cursor-pointer
        transform hover:-translate-y-0.5 hover:shadow-lg
        ${isDark
          ? "bg-[#161B22] border-[#1F2937] hover:border-[#1F2937]"
          : "bg-white border-[#E5E7EB] hover:border-[#E5E7EB]"}
      `}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
        style={{
          background: `linear-gradient(135deg, ${tool.accent}08 0%, transparent 50%)`
        }}
      />

      <div className="relative z-10 flex items-center gap-3">
        {/* Icon/Logo */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
            isDark ? "bg-[#0B0F14]" : "bg-[#F3F4F6]"
          }`}
        >
          <img
            src={tool.logo}
            alt={tool.name}
            className="w-6 h-6 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `<div class="w-6 h-6 rounded-full" style="background: ${tool.accent}"></div>`;
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h3
              className={`font-bold text-sm truncate ${
                isDark ? "text-[#E5E7EB]" : "text-[#111827]"
              }`}
            >
              {tool.name}
            </h3>
            <ArrowUpRight 
              className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 ml-2"
              style={{ color: tool.accent }}
            />
          </div>
          
          <p className={`text-xs truncate ${isDark ? "text-[#6B7280]" : "text-[#6B7280]"}`}>
            {tool.description}
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div 
        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
        style={{ background: tool.accent }}
      />
    </motion.div>
  );

  return (
    <DashboardLayout>
      <div className="macos-root macos-page-shell">
        {/* Header */}
        <div className="macos-page-header macos-animate-up">
          <div className="macos-page-kicker">
            <ArrowLeftRight className="h-3.5 w-3.5" />
            DeFi Hub
          </div>
          <h1 className="macos-page-title">
            Swap & Bridge
          </h1>
          <p className="macos-page-subtitle">
            Best DEXs, bridges & aggregators for cheap token swaps.
          </p>
        </div>

        {/* DEX Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 text-pink-500" />
            </div>
            <h2 className={`text-xs font-mono font-bold tracking-widest uppercase ${
              isDark ? "text-[#00FF88]" : "text-[#10B981]"
            }`}>
              Decentralized Exchanges
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {dexTools.map((tool, index) => renderToolCard(tool, index))}
          </div>
        </div>

        {/* Bridge Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Layers className="w-4 h-4 text-blue-500" />
            </div>
            <h2 className={`text-xs font-mono font-bold tracking-widest uppercase ${
              isDark ? "text-[#00FF88]" : "text-[#10B981]"
            }`}>
              Cross-Chain Bridges
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {bridgeTools.map((tool, index) => renderToolCard(tool, index + dexTools.length))}
            
            {/* Fill empty slots */}
            <div className="macos-empty-state min-h-[80px] p-4 flex items-center justify-center">
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
            
            <div className="macos-empty-state min-h-[80px] p-4 flex items-center justify-center">
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
          </div>
        </div>

        {/* Aggregators Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-yellow-500" />
            </div>
            <h2 className={`text-xs font-mono font-bold tracking-widest uppercase ${
              isDark ? "text-[#00FF88]" : "text-[#10B981]"
            }`}>
              Aggregators
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {aggregatorTools.map((tool, index) => renderToolCard(tool, index + dexTools.length + bridgeTools.length))}
            
            {/* Fill empty slots */}
            <div className="macos-empty-state min-h-[80px] p-4 flex items-center justify-center">
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
            
            <div className="macos-empty-state min-h-[80px] p-4 flex items-center justify-center">
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
            
            <div className="macos-empty-state min-h-[80px] p-4 flex items-center justify-center">
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
            
            <div className="macos-empty-state min-h-[80px] p-4 flex items-center justify-center">
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}