// src/pages/ClaimAirdropPage.tsx
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AirdropClaimCard } from '@/components/ui/AirdropClaimCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Gift, Search, Filter } from 'lucide-react';
import { useClaims } from '@/hooks/use-claims';

export function ClaimAirdropPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { claims } = useClaims();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClaims = claims.filter(claim => 
    claim.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Gift className={`w-5 h-5 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`} />
          <h1 className={`text-2xl font-bold font-mono ${
            isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
          }`}>
            Claim Airdrop
          </h1>
        </div>
        <p className={`font-mono text-sm ${
          isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
        }`}>
          No links for a source from official market data.
        </p>
      </div>

      {/* Search & Filter */}
      <div className={`p-4 rounded-xl border mb-6 flex flex-col sm:flex-row gap-4 ${
        isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'
      }`}>
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
          }`} />
          <Input
            placeholder="Search project name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 font-mono border ${
              isDark 
                ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB]' 
                : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827]'
            }`}
          />
        </div>
        <Button
          variant="outline"
          className={`font-mono border ${
            isDark 
              ? 'border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10' 
              : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10'
          }`}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Grid */}
      {filteredClaims.length === 0 ? (
        <EmptyState
          title="No Airdrops Available"
          description="Check back later for new airdrop opportunities."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClaims.map((claim) => (
            <AirdropClaimCard
              key={claim.id}
              airdrop={claim}
              onClaim={() => console.log('Claim:', claim.id)}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}