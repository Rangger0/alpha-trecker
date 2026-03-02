// src/components/ui/EmptyState.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Terminal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon 
}: EmptyStateProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 rounded-xl border ${
      isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'
    }`}>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
        isDark ? 'bg-[#0B0F14]' : 'bg-[#F3F4F6]'
      }`}>
        {icon || <Terminal className={`w-10 h-10 ${isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'}`} />}
      </div>
      
      <h3 className={`text-xl font-mono font-bold mb-2 ${
        isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
      }`}>
        {isDark ? `> ${title.toUpperCase()}` : title}
      </h3>
      
      <p className={`text-center font-mono text-sm mb-6 max-w-md ${
        isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
      }`}>
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className={`font-mono border-2 ${
            isDark 
              ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90' 
              : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90'
          }`}
        >
          <Plus className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}