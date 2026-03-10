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
    <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--alpha-border)] bg-[var(--alpha-panel)] px-4 py-16">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--alpha-surface-strong)]">
        {icon || <Terminal className="h-10 w-10 text-[var(--alpha-text)]" />}
      </div>
      
      <h3 className="mb-2 text-xl font-mono font-bold text-[var(--alpha-text)]">
        {isDark ? `> ${title.toUpperCase()}` : title}
      </h3>
      
      <p className="mb-6 max-w-md text-center font-mono text-sm text-[var(--alpha-text-muted)]">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="border-2 border-[var(--alpha-signal)] bg-[var(--alpha-signal)] font-mono text-[var(--alpha-accent-contrast)] hover:bg-[var(--alpha-signal-press)]"
        >
          <Plus className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
