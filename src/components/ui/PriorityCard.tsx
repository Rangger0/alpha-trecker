// src/components/ui/PriorityCard.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle2, Circle } from 'lucide-react';

interface PriorityCardProps {
  project: {
    id: string;
    name: string;
    icon: string;
    link: string;
    status: string;
    completed: boolean;
  };
  onViewDetails: () => void;
}

export function PriorityCard({ project, onViewDetails }: PriorityCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`p-5 rounded-xl border transition-all duration-300 h-full flex flex-col ${
      isDark 
        ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50' 
        : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/50'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
            isDark ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'bg-[#2563EB]/10 text-[#2563EB]'
          }`}>
            {project.icon}
          </div>
          <div>
            <h3 className={`font-mono font-bold ${
              isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
            }`}>
              {project.name}
            </h3>
            <a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 text-xs font-mono transition-colors ${
                isDark ? 'text-[#3B82F6] hover:text-[#00FF88]' : 'text-[#2563EB] hover:text-[#10B981]'
              }`}
            >
              <ExternalLink className="w-3 h-3" />
              {project.link.slice(0, 25)}...
            </a>
          </div>
        </div>
        <Badge variant="outline" className={`font-mono text-xs ${
          isDark 
            ? 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/20' 
            : 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
        }`}>
          {project.status}
        </Badge>
      </div>
      
      {/* Status */}
      <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded border ${
        project.completed
          ? isDark 
            ? 'bg-[#00FF88]/5 border-[#00FF88]/20' 
            : 'bg-[#10B981]/5 border-[#10B981]/20'
          : isDark 
            ? 'bg-[#F59E0B]/5 border-[#F59E0B]/20' 
            : 'bg-[#EA580C]/5 border-[#EA580C]/20'
      }`}>
        {project.completed ? (
          <CheckCircle2 className={`w-4 h-4 ${isDark ? 'text-[#00FF88]' : 'text-[#10B981]'}`} />
        ) : (
          <Circle className={`w-4 h-4 ${isDark ? 'text-[#F59E0B]' : 'text-[#EA580C]'}`} />
        )}
        <span className={`font-mono text-xs ${
          project.completed
            ? isDark ? 'text-[#00FF88]' : 'text-[#10B981]'
            : isDark ? 'text-[#F59E0B]' : 'text-[#EA580C]'
        }`}>
          {project.completed ? 'Completed' : 'Not completed'}
        </span>
      </div>
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Action */}
      <Button
        onClick={onViewDetails}
        className={`w-full font-mono text-sm border transition-all duration-200 ${
          isDark 
            ? 'bg-transparent border-[#1F2937] text-[#E5E7EB] hover:bg-[#00FF88] hover:text-[#0B0F14] hover:border-[#00FF88]' 
            : 'bg-transparent border-[#E5E7EB] text-[#111827] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB]'
        }`}
      >
        View Details
      </Button>
    </div>
  );
}