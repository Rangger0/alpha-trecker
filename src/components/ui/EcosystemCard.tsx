// src/components/ui/EcosystemCard.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { ExternalLink, Bell } from 'lucide-react';

interface EcosystemCardProps {
  ecosystem: {
    id: string;
    name: string;
    icon: string;
    twitterHandle: string;
    date: string;
    progress: number;
    hasNotification?: boolean;
  };
  onViewDetail: () => void;
}

export function EcosystemCard({ ecosystem, onViewDetail }: EcosystemCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`relative p-5 rounded-xl border transition-all duration-300 group ${
      isDark 
        ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50' 
        : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/50'
    }`}>
      {/* Notification Badge */}
      {ecosystem.hasNotification && (
        <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${
          isDark ? 'bg-[#EF4444]' : 'bg-[#DC2626]'
        }`} />
      )}
      
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
          isDark ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'bg-[#2563EB]/10 text-[#2563EB]'
        }`}>
          {ecosystem.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-mono font-bold truncate ${
            isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
          }`}>
            {ecosystem.name}
          </h3>
          <a 
            href={`https://x.com/${ecosystem.twitterHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1 text-xs font-mono transition-colors ${
              isDark ? 'text-[#6B7280] hover:text-[#00FF88]' : 'text-[#6B7280] hover:text-[#2563EB]'
            }`}
          >
            <ExternalLink className="w-3 h-3" />
            @{ecosystem.twitterHandle}
          </a>
          <p className={`text-xs font-mono mt-1 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
            {ecosystem.date}
          </p>
        </div>
      </div>
      
      {/* Progress */}
      <div className="mb-4">
        <div className={`h-2 rounded-full overflow-hidden ${
          isDark ? 'bg-[#0B0F14]' : 'bg-[#F3F4F6]'
        }`}>
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              isDark ? 'bg-[#00FF88]' : 'bg-[#2563EB]'
            }`}
            style={{ width: `${ecosystem.progress}%` }}
          />
        </div>
      </div>
      
      {/* Action */}
      <Button
        onClick={onViewDetail}
        className={`w-full font-mono text-sm border transition-all duration-200 ${
          isDark 
            ? 'bg-transparent border-[#1F2937] text-[#E5E7EB] hover:bg-[#00FF88] hover:text-[#0B0F14] hover:border-[#00FF88]' 
            : 'bg-transparent border-[#E5E7EB] text-[#111827] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB]'
        }`}
      >
        View Detail
      </Button>
    </div>
  );
}