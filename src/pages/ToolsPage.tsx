import { useTheme } from "@/contexts/ThemeContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowUpRight, Search,   TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

type Tool = {
  name: string;
  description: string;
  url: string;
  logo: string;
  accent: string;
  category: string;
};

export function ToolsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const researchTools: Tool[] = [
    {
      name: "CoinGecko",
      description: "Crypto price tracking, market cap & research platform",
      url: "https://coingecko.com",
      logo: "/logos/coingecko.png",
      accent: "#8cfa05",
      category: "Research"
    },
    {
      name: "CoinMarketCap",
      description: "Market data, token research & cryptocurrency rankings",
      url: "https://coinmarketcap.com",
      logo: "/logos/cmc.png",
      accent: "#3861FB",
      category: "Research"
    },
    {
      name: "DefiLlama",
      description: "DeFi analytics, TVL tracking & airdrop opportunities",
      url: "https://defillama.com",
      logo: "/logos/defillama.png",
      accent: "#007bff",
      category: "Research"
    },
    {
      name: "Dune Analytics",
      description: "On-chain data analytics & custom queries",
      url: "https://dune.com",
      logo: "/logos/dune.png",
      accent: "#c5c5c5",
      category: "Research"
    },
    {
      name: "Token Terminal",
      description: "Crypto fundamentals analysis & metrics",
      url: "https://tokenterminal.com",
      logo: "/logos/tokenterminal.png",
      accent: "#00d4c2",
      category: "Research"
    },
    {
      name: "Messari",
      description: "Crypto research, intelligence & market insights",
      url: "https://messari.io",
      logo: "/logos/messari.png",
      accent: "#00a2ff",
      category: "Research"
    },
    {
      name: "CryptoCompare",
      description: "Crypto comparison, prices & portfolio tracking",
      url: "https://cryptocompare.com",
      logo: "/logos/cryptocompare.png",
      accent: "#0084f8",
      category: "Research"
    },
    {
      name: "CoinCodex",
      description: "Crypto prices, charts & market analysis",
      url: "https://coincodex.com",
      logo: "/logos/coincodex.png",
      accent: "#10B981",
      category: "Research"
    },
  ];

  const airdropTools: Tool[] = [
    {
      name: "Airdrops.io",
      description: "Latest airdrop listings, guides & farming",
      url: "https://airdrops.io",
      logo: "/logos/airdrops.png",
      accent: "#005688",
      category: "Airdrop"
    },
    {
      name: "Bankless",
      description: "Check unclaimed airdrops & eligibility",
      url: "https://www.bankless.com",
      logo: "/logos/bank.png",
      accent: "#f90202",
      category: "Airdrop"
    },
    {
      name: "Dropsearn",
      description: "Airdrop farming tracker & opportunities",
      url: "https://dropsearn.com",
      logo: "/logos/dropsearn.png",
      accent: "#00fa79",
      category: "Airdrop"
    },
    {
      name: "Airdrop Alert",
      description: "Latest airdrop opportunities & notifications",
      url: "https://airdropalert.com",
      logo: "/logos/airdropalert.png",
      accent: "#08eacb",
      category: "Airdrop"
    },
    {
      name: "AirdropsMob",
      description: "Airdrop calendar & farming guides",
      url: "https://airdropsmob.com",
      logo: "/logos/airdropsmob.png",
      accent: "#f7ca15",
      category: "Airdrop"
    },
    {
      name: "FreeAirdrop",
      description: "Free crypto airdrops & bounties",
      url: "https://freeairdrop.io",
      logo: "/logos/freeairdrop.png",
      accent: "#f65082",
      category: "Airdrop"
    },
  ];

  const handleClick = (url: string) => {
    window.open(url, "_blank");
  };

  const renderToolCard = (tool: Tool, index: number) => (
    <motion.div
      key={tool.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => handleClick(tool.url)}
      style={{
        borderLeft: `3px solid ${tool.accent}` }}
      className={`
        relative p-4 rounded-lg border overflow-hidden group
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
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-2xl font-bold mb-1 font-mono ${
            isDark ? "text-[#E5E7EB]" : "text-[#111827]"
          }`}>
            Research Tools
          </h1>
          <p className={`text-sm font-mono ${isDark ? "text-[#6B7280]" : "text-[#6B7280]"}`}>
            Complete toolkit for crypto research, token analysis & market insights.
          </p>
        </div>

        {/* Crypto Research Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Search className="w-4 h-4 text-blue-500" />
            </div>
            <h2 className={`text-xs font-mono font-bold tracking-widest uppercase ${
              isDark ? "text-[#00FF88]" : "text-[#10B981]"
            }`}>
              Crypto Research
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {researchTools.map((tool, index) => renderToolCard(tool, index))}
          </div>
        </div>

        {/* Airdrop Research Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
            </div>
            <h2 className={`text-xs font-mono font-bold tracking-widest uppercase ${
              isDark ? "text-[#00FF88]" : "text-[#10B981]"
            }`}>
              Airdrop Research
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {airdropTools.map((tool, index) => renderToolCard(tool, index + researchTools.length))}
            
            {/* Fill empty slots */}
            <div className={`
              p-4 rounded-lg border border-dashed min-h-[80px] flex items-center justify-center
              ${isDark ? 'border-[#1F2937] bg-[#161B22]/30' : 'border-[#E5E7EB] bg-gray-50/50'}
            `}>
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
            
            <div className={`
              p-4 rounded-lg border border-dashed min-h-[80px] flex items-center justify-center
              ${isDark ? 'border-[#1F2937] bg-[#161B22]/30' : 'border-[#E5E7EB] bg-gray-50/50'}
            `}>
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