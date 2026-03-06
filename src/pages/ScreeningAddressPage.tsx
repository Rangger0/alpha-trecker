import { useTheme } from "@/contexts/ThemeContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {  ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

type Network = {
  name: string;
  description: string;
  url: string;
  logo: string;
  type: "screening" | "tools";
  accent: string;
};

export function ScreeningAddressPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const networks: Network[] = [
    {
      name: "Ethereum",
      description: "Scan ERC-20 assets and transactions.",
      url: "https://etherscan.io",
      logo: "/logos/ethereum.png",
      type: "screening",
      accent: "#627EEA" },
    {
      name: "Base",
      description: "Track Base wallet activity.",
      url: "https://basescan.org",
      logo: "/logos/base.png",
      type: "screening",
      accent: "#0052FF" },
    {
      name: "Arbitrum",
      description: "Monitor Arbitrum transactions.",
      url: "https://arbiscan.io",
      logo: "/logos/arbitrum.png",
      type: "screening",
      accent: "#28A0F0" },
    {
      name: "Polygon",
      description: "View Polygon token transfers.",
      url: "https://polygonscan.com",
      logo: "/logos/polygon.png",
      type: "screening",
      accent: "#8247E5" },
    {
      name: "BNB Chain",
      description: "Analyze BSC wallet data.",
      url: "https://bscscan.com",
      logo: "/logos/bnbchain.png",
      type: "screening",
      accent: "#F3BA2F" },
    {
      name: "Solana",
      description: "Inspect Solana accounts.",
      url: "https://solscan.io",
      logo: "/logos/solana.png",
      type: "screening",
      accent: "#14F195" },
    {
      name: "Sui",
      description: "Track Sui on-chain activity.",
      url: "https://suiscan.xyz",
      logo: "/logos/sui.png",
      type: "screening",
      accent: "#4DA2FF" },
  ];

  const screeningNetworks = networks.filter(n => n.type === "screening");
  const toolsNetworks = networks.filter(n => n.type === "tools");

  const handleClick = (network: Network) => {
    window.open(network.url, "_blank");
  };

  const renderCard = (network: Network, index: number) => (
    <motion.div
      key={network.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => handleClick(network)}
      style={{
        borderLeft: `3px solid ${network.accent}` }}
      className={`
        macos-premium-card relative p-4 overflow-hidden group
        transition-all duration-300 ease-out cursor-pointer
        transform hover:-translate-y-0.5
        ${isDark
          ? "bg-[#161B22] border-[#1F2937] hover:border-[#1F2937]"
          : "bg-white border-[#E5E7EB] hover:border-[#E5E7EB]"}
        hover:shadow-lg
      `}
    >
      {/* Subtle glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
        style={{
          background: `linear-gradient(135deg, ${network.accent}08 0%, transparent 50%)`
        }}
      />

      <div className="relative z-10 flex items-center gap-3">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
            isDark ? "bg-[#0B0F14]" : "bg-[#F3F4F6]"
          }`}
        >
          <img
            src={network.logo}
            alt={network.name}
            className="w-6 h-6 object-contain"
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
              {network.name}
            </h3>
            <ArrowUpRight 
              className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 ml-2"
              style={{ color: network.accent }}
            />
          </div>
          
          <p className={`text-xs truncate ${isDark ? "text-[#6B7280]" : "text-[#6B7280]"}`}>
            {network.description}
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div 
        className="absolute bottom-0 left-0 h-[2px] transition-all duration-500"
        style={{ 
          width: '0%',
          background: network.accent
        }}
      />
      <style>{`
        .group:hover > div:last-child {
          width: 100% !important;
        }
      `}</style>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <div className="macos-root macos-page-shell">
        {/* Header - Compact */}
        <div className="macos-page-header macos-animate-up">
          <div className="macos-page-kicker">
            <ArrowUpRight className="h-3.5 w-3.5" />
            On-chain Scanner
          </div>
          <h1 className="macos-page-title">Screening & Tools</h1>
          <p className="macos-page-subtitle">
            Explorer dan alat screening dalam tampilan panel macOS yang lebih padat, lembut, dan responsif.
          </p>
        </div>

        {/* Blockchain Explorers - 4 columns full width */}
        <div className="mb-6">
          <h2 className={`text-xs font-mono font-bold mb-3 tracking-widest uppercase ${
            isDark ? "text-[#00FF88]" : "text-[#10B981]"
          }`}>
            Blockchain Explorers
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {screeningNetworks.map((network, index) => renderCard(network, index))}
          </div>
        </div>

        {/* Trading & Analytics Tools - 4 columns */}
        <div>
          <h2 className={`text-xs font-mono font-bold mb-3 tracking-widest uppercase ${
            isDark ? "text-[#00FF88]" : "text-[#10B981]"
          }`}>
            Trading & Analytics Tools
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {toolsNetworks.map((network, index) => renderCard(network, index + screeningNetworks.length))}
            
            {/* Placeholder cards to fill grid */}
            <div className="macos-empty-state flex min-h-[80px] items-center justify-center p-4">
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
            
            <div className="macos-empty-state flex min-h-[80px] items-center justify-center p-4">
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
