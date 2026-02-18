// ALPHA TRECKER - Airdrop Modal (Add/Edit)

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,  // <-- TAMBAH INI
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
  isDark?: boolean;  // <-- TAMBAH INI (optional)
}

export function AirdropModal({ isOpen, onClose, onSubmit, mode, airdrop, isDark = false }: AirdropModalProps) {
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
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto border-2 ${
        isDark 
          ? 'bg-[#0a0a0f] border-[#00ff00] text-[#00ff00]' 
          : 'bg-white border-gray-400 text-gray-900'
      }`}>
        <DialogHeader className="border-0 pb-0">
          <DialogTitle className={`text-2xl font-mono ${
            isDark ? 'text-[#00ff00]' : 'text-gray-900'
          }`}>
            {mode === 'add' ? '> ADD_NEW_AIRDROP.exe' : '> EDIT_AIRDROP.exe'}
          </DialogTitle>
          <DialogDescription className={`font-mono ${
            isDark ? 'text-gray-500' : 'text-gray-600'
          }`}>
            {mode === 'add' 
              ? 'Initialize new airdrop tracking protocol...' 
              : 'Modify existing project parameters...'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className={`text-sm font-mono uppercase tracking-wider ${
              isDark ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName" className={`font-mono ${isDark ? 'text-[#00ff00]' : ''}`}>
                  Project Name *
                </Label>
                <Input
                  id="projectName"
                  placeholder="e.g., LayerZero"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  className={`font-mono border-2 ${
                    isDark 
                      ? 'bg-[#0f0f14] border-[#00ff00]/30 text-[#00ff00] placeholder:text-gray-600' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectLogo" className={`font-mono ${isDark ? 'text-[#00ff00]' : ''}`}>
                  Project Logo URL
                </Label>
                <Input
                  id="projectLogo"
                  placeholder="https://..."
                  value={projectLogo}
                  onChange={(e) => setProjectLogo(e.target.value)}
                  className={`font-mono border-2 ${
                    isDark 
                      ? 'bg-[#0f0f14] border-[#00ff00]/30 text-[#00ff00] placeholder:text-gray-600' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className={`font-mono ${isDark ? 'text-[#00ff00]' : ''}`}>
                  Type *
                </Label>
                <Select value={type} onValueChange={(v) => setType(v as AirdropType)}>
                  <SelectTrigger className={`font-mono border-2 ${
                    isDark 
                      ? 'bg-[#0f0f14] border-[#00ff00]/30 text-[#00ff00]' 
                      : 'bg-white border-gray-300'
                  }`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`font-mono border-2 ${
                    isDark 
                      ? 'bg-[#0f0f14] border-[#00ff00]/30' 
                      : 'bg-white border-gray-300'
                  }`}>
                    {AIRDROP_TYPES.map(t => (
                      <SelectItem 
                        key={t} 
                        value={t}
                        className={isDark ? 'text-[#00ff00] focus:bg-[#00ff00]/10' : ''}
                      >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status" className={`font-mono ${isDark ? 'text-[#00ff00]' : ''}`}>
                  Status *
                </Label>
                <Select value={status} onValueChange={(v) => setStatus(v as AirdropStatus)}>
                  <SelectTrigger className={`font-mono border-2 ${
                    isDark 
                      ? 'bg-[#0f0f14] border-[#00ff00]/30 text-[#00ff00]' 
                      : 'bg-white border-gray-300'
                  }`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`font-mono border-2 ${
                    isDark 
                      ? 'bg-[#0f0f14] border-[#00ff00]/30' 
                      : 'bg-white border-gray-300'
                  }`}>
                    {AIRDROP_STATUSES.map(s => (
                      <SelectItem 
                        key={s} 
                        value={s}
                        className={isDark ? 'text-[#00ff00] focus:bg-[#00ff00]/10' : ''}
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className={`text-sm font-mono uppercase tracking-wider ${
              isDark ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Links
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="platformLink" className={`font-mono ${isDark ? 'text-[#00ff00]' : ''}`}>
                Platform Link
              </Label>
              <Input
                id="platformLink"
                placeholder="https://..."
                value={platformLink}
                onChange={(e) => setPlatformLink(e.target.value)}
                className={`font-mono border-2 ${
                  isDark 
                    ? 'bg-[#0f0f14] border-[#00ff00]/30 text-[#00ff00] placeholder:text-gray-600' 
                    : 'bg-gray-50 border-gray-300'
                }`}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twitterUsername" className={`font-mono ${isDark ? 'text-[#00ff00]' : ''}`}>
                  X (Twitter) Username
                </Label>
                <Input
                  id="twitterUsername"
                  placeholder="username (without @)"
                  value={twitterUsername}
                  onChange={(e) => setTwitterUsername(e.target.value)}
                  className={`font-mono border-2 ${
                    isDark 
                      ? 'bg-[#0f0f14] border-[#00ff00]/30 text-[#00ff00] placeholder:text-gray-600' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="walletAddress" className={`font-mono ${isDark ? 'text-[#00ff00]' : ''}`}>
                  Wallet Address
                </Label>
                <Input
                  id="walletAddress"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className={`font-mono border-2 ${
                    isDark 
                      ? 'bg-[#0f0f14] border-[#00ff00]/30 text-[#00ff00] placeholder:text-gray-600' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            <h4 className={`text-sm font-mono uppercase tracking-wider ${
              isDark ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Tasks
            </h4>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add a task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask())}
                className={`font-mono border-2 ${
                  isDark 
                    ? 'bg-[#0f0f14] border-[#00ff00]/30 text-[#00ff00] placeholder:text-gray-600' 
                    : 'bg-gray-50 border-gray-300'
                }`}
              />
              <Button 
                type="button" 
                onClick={handleAddTask}
                variant="outline"
                className={`border-2 ${
                  isDark 
                    ? 'border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black' 
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {tasks.length > 0 && (
              <div className="space-y-2">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-center gap-2 p-2 rounded-lg border ${
                      isDark 
                        ? 'bg-[#0f0f14] border-[#00ff00]/20' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-4 h-4 rounded border ${
                        task.completed 
                          ? (isDark ? 'bg-[#00ff00] border-[#00ff00]' : 'bg-green-500 border-green-500') 
                          : (isDark ? 'border-[#00ff00]/50' : 'border-gray-400')
                      }`}
                    >
                      {task.completed && (
                        <svg viewBox="0 0 24 24" fill="none" className={`w-full h-full ${
                          isDark ? 'text-black' : 'text-white'
                        }`}>
                          <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                    <span className={`flex-1 font-mono ${
                      task.completed 
                        ? (isDark ? 'line-through text-gray-600' : 'line-through text-gray-500') 
                        : (isDark ? 'text-[#00ff00]' : 'text-gray-900')
                    }`}>
                      {task.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(task.id)}
                      className={`transition-colors ${
                        isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                      }`}
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
            <Label htmlFor="notes" className={`font-mono ${isDark ? 'text-[#00ff00]' : ''}`}>
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={`font-mono border-2 ${
                isDark 
                  ? 'bg-[#0f0f14] border-[#00ff00]/30 text-[#00ff00] placeholder:text-gray-600' 
                  : 'bg-gray-50 border-gray-300'
              }`}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
              className={`font-mono border-2 ${
                isDark 
                  ? 'border-[#00ff00]/50 text-[#00ff00] hover:bg-[#00ff00]/10' 
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !projectName.trim()}
              className={`font-mono border-2 ${
                isDark 
                  ? 'bg-[#00ff00] text-black border-[#00ff00] hover:bg-[#00ff00]/90' 
                  : 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                mode === 'add' ? 'ADD_AIRDROP' : 'SAVE_CHANGES'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}