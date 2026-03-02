// src/components/ui/AirdropClaimCard.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AirdropClaimCardProps {
  airdrop: {
    id: string;
    name: string;
    logo: string;
    type: 'Airdrop' | 'Points';
    value: string;
    claimable: boolean;
  };
  onClaim: () => void;
}

export function AirdropClaimCard({ airdrop, onClaim }: AirdropClaimCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 ${
      isDark 
        ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50' 
        : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/50'
    }`}>
      {/* Logo */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
        isDark ? 'bg-[#0B0F14]' : 'bg-[#F3F4F6]'
      }`}>
        {airdrop.logo ? (
          <img src={airdrop.logo} alt={airdrop.name} className="w-full h-full object-cover" />
        ) : (
          <span className={`text-xl font-bold ${
            isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'
          }`}>
            {airdrop.name[0].toUpperCase()}
          </span>
        )}
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-mono font-bold truncate ${
          isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
        }`}>
          {airdrop.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className={`font-mono text-xs ${
            airdrop.type === 'Airdrop'
              ? isDark 
                ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20' 
                : 'bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/30'
              : isDark 
                ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' 
                : 'bg-[#EA580C]/10 text-[#EA580C] border-[#EA580C]/30'
          }`}>
            {airdrop.type}
          </Badge>
          <span className={`font-mono text-xs ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
            {airdrop.value}
          </span>
        </div>
      </div>
      
      {/* Action */}
      <Button
        onClick={onClaim}
        disabled={!airdrop.claimable}
        className={`font-mono text-xs border transition-all duration-200 flex-shrink-0 ${
          airdrop.claimable
            ? isDark 
              ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90' 
              : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90'
            : isDark 
              ? 'bg-transparent border-[#1F2937] text-[#6B7280] cursor-not-allowed' 
              : 'bg-transparent border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
        }`}
      >
        Claim Now
      </Button>
    </div>
  );
}