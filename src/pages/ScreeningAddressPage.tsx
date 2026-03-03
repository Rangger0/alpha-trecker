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
    {
      name: "JUP",
      description: "Analyze Jupiter swap & token activity.",
      url: "https://jup.ag",
      logo: "/logos/jupiter.png",
      type: "tool",
    },
    {
      name: "DEX",
      description: "Monitor token liquidity & live trading data.",
      url: "https://dexscreener.com",
      logo: "/logos/dex.png",
      type: "tool",
    },
  ];

  const cardBaseClasses =
    "relative p-6 rounded-xl border transition-all duration-300 ease-out overflow-hidden group";

  const cardThemeClasses = isDark
    ? "bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]"
    : "bg-white border-[#E5E7EB] hover:border-[#2563EB]/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]";

  const handleScan = (network: Network) => {
    if (network.type === "tool") {
      window.open(network.url, "_blank");
      return;
    }

    const address = prompt("Enter wallet address:");
    if (!address) return;

    window.open(network.url + address, "_blank");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-105 ${
              isDark
                ? "bg-[#161B22] border border-[#1F2937]"
                : "bg-white border border-[#E5E7EB]"
            }`}
          >
            <img
              src="/logo.png"
              alt="Screening"
              className="w-12 h-12 object-contain"
            />
          </div>

          <h1
            className={`text-3xl font-bold font-mono mb-3 ${
              isDark ? "text-[#E5E7EB]" : "text-[#111827]"
            }`}
          >
            Screening Address
          </h1>

          <p
            className={`font-mono text-sm max-w-xl mx-auto ${
              isDark ? "text-[#6B7280]" : "text-[#6B7280]"
            }`}
          >
            Analyze wallet activity across multiple blockchains.
            Quickly inspect token balances, transaction history, NFT ownership,
            and smart contract interactions from major Web3 ecosystems.
          </p>
        </div>

        {/* Network Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {networks.map((network) => (
            <div
              key={network.name}
              className={`${cardBaseClasses} ${cardThemeClasses}`}
            >
              <div
                className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${
                  isDark
                    ? "from-[#00FF88]/20 via-transparent to-[#00FF88]/20"
                    : "from-[#2563EB]/20 via-transparent to-[#2563EB]/20"
                }`}
              />

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
                onClick={() => handleScan(network)}
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
          ))}
        </div>

        {/* Footer */}
        <div
          className={`text-center mt-12 font-mono text-xs ${
            isDark ? "text-[#6B7280]" : "text-[#9CA3AF]"
          }`}
        >
          <p>Multi-chain wallet inspection tool integrated into ALPHA_TRACKER.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}