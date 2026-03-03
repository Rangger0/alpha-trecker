import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  LayoutGrid,
  Twitter,
  ArrowUpRight
} from 'lucide-react';
import { useAirdrops } from '@/hooks/use-airdrops';
import { PREDEFINED_ECOSYSTEMS } from '@/lib/ecosystems';
import { useNavigate } from 'react-router-dom';
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getEcosystemStats = (ecosystemId: string) => {
    const assigned = airdrops.filter(a => a.ecosystemId === ecosystemId);
    const totalTasks = assigned.reduce((sum, a) => sum + a.tasks.length, 0);
    const completedTasks = assigned.reduce((sum, a) => sum + a.tasks.filter(t => t.completed).length, 0);
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      count: assigned.length,
      progress
    };
  };

  const filteredEcosystems = PREDEFINED_ECOSYSTEMS.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold font-mono mb-2 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
              Ecosystems
            </h1>
            <p className={`font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
              Track your airdrops by blockchain ecosystem
            </p>
          </div>
          
          <div className="relative max-w-md group flex-1 sm:flex-none">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-[#6B7280] group-focus-within:text-[#00FF88]' : 'text-[#6B7280] group-focus-within:text-[#2563EB]'}`} />
            <Input
              placeholder="Search ecosystems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 font-mono border-2 transition-all ${isDark ? 'bg-[#161B22] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#00FF88]' : 'bg-white border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'}`}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEcosystems.map((ecosystem) => {
            const stats = getEcosystemStats(ecosystem.id);
            const isHovered = hoveredId === ecosystem.id;
            
            return (
              <div
                key={ecosystem.id}
                onClick={() => navigate(`/ecosystem/${ecosystem.id}`)}
                onMouseEnter={() => setHoveredId(ecosystem.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative group cursor-pointer rounded-2xl border overflow-hidden transition-all duration-500 ${
                  isDark 
                    ? 'bg-[#161b220e] border-[#1f293714] hover:border-[#00FF88]/50' 
                    : 'bg-white border-[#e5e7eb12] hover:border-[#2563EB]/50'
                } ${isHovered ? 'transform -translate-y-2 shadow-2xl' : ''}`}
              >
                
                {/* Animated Background */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                  style={{ 
                    background: `radial-gradient(circle at 50% 0%, ${ecosystem.color}20 0%, transparent 70%)`
                  }}
                />

                {/* Shine Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `linear-gradient(105deg, transparent 40%, ${ecosystem.color}10 50%, transparent 60%)`,
                    transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
                    transition: 'transform 0.8s ease-out, opacity 0.3s'
                  }}
                />

                <div className="relative p-6">

                  {/* Top */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">

                      {/* Logo */}
                      <div 
                        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                          isHovered ? 'scale-110 shadow-lg' : ''
                        }`}
                        style={{ 
                          backgroundColor: isDark ? '#0b0f1414' : '#f3f4f616',
                          borderColor: isDark ? '#1f29371e' : '#e5e7eb11',
                          boxShadow: isHovered ? `0 0 30px ${ecosystem.color}40` : 'none'
                        }}
                      >
                        <img
  src={`/logos/${(logoMap[ecosystem.id] || ecosystem.id).toLowerCase()}.png`}
  alt={ecosystem.name}
  className="w-10 h-10 object-contain"
  onError={(e) => {
    e.currentTarget.style.display = "none";
  }}
/>
                      </div>

                      {/* Twitter */}
                      <a 
                        href={`https://twitter.com/${ecosystem.twitterHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`text-sm font-mono flex items-center gap-1 transition-all duration-300 hover:gap-2 ${
                          isDark ? 'text-[#6B7280] hover:text-[#00FF88]' : 'text-[#6B7280] hover:text-[#2563EB]'
                        }`}
                      >
                        <Twitter className="w-3 h-3" />
                        @{ecosystem.twitterHandle}
                      </a>
                    </div>

                    {/* Arrow */}
                    <div 
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isHovered 
                          ? isDark ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'bg-[#2563EB]/10 text-[#2563EB]'
                          : isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                      } ${isHovered ? 'translate-x-1 -translate-y-1' : ''}`}
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className={`px-4 py-3 rounded-xl border ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                      <p className="text-xs font-mono mb-1 text-[#6B7280]">Projects</p>
                      <p className="text-2xl font-bold font-mono" style={{ color: ecosystem.color }}>
                        {stats.count}
                      </p>
                    </div>

                    <div className={`px-4 py-3 rounded-xl border ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                      <p className="text-xs font-mono mb-1 text-[#6B7280]">Progress</p>
                      <p className="text-2xl font-bold font-mono" style={{ color: ecosystem.color }}>
                        {stats.progress}%
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-[#0B0F14]' : 'bg-[#F3F4F6]'}`}>
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${stats.progress}%`, 
                        backgroundColor: ecosystem.color
                      }}
                    />
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Empty */}
        {filteredEcosystems.length === 0 && (
          <Card className={`border-2 ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}`}>
            <CardContent className="p-12 text-center">
              <LayoutGrid className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'}`} />
              <h3 className={`font-mono font-bold mb-2 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>No Ecosystems Found</h3>
              <p className="font-mono text-sm text-[#6B7280]">
                Try adjusting your search query.
              </p>
            </CardContent>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
}