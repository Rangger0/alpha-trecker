import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  LayoutGrid,
  Twitter,
  ArrowUpRight
} from 'lucide-react';
import { useAirdrops } from '@/hooks/use-airdrops';
import { PREDEFINED_ECOSYSTEMS } from '@/lib/ecosystems';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const logoMap: Record<string, string> = {
  eth: "ethereum",
  sol: "solana",
  arb: "arbitrum",
  avax: "avalanche",
  matic: "polygon",
  ftm: "fantom",
  tia: "celestia",
  bnb: "bnbchain",
};

export function EcosystemPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { airdrops } = useAirdrops();
  
  const [searchQuery, setSearchQuery] = useState('');

  const getEcosystemStats = (ecosystemId: string) => {
    const assigned = airdrops.filter(a => a.ecosystemId === ecosystemId);
    const totalTasks = assigned.reduce((sum, a) => sum + a.tasks.length, 0);
    const completedTasks = assigned.reduce((sum, a) => sum + a.tasks.filter(t => t.completed).length, 0);
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return { count: assigned.length, progress };
  };

  const filteredEcosystems = PREDEFINED_ECOSYSTEMS.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-2xl font-bold mb-1 font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
            Ecosystems
          </h1>
          <p className={`text-sm font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
            Track your airdrops by blockchain ecosystem
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 flex justify-end">
          <div className="relative w-full max-w-md group">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-[#6B7280] group-focus-within:text-[#00FF88]' : 'text-[#6B7280] group-focus-within:text-[#2563EB]'}`} />
            <Input
              placeholder="Search ecosystems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 font-mono border-2 transition-all ${isDark ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'}`}
            />
          </div>
        </div>

        {/* Grid - 3 columns like screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEcosystems.map((ecosystem, index) => {
            const stats = getEcosystemStats(ecosystem.id);
            
            return (
              <motion.div
                key={ecosystem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/ecosystem/${ecosystem.id}`)}
                className={`
                  relative p-5 rounded-xl border overflow-hidden group cursor-pointer
                  transition-all duration-300 ease-out
                  transform hover:-translate-y-1 hover:shadow-xl
                  ${isDark
                    ? "bg-[#161B22] border-[#1F2937] hover:border-[#1F2937]"
                    : "bg-white border-[#E5E7EB] hover:border-[#E5E7EB]"}
                `}
                style={{ borderLeft: `3px solid ${ecosystem.color}` }}
              >
                {/* Glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${ecosystem.color}08 0%, transparent 50%)`
                  }}
                />

                {/* Top Section */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div 
                      className="w-12 h-12 rounded-xl overflow-hidden border flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ background: isDark ? '#0B0F14' : '#F3F4F6', borderColor: isDark ? '#1F2937' : '#E5E7EB' }}
                    >
                      <img
                        src={`/logos/${(logoMap[ecosystem.id] || ecosystem.id).toLowerCase()}.png`}
                        alt={ecosystem.name}
                        className="w-7 h-7 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          // Show fallback icon
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.innerHTML = `<span style="color: ${ecosystem.color}; font-size: 20px; font-weight: bold;">${ecosystem.icon}</span>`;
                          }
                        }}
                      />
                    </div>
                    
                    {/* Twitter Handle */}
                    <a 
                      href={`https://twitter.com/${ecosystem.twitterHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs font-mono flex items-center gap-1 transition-colors ${isDark ? 'text-[#6B7280] hover:text-[#00FF88]' : 'text-[#6B7280] hover:text-[#2563EB]'}`}
                    >
                      <Twitter className="w-3 h-3" />
                      @{ecosystem.twitterHandle}
                    </a>
                  </div>

                  {/* Arrow */}
                  <div 
                    className={`p-1.5 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                      isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                    <p className={`text-[10px] font-mono mb-1 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>Projects</p>
                    <p className="text-xl font-bold font-mono" style={{ color: ecosystem.color }}>
                      {stats.count}
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                    <p className={`text-[10px] font-mono mb-1 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>Progress</p>
                    <p className="text-xl font-bold font-mono" style={{ color: ecosystem.color }}>
                      {stats.progress}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#0B0F14]' : 'bg-[#F3F4F6]'}`}>
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.progress}%`, backgroundColor: ecosystem.color }}
                  />
                </div>

                {/* Bottom accent line */}
                <div 
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: ecosystem.color }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredEcosystems.length === 0 && (
          <div className="py-16 text-center border-2 border-dashed rounded-xl border-[#1F2937]">
            <LayoutGrid className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'}`} />
            <h3 className={`font-mono font-bold mb-2 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>No Ecosystems Found</h3>
            <p className="font-mono text-sm text-[#6B7280]">
              Try adjusting your search query.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}