import { useTheme } from "@/contexts/ThemeContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ExternalLink } from "lucide-react";

type Network = {
  name: string;
  description: string;
  url: string;
  logo: string;
  type: "address" | "tool";
};

export function ScreeningAddressPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const networks: Network[] = [
    // 🔗 ADDRESS SCANNERS
    {
      name: "Ethereum",
      description: "Scan ERC-20 assets and transactions.",
      url: "https://etherscan.io/address/",
      logo: "/logos/ethereum.png",
      type: "address",
    },
    {
      name: "Base",
      description: "Track Base wallet activity.",
      url: "https://basescan.org/address/",
      logo: "/logos/base.png",
      type: "address",
    },
    {
      name: "Arbitrum",
      description: "Monitor Arbitrum transactions.",
      url: "https://arbiscan.io/address/",
      logo: "/logos/arbitrum.png",
      type: "address",
    },
    {
      name: "Polygon",
      description: "View Polygon token transfers.",
      url: "https://polygonscan.com/address/",
      logo: "/logos/polygon.png",
      type: "address",
    },
    {
      name: "BNB Chain",
      description: "Analyze BSC wallet data.",
      url: "https://bscscan.com/address/",
      logo: "/logos/bnbchain.png",
      type: "address",
    },
    {
      name: "Solana",
      description: "Inspect Solana accounts.",
      url: "https://solscan.io/account/",
      logo: "/logos/solana.png",
      type: "address",
    },
    {
      name: "Sui",
      description: "Track Sui on-chain activity.",
      url: "https://suiscan.xyz/mainnet/account/",
      logo: "/logos/sui.png",
      type: "address",
    },

    // 🔥 TOOLS
    {
      name: "Jupiter",
      description: "Swap tokens & analyze Solana liquidity.",
      url: "https://jup.ag",
      logo: "/logos/jupiter.png",
      type: "tool",
    },
    {
      name: "DexScreener",
      description: "Monitor token liquidity & live trading data.",
      url: "https://dexscreener.com",
      logo: "/logos/dex.png",
      type: "tool",
    },
  ];

  const addressNetworks = networks.filter(n => n.type === "address");
  const toolNetworks = networks.filter(n => n.type === "tool");

  const cardBase =
    "relative p-6 rounded-xl border transition-all duration-300 ease-out overflow-hidden group";

  const cardTheme = isDark
    ? "bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50 hover:shadow-[0_0_20px_rgba(0,255,136,0.08)]"
    : "bg-white border-[#E5E7EB] hover:border-[#2563EB]/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.08)]";

  const handleClick = (network: Network) => {
    if (network.type === "tool") {
      window.open(network.url, "_blank");
      return;
    }

    const address = prompt("Enter wallet address:");
    if (!address) return;

    window.open(network.url + address, "_blank");
  };

  const renderCard = (network: Network) => (
    <div
      key={network.name}
      className={`${cardBase} ${cardTheme}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            isDark ? "bg-[#0B0F14]" : "bg-[#F3F4F6]"
          }`}
        >
          <img
            src={network.logo}
            alt={network.name}
            className="w-8 h-8 object-contain"
          />
        </div>

        <p
          className={`font-mono text-sm font-bold ${
            isDark ? "text-[#E5E7EB]" : "text-[#111827]"
          }`}
        >
          {network.name}
        </p>
      </div>

      <p
        className={`font-mono text-xs mb-6 ${
          isDark ? "text-[#6B7280]" : "text-[#6B7280]"
        }`}
      >
        {network.description}
      </p>

      <button
        onClick={() => handleClick(network)}
        className={`flex items-center gap-2 font-mono text-xs transition-all duration-200 ${
          isDark
            ? "text-[#00FF88] hover:opacity-80"
            : "text-[#2563EB] hover:opacity-80"
        }`}
      >
        {network.type === "tool" ? "Open Tool" : "Scan Address"}
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className={`text-3xl font-bold font-mono mb-3 ${
            isDark ? "text-[#E5E7EB]" : "text-[#111827]"
          }`}>
            Screening Center
          </h1>

          <p className={`font-mono text-sm ${
            isDark ? "text-[#6B7280]" : "text-[#6B7280]"
          }`}>
            Multi-chain wallet inspection & trading analysis tools.
          </p>
        </div>

        {/* ADDRESS SECTION */}
        <div className="mb-12">
          <h2 className={`font-mono text-xs mb-6 tracking-widest ${
            isDark ? "text-[#00FF88]" : "text-[#2563EB]"
          }`}>
            BLOCKCHAIN EXPLORERS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addressNetworks.map(renderCard)}
          </div>
        </div>

        {/* TOOLS SECTION */}
        <div>
          <h2 className={`font-mono text-xs mb-6 tracking-widest ${
            isDark ? "text-[#00FF88]" : "text-[#2563EB]"
          }`}>
            TRADING & ANALYTICS TOOLS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {toolNetworks.map(renderCard)}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}