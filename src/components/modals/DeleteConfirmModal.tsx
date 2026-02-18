// ALPHA TRECKER - Delete Confirmation Modal

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName?: string;
  isDark?: boolean;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, projectName, isDark = false }: DeleteConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onConfirm();
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md border ${
        isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'
      }`}>
        <DialogHeader className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isDark ? 'bg-[#EF4444]/20' : 'bg-[#DC2626]/10'
          }`}>
            <AlertTriangle className={`h-8 w-8 ${isDark ? 'text-[#EF4444]' : 'text-[#DC2626]'}`} />
          </div>
          <DialogTitle className={`text-xl font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
            {isDark ? '> DELETE_CONFIRMATION' : 'Delete Airdrop?'}
          </DialogTitle>
          <DialogDescription className={`font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
            {isDark ? (
              <>Are you sure you want to delete <strong className="text-[#EF4444]">{projectName}</strong>? This action cannot be undone.</>
            ) : (
              <>Are you sure you want to delete <strong>{projectName}</strong>? This action cannot be undone.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            className={`font-mono border ${
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
            className={`font-mono border ${
              isDark 
                ? 'bg-[#EF4444] text-white border-[#EF4444] hover:bg-[#EF4444]/90' 
                : 'bg-[#DC2626] text-white border-[#DC2626] hover:bg-[#DC2626]/90'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                DELETING...
              </>
            ) : (
              'DELETE'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}