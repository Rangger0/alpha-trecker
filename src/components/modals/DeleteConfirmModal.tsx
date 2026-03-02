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
      <DialogContent className={`max-w-md border !bg-[#fdfdfd] ${
        isDark 
          ? 'border-[#ffffff46]' 
          : 'bg-white border-[#e5e7eb]'
      }`}>
        <DialogHeader className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isDeleteVariant 
              ? (isDark ? 'bg-[#EF4444]/10' : 'bg-[#DC2626]/10')
              : (isDark ? 'bg-[#F59E0B]/10' : 'bg-[#D97706]/10')
          }`}>
            {isDeleteVariant ? (
              <AlertTriangle className={`h-8 w-8 ${isDark ? 'text-[#EF4444]' : 'text-[#DC2626]'}`} />
            ) : (
              <X className={`h-8 w-8 ${isDark ? 'text-[#F59E0B]' : 'text-[#D97706]'}`} />
            )}
          </div>
          <DialogTitle className={`text-xl font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
            {displayTitle}
          </DialogTitle>
          <DialogDescription className={`font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
            {isDark ? (
              <span dangerouslySetInnerHTML={{ 
                __html: displayDescription.replace(
                  /<strong>(.*?)<\/strong>/g, 
                  '<strong class="' + (isDeleteVariant ? 'text-[#EF4444]' : 'text-[#F59E0B]') + '">$1</strong>'
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
            className={`font-mono border-2 ${
              isDark 
                ? 'border-[#1F2937] text-[#6B7280] hover:bg-[#1F2937]' 
                : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6]'
            }`}
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isLoading}
            className={`font-mono border-2 ${
              isDeleteVariant
                ? (isDark 
                    ? 'bg-[#EF4444] text-white border-[#EF4444] hover:bg-[#EF4444]/90' 
                    : 'bg-[#DC2626] text-white border-[#DC2626] hover:bg-[#DC2626]/90')
                : (isDark 
                    ? 'bg-[#F59E0B] text-black border-[#F59E0B] hover:bg-[#F59E0B]/90' 
                    : 'bg-[#D97706] text-white border-[#D97706] hover:bg-[#D97706]/90')
            }`}
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