// src/components/ui/ProjectRow.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, ExternalLink, Wallet } from 'lucide-react';
import { useState } from 'react';

interface ProjectRowProps {
  project: {
    id: string;
    name: string;
    type: string;
    walletAddress?: string;
    officialLink?: string;
    status: string;
  };
  index: number;
  onAddPriority: () => void;
}

const TYPE_COLORS: Record<string, { dark: string; light: string }> = {
  'Testnet': { 
    dark: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20',
    light: 'bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/30'
  },
  'Waitlist': { 
    dark: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
    light: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30'
  },
  'Depin': { 
    dark: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
    light: 'bg-[#059669]/10 text-[#059669] border-[#059669]/30'
  },
  'Daily': { 
    dark: 'bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]/20',
    light: 'bg-[#DB2777]/10 text-[#DB2777] border-[#DB2777]/30'
  },
  'Quest': { 
    dark: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    light: 'bg-[#EA580C]/10 text-[#EA580C] border-[#EA580C]/30'
  },
};

const STATUS_COLORS: Record<string, { dark: string; light: string }> = {
  'On Going': { 
    dark: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
    light: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30'
  },
  'Completed': { 
    dark: 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/20',
    light: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
  },
  'Dropped': { 
    dark: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    light: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30'
  },
};

export function ProjectRow({ project, index, onAddPriority }: ProjectRowProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showMenu, setShowMenu] = useState(false);

  const typeColor = TYPE_COLORS[project.type] || TYPE_COLORS['Quest'];
  const statusColor = STATUS_COLORS[project.status] || STATUS_COLORS['On Going'];

  const formatWallet = (address: string) => {
    if (!address) return 'No address';
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <tr className={`border-b transition-colors ${
      isDark ? 'border-[#1F2937] hover:bg-[#161B22]' : 'border-[#E5E7EB] hover:bg-[#F9FAFB]'
    }`}>
      <td className="px-4 py-4">
        <span className={`font-mono text-sm ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
          {index + 1}
        </span>
      </td>
      
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${
            isDark ? 'bg-[#161B22] text-[#00FF88]' : 'bg-[#F3F4F6] text-[#2563EB]'
          }`}>
            {project.name[0].toUpperCase()}
          </div>
          <div>
            <p className={`font-mono font-medium ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
              {project.name}
            </p>
          </div>
        </div>
      </td>
      
      <td className="px-4 py-4">
        <Badge variant="outline" className={`font-mono text-xs ${isDark ? typeColor.dark : typeColor.light}`}>
          {project.type}
        </Badge>
      </td>
      
      <td className="px-4 py-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded border w-fit ${
          isDark ? 'bg-[#00FF88]/5 border-[#00FF88]/20' : 'bg-[#2563EB]/5 border-[#2563EB]/20'
        }`}>
          <Wallet className={`w-3.5 h-3.5 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`} />
          <span className={`font-mono text-xs ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>
            {formatWallet(project.walletAddress || '')}
          </span>
        </div>
      </td>
      
      <td className="px-4 py-4">
        {project.officialLink ? (
          <a 
            href={project.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 font-mono text-xs transition-colors ${
              isDark ? 'text-[#3B82F6] hover:text-[#00FF88]' : 'text-[#2563EB] hover:text-[#10B981]'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {project.officialLink.slice(0, 20)}...
          </a>
        ) : (
          <span className={`font-mono text-xs ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
            -
          </span>
        )}
      </td>
      
      <td className="px-4 py-4">
        <Badge variant="outline" className={`font-mono text-xs ${isDark ? statusColor.dark : statusColor.light}`}>
          {project.status}
        </Badge>
      </td>
      
      <td className="px-4 py-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className={`font-mono text-xs border ${
              isDark 
                ? 'border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10 hover:text-[#00FF88]' 
                : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10 hover:text-[#2563EB]'
            }`}
          >
            Add Priority
          </Button>
          
          {showMenu && (
            <div className={`absolute right-0 top-full mt-1 w-48 rounded-md border shadow-lg z-50 ${
              isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'
            }`}>
              <button
                onClick={() => {
                  onAddPriority();
                  setShowMenu(false);
                }}
                className={`w-full px-3 py-2 text-left font-mono text-sm transition-colors ${
                  isDark 
                    ? 'text-[#E5E7EB] hover:bg-[#00FF88]/10' 
                    : 'text-[#111827] hover:bg-[#2563EB]/10'
                }`}
              >
                Add to Priority
              </button>
              <button
                onClick={() => setShowMenu(false)}
                className={`w-full px-3 py-2 text-left font-mono text-sm transition-colors ${
                  isDark 
                    ? 'text-[#6B7280] hover:bg-[#1F2937]' 
                    : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                }`}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}