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
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, projectName }: DeleteConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onConfirm();
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <DialogTitle className="text-xl">Delete Airdrop?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{projectName}</strong>? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            className="btn-micro bg-red-500 hover:bg-red-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
