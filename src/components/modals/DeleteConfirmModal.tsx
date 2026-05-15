// DeleteConfirmModal.tsx
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
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
  title,
  description,
  confirmLabel,
  variant = 'delete'
}: DeleteConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await Promise.resolve(onConfirm());
    } finally {
      setIsLoading(false);
    }
  };

  // Default values berdasarkan variant
  const defaultTitle = variant === 'delete' 
    ? 'Delete Project?'
    : 'Remove from Priority?';
    
  const resolvedProjectName = projectName || 'this project';
  const defaultDescription = variant === 'delete'
    ? 'This action cannot be undone.'
    : 'This will remove the project from your priority list, but it will remain in your dashboard. You can add it back anytime.';
    
  const defaultConfirmLabel = variant === 'delete' ? 'DELETE' : 'REMOVE';
  
  const displayTitle = title || defaultTitle;
  const displayDescription = description || defaultDescription;
  const displayConfirmLabel = confirmLabel || defaultConfirmLabel;

  const isDeleteVariant = variant === 'delete';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md border-0 bg-transparent p-0 shadow-none"
      >
        <div className="macos-modal macos-modal-compact macos-delete-modal">
          <DialogClose asChild>
            <button
              type="button"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-alpha-border bg-[color:var(--alpha-surface)] alpha-text transition-[background-color,color,border-color] duration-150 hover:border-[color:var(--alpha-border-strong)] hover:bg-[color:var(--alpha-hover-soft)]"
              aria-label="Close delete confirmation"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogClose>

          <DialogHeader className="text-center">
            <div className="macos-delete-icon mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            {isDeleteVariant ? (
              <AlertTriangle className="h-8 w-8" />
            ) : (
              <X className="h-8 w-8" />
            )}
            </div>
            <DialogTitle className="macos-modal-title text-xl">
              {displayTitle}
            </DialogTitle>
            <DialogDescription className="macos-modal-description">
              {isDeleteVariant && !description ? (
                <>
                  Are you sure you want to delete <strong className="font-semibold text-[color:var(--alpha-danger)]">{resolvedProjectName}</strong>? {displayDescription}
                </>
              ) : (
                displayDescription
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="macos-btn macos-btn--ghost"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`macos-btn ${isDeleteVariant ? 'macos-btn--danger' : 'macos-btn--primary'}`}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
