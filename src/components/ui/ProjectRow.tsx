// Updated menu colors to use alpha variables and improved stopPropagation
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Wallet } from 'lucide-react';
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
  /* ...same mapping as before... */
};

const STATUS_COLORS: Record<string, { dark: string; light: string }> = {
  /* ...same mapping as before... */
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
    <tr className={`border-b transition-colors ${isDark ? 'border-[#1F2937] hover:bg-[#161B22]' : 'border-[#E5E7EB] hover:bg-[#F9FAFB]'}`}>
      <td className="px-4 py-4"><span className={`font-mono text-sm ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>{index + 1}</span></td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${isDark ? 'bg-[#161B22] text-[#00FF88]' : 'bg-[#F3F4F6] text-[#2563EB]'}`}>
            {project.name[0].toUpperCase()}
          </div>
          <div>
            <p className={`font-mono font-medium ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>{project.name}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <Badge variant="outline" className={`font-mono text-xs ${isDark ? typeColor.dark : typeColor.light}`}>{project.type}</Badge>
      </td>

      <td className="px-4 py-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded border w-fit ${isDark ? 'bg-[#00FF88]/5 border-[#00FF88]/20' : 'bg-[#2563EB]/5 border-[#2563EB]/20'}`}>
          <Wallet className={`w-3.5 h-3.5 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`} />
          <span className={`font-mono text-xs ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>{formatWallet(project.walletAddress || '')}</span>
        </div>
      </td>

      <td className="px-4 py-4">
        {project.officialLink ? (
          <a href={project.officialLink} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 font-mono text-xs transition-colors ${isDark ? 'text-[#3B82F6] hover:text-[#00FF88]' : 'text-[#2563EB] hover:text-[#10B981]'}`}>
            <ExternalLink className="w-3.5 h-3.5" />
            {project.officialLink.slice(0, 20)}...
          </a>
        ) : (
          <span className={`font-mono text-xs ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>-</span>
        )}
      </td>

      <td className="px-4 py-4">
        <Badge variant="outline" className={`font-mono text-xs ${isDark ? statusColor.dark : statusColor.light}`}>{project.status}</Badge>
      </td>

      <td className="px-4 py-4">
        <div className="relative">
          <Button variant="ghost" size="sm" onClick={() => setShowMenu(!showMenu)} className={`font-mono text-xs border ${isDark ? 'border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10 hover:text-[#00FF88]' : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10 hover:text-[#2563EB]'}`}>
            Add Priority
          </Button>

          {showMenu && (
            <div
              className="absolute right-0 top-full mt-1 w-48 rounded-md border shadow-lg z-50"
              style={{ background: 'var(--alpha-surface)', borderColor: 'var(--alpha-border)', color: 'var(--alpha-text)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => { onAddPriority(); setShowMenu(false); }}
                className="w-full px-3 py-2 text-left font-mono text-sm transition-colors"
                style={{ color: 'var(--alpha-text)' }}
              >
                Add to Priority
              </button>
              <button
                onClick={() => setShowMenu(false)}
                className="w-full px-3 py-2 text-left font-mono text-sm transition-colors"
                style={{ color: 'var(--alpha-text)' }}
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