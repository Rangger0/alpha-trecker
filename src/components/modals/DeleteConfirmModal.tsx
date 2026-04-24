// DeleteConfirmModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { useState } from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName?: string;
  isDark?: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  variant?: 'delete' | 'remove';
}

export function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  projectName, 
  isDark = false,
  title,
  description,
  confirmLabel,
  variant = 'delete'
}: DeleteConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onConfirm();
    setIsLoading(false);
  };

  // Default values berdasarkan variant
  const defaultTitle = variant === 'delete' 
    ? (isDark ? '> DELETE_CONFIRMATION' : 'Delete Airdrop?')
    : (isDark ? '> REMOVE_FROM_PRIORITY' : 'Remove from Priority?');
    
  const defaultDescription = variant === 'delete'
    ? `Are you sure you want to delete <strong>${projectName}</strong>? This action cannot be undone.`
    : `This will remove <strong>${projectName}</strong> from your priority list, but it will remain in your dashboard. You can add it back to priority anytime.`;
    
  const defaultConfirmLabel = variant === 'delete' ? 'DELETE' : 'REMOVE';
  
  const displayTitle = title || defaultTitle;
  const displayDescription = description || defaultDescription;
  const displayConfirmLabel = confirmLabel || defaultConfirmLabel;

  const isDeleteVariant = variant === 'delete';
  const accentColor = isDeleteVariant ? 'var(--alpha-danger)' : 'var(--alpha-warning)';
  const accentFill = isDeleteVariant
    ? 'color-mix(in srgb, var(--alpha-danger) 12%, transparent)'
    : 'color-mix(in srgb, var(--alpha-warning) 12%, transparent)';
  const emphasizedDescription = displayDescription.replace(
    /<strong>(.*?)<\/strong>/g,
    `<strong class="${isDeleteVariant ? 'text-[var(--alpha-danger)]' : 'text-[var(--alpha-warning)]'}">$1</strong>`
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md macos-modal alpha-surface alpha-border`}>
        <DialogHeader className="text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: accentFill }}
          >
            {isDeleteVariant ? (
              <AlertTriangle className="h-8 w-8" style={{ color: accentColor }} />
            ) : (
              <X className="h-8 w-8" style={{ color: accentColor }} />
            )}
          </div>
          <DialogTitle className={`text-xl font-mono alpha-text`}>
            {displayTitle}
          </DialogTitle>
          <DialogDescription className={`font-mono alpha-muted`}>
            <span dangerouslySetInnerHTML={{ __html: emphasizedDescription }} />
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            className={`macos-btn macos-btn--ghost`}
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isLoading}
            className={`macos-btn ${isDeleteVariant ? 'macos-btn--primary' : 'macos-btn--primary'}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {displayConfirmLabel}...
              </>
            ) : (
              displayConfirmLabel
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
