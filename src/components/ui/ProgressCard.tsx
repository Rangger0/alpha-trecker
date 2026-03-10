interface ProgressCardProps {
  title: string;
  used: number;
  limit: number;
  unit?: string;
  compact?: boolean;
}

export function ProgressCard({ title, used, limit, unit = '', compact = false }: ProgressCardProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const remaining = limit - used;

  // Compact version for grid layouts
  if (compact) {
    return (
      <div className="rounded-lg border border-[var(--alpha-border)] bg-[var(--alpha-panel)] p-3 transition-all duration-300 hover:border-[var(--alpha-signal-border)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-[var(--alpha-text)]">
            {title}
          </span>
          <span className="text-[10px] font-mono text-[var(--alpha-text-muted)]">
            {remaining} left
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono text-[var(--alpha-text-muted)]">
            {used} / {limit} {unit}
          </span>
        </div>
        
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--alpha-surface-strong)]">
          <div 
            className="h-full rounded-full bg-[var(--alpha-signal)] transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  // Original full version
  return (
    <div className="rounded-lg border border-[var(--alpha-border)] bg-[var(--alpha-panel)] p-4 transition-all duration-300 hover:border-[var(--alpha-signal-border)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-[var(--alpha-text)]">
            {title}
          </span>
        </div>
        <span className="text-xs font-mono text-[var(--alpha-text-muted)]">
          {remaining} left
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-[var(--alpha-text-muted)]">
          {used} used / {limit} {unit} limit
        </span>
      </div>
      
      <div className="h-2 overflow-hidden rounded-full bg-[var(--alpha-surface-strong)]">
        <div 
          className="h-full rounded-full bg-[var(--alpha-signal)] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
