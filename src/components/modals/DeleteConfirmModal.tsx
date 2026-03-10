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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md macos-modal alpha-surface alpha-border`}>
        <DialogHeader className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isDeleteVariant 
              ? (isDark ? 'bg-[rgba(239,68,68,0.08)]' : 'bg-[rgba(220,38,38,0.08)]')
              : (isDark ? 'bg-[rgba(245,158,11,0.08)]' : 'bg-[rgba(217,119,6,0.08)]')
          }`}>
            {isDeleteVariant ? (
              <AlertTriangle className={`h-8 w-8 ${isDark ? 'text-[var(--alpha-danger)]' : 'text-[var(--alpha-danger)]'}`} />
            ) : (
              <X className={`h-8 w-8 ${isDark ? 'text-[var(--alpha-warning)]' : 'text-[#D97706]'}`} />
            )}
          </div>
          <DialogTitle className={`text-xl font-mono alpha-text`}>
            {displayTitle}
          </DialogTitle>
          <DialogDescription className={`font-mono alpha-muted`}>
            {isDark ? (
              <span dangerouslySetInnerHTML={{ 
                __html: displayDescription.replace(
                  /<strong>(.*?)<\/strong>/g, 
                  '<strong class="' + (isDeleteVariant ? 'text-[var(--alpha-danger)]' : 'text-[var(--alpha-warning)]') + '">$1</strong>'
                ) 
              }} />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: displayDescription }} />
            )}
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