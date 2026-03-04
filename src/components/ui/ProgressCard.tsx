import { useTheme } from '@/contexts/ThemeContext';

interface ProgressCardProps {
  title: string;
  used: number;
  limit: number;
  unit?: string;
  compact?: boolean;
}

export function ProgressCard({ title, used, limit, unit = '', compact = false }: ProgressCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const percentage = Math.min((used / limit) * 100, 100);
  const remaining = limit - used;

  // Compact version for grid layouts
  if (compact) {
    return (
      <div className={`p-3 rounded-lg border transition-all duration-300 ${
        isDark 
          ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/30' 
          : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/30'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
            {title}
          </span>
          <span className={`text-[10px] font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
            {remaining} left
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-[10px] font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
            {used} / {limit} {unit}
          </span>
        </div>
        
        <div className={`h-1.5 rounded-full overflow-hidden ${
          isDark ? 'bg-[#0B0F14]' : 'bg-[#F3F4F6]'
        }`}>
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              isDark ? 'bg-[#00FF88]' : 'bg-[#2563EB]'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  // Original full version
  return (
    <div className={`p-4 rounded-lg border transition-all duration-300 ${
      isDark 
        ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/30' 
        : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/30'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
            {title}
          </span>
        </div>
        <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
          {remaining} left
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
          {used} used / {limit} {unit} limit
        </span>
      </div>
      
      <div className={`h-2 rounded-full overflow-hidden ${
        isDark ? 'bg-[#0B0F14]' : 'bg-[#F3F4F6]'
      }`}>
        <div 
          className={`h-full transition-all duration-500 rounded-full ${
            isDark ? 'bg-[#00FF88]' : 'bg-[#2563EB]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}