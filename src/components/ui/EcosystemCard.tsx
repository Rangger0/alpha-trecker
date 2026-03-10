// src/components/ui/EcosystemCard.tsx
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

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
  return (
    <div className="relative rounded-xl border border-[var(--alpha-border)] bg-[var(--alpha-panel)] p-5 transition-all duration-300 group hover:border-[var(--alpha-signal)]">
      {/* Notification Badge */}
      {ecosystem.hasNotification && (
        <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[var(--alpha-danger)]" />
      )}
      
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--alpha-signal-soft)] text-xl font-bold text-[var(--alpha-signal)]">
          {ecosystem.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="truncate font-mono font-bold text-[var(--alpha-text)]">
            {ecosystem.name}
          </h3>
          <a 
            href={`https://x.com/${ecosystem.twitterHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-mono text-[var(--alpha-text-muted)] transition-colors hover:text-[var(--alpha-signal)]"
          >
            <ExternalLink className="w-3 h-3" />
            @{ecosystem.twitterHandle}
          </a>
          <p className="mt-1 text-xs font-mono text-[var(--alpha-text-muted)]">
            {ecosystem.date}
          </p>
        </div>
      </div>
      
      {/* Progress */}
      <div className="mb-4">
        <div className="h-2 overflow-hidden rounded-full bg-[var(--alpha-surface-strong)]">
          <div 
            className="h-full rounded-full bg-[var(--alpha-signal)] transition-all duration-500"
            style={{ width: `${ecosystem.progress}%` }}
          />
        </div>
      </div>
      
      {/* Action */}
      <Button
        onClick={onViewDetail}
        className="w-full border border-[var(--alpha-border)] bg-transparent font-mono text-sm text-[var(--alpha-text)] transition-all duration-200 hover:border-[var(--alpha-signal)] hover:bg-[var(--alpha-signal)] hover:text-[var(--alpha-accent-contrast)]"
      >
        View Detail
      </Button>
    </div>
  );
}
