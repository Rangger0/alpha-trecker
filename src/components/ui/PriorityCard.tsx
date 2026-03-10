// src/components/ui/PriorityCard.tsx
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
  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--alpha-border)] bg-[var(--alpha-panel)] p-5 transition-all duration-300 hover:border-[var(--alpha-signal)]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--alpha-signal-soft)] text-lg font-bold text-[var(--alpha-signal)]">
            {project.icon}
          </div>
          <div>
            <h3 className="font-mono font-bold text-[var(--alpha-text)]">
              {project.name}
            </h3>
            <a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-mono text-[var(--alpha-signal)] transition-colors hover:opacity-80"
            >
              <ExternalLink className="w-3 h-3" />
              {project.link.slice(0, 25)}...
            </a>
          </div>
        </div>
        <Badge variant="outline" className="border-[var(--alpha-signal-border)] bg-[var(--alpha-signal-soft)] font-mono text-xs text-[var(--alpha-signal)]">
          {project.status}
        </Badge>
      </div>
      
      {/* Status */}
      <div className={`mb-4 flex items-center gap-2 rounded border px-3 py-2 ${
        project.completed
          ? 'border-[var(--alpha-signal-border)] bg-[var(--alpha-signal-softest)]'
          : 'border-[var(--alpha-warning-border)] bg-[var(--alpha-warning-softest)]'
      }`}>
        {project.completed ? (
          <CheckCircle2 className="h-4 w-4 text-[var(--alpha-signal)]" />
        ) : (
          <Circle className="h-4 w-4 text-[var(--alpha-warning)]" />
        )}
        <span className={`font-mono text-xs ${
          project.completed
            ? 'text-[var(--alpha-signal)]'
            : 'text-[var(--alpha-warning)]'
        }`}>
          {project.completed ? 'Completed' : 'Not completed'}
        </span>
      </div>
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Action */}
      <Button
        onClick={onViewDetails}
        className="w-full border border-[var(--alpha-border)] bg-transparent font-mono text-sm text-[var(--alpha-text)] transition-all duration-200 hover:border-[var(--alpha-signal)] hover:bg-[var(--alpha-signal)] hover:text-[var(--alpha-accent-contrast)]"
      >
        View Details
      </Button>
    </div>
  );
}
