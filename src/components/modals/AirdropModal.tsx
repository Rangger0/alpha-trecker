// ALPHA TRECKER - Airdrop Modal (Add/Edit)

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X, Loader2 } from 'lucide-react';
import type { Airdrop, AirdropType, AirdropStatus, Task } from '@/types';
import { generateId } from '@/services/crypto';

const AIRDROP_TYPES: AirdropType[] = [
  'Testnet', 'AI', 'Quest', 'Daily', 'Daily Quest', 
  'Retro', 'Waitlist', 'Depin', 'NFT', 'Domain Name', 
  'Deploy SC', 'DeFi', 'Deploy NFT'
];

const AIRDROP_STATUSES: AirdropStatus[] = ['Planning', 'Ongoing', 'Done', 'Dropped'];

interface AirdropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  mode: 'add' | 'edit';
  airdrop?: Airdrop | null;
}

export function AirdropModal({ isOpen, onClose, onSubmit, mode, airdrop }: AirdropModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectLogo, setProjectLogo] = useState('');
  const [platformLink, setPlatformLink] = useState('');
  const [twitterUsername, setTwitterUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [type, setType] = useState<AirdropType>('Testnet');
  const [status, setStatus] = useState<AirdropStatus>('Planning');
  const [notes, setNotes] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
  if (mode === 'edit' && airdrop) {
    setProjectName(airdrop.projectName ?? '');
    setProjectLogo(airdrop.projectLogo ?? '');
    setPlatformLink(airdrop.platformLink ?? '');
    setTwitterUsername(airdrop.twitterUsername ?? '');
    setWalletAddress(airdrop.walletAddress ?? '');
    setType(airdrop.type ?? 'Testnet');
    setStatus(airdrop.status ?? 'Planning');
    setNotes(airdrop.notes ?? '');
    setTasks(airdrop.tasks ?? []);
  } else {
    resetForm();
  }
}, [mode, airdrop]);

  const resetForm = () => {
    setProjectName('');
    setProjectLogo('');
    setPlatformLink('');
    setTwitterUsername('');
    setWalletAddress('');
    setType('Testnet');
    setStatus('Planning');
    setNotes('');
    setTasks([]);
    setNewTaskTitle('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   if (!projectName?.trim()) return;

    setIsLoading(true);
    
    onSubmit({
      projectName: projectName.trim(),
      projectLogo: projectLogo.trim(),
      platformLink: platformLink.trim(),
      twitterUsername: twitterUsername.trim(),
      walletAddress: walletAddress.trim(),
      type,
      status,
      notes: notes.trim(),
      tasks,
    });
    
    setIsLoading(false);
    resetForm();
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: generateId(),
      airdropId: airdrop?.id || '',
      title: newTaskTitle.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === 'add' ? 'Add New Airdrop' : 'Edit Airdrop'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., LayerZero"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectLogo">Project Logo URL</Label>
                <Input
                  id="projectLogo"
                  placeholder="https://..."
                  value={projectLogo}
                  onChange={(e) => setProjectLogo(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={type} onValueChange={(v) => setType(v as AirdropType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AIRDROP_TYPES.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as AirdropStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AIRDROP_STATUSES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Links
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="platformLink">Platform Link</Label>
              <Input
                id="platformLink"
                placeholder="https://..."
                value={platformLink}
                onChange={(e) => setPlatformLink(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twitterUsername">X (Twitter) Username</Label>
                <Input
                  id="twitterUsername"
                  placeholder="username (without @)"
                  value={twitterUsername}
                  onChange={(e) => setTwitterUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input
                  id="walletAddress"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Tasks
            </h4>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add a task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask())}
              />
              <Button 
                type="button" 
                onClick={handleAddTask}
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {tasks.length > 0 && (
              <div className="space-y-2">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-4 h-4 rounded border ${
                        task.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-muted-foreground'
                      }`}
                    >
                      {task.completed && (
                        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white">
                          <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                    <span className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(task.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="btn-micro bg-red-500 hover:bg-red-600"
              disabled={isLoading || !projectName.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                mode === 'add' ? 'Add Airdrop' : 'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
