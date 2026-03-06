// ALPHA TRECKER - Airdrop Modal (Add/Edit)
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Loader2, Calendar, Flag } from 'lucide-react';
import type { Airdrop, AirdropType, AirdropStatus, Task, PriorityLevel } from '@/types';
import { generateId } from '@/services/crypto';

const AIRDROP_TYPES: AirdropType[] = [
  'Testnet', 'AI', 'Quest', 'Daily', 'Daily Quest',
  'Retroactive', 'Waitlist', 'Depin', 'NFT', 'Domain Name',
  'Deploy SC', 'DeFi', 'Deploy NFT'
];

const AIRDROP_STATUSES: AirdropStatus[] = ['Planning', 'Ongoing', 'Done', 'Dropped'];
const PRIORITY_LEVELS: PriorityLevel[] = ['Low', 'Medium', 'High'];

interface AirdropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void> | void;
  mode: 'add' | 'edit';
  airdrop?: Airdrop | null;
  isDark?: boolean;
}

const getTodayDateInputValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeDateInputValue = (value?: string) => {
  if (!value) return getTodayDateInputValue();
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return getTodayDateInputValue();

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
  
  // NEW: Priority and Deadline fields
  const [priority, setPriority] = useState<PriorityLevel>('Low');
  const [deadline, setDeadline] = useState<string>(getTodayDateInputValue());
  const [isPriority, setIsPriority] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

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
      setPriority((airdrop as any).priority ?? 'Low');
      setDeadline(normalizeDateInputValue(airdrop.deadline ?? airdrop.createdAt));
      setIsPriority((airdrop as any).isPriority ?? false);
    } else {
      resetForm();
    }
  }, [isOpen, mode, airdrop]);

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
    setPriority('Low');
    setDeadline(getTodayDateInputValue());
    setIsPriority(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName?.trim()) return;

    const submitData = {
      projectName: projectName.trim(),
      projectLogo: projectLogo.trim(),
      platformLink: platformLink.trim(),
      twitterUsername: twitterUsername.trim(),
      walletAddress: walletAddress.trim(),
      type,
      status,
      notes: notes.trim(),
      tasks,
      priority,
      deadline: deadline || undefined,
      isPriority,
    };

    setIsLoading(true);
    try {
      await Promise.resolve(onSubmit(submitData));
      resetForm();
    } finally {
      setIsLoading(false);
    }
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
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto macos-modal alpha-surface alpha-border`}>
        <DialogHeader className="border-0 pb-0">
          <DialogTitle className={`text-2xl font-mono alpha-text`}>
            {mode === 'add' ? '> ADD_NEW_AIRDROP.exe' : '> EDIT_AIRDROP.exe'}
          </DialogTitle>
          <DialogDescription className={`font-mono alpha-muted`}>
            {mode === 'add' 
              ? 'Initialize new airdrop tracking protocol...' 
              : 'Modify existing project parameters...'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className={`text-sm font-mono uppercase tracking-wider alpha-muted`}>
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName" className={`font-mono alpha-text`}>
                  Project Name *
                </Label>
                <Input
                  id="projectName"
                  placeholder="e.g., LayerZero"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  className={`font-mono macos-input`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectLogo" className={`font-mono alpha-text`}>
                  Project Logo URL
                </Label>
                <Input
                  id="projectLogo"
                  placeholder="https://..."
                  value={projectLogo}
                  onChange={(e) => setProjectLogo(e.target.value)}
                  className={`font-mono macos-input`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className={`font-mono alpha-text`}>
                  Type *
                </Label>
                <Select value={type} onValueChange={(v) => setType(v as AirdropType)}>
                  <SelectTrigger className={`font-mono macos-input`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`font-mono macos-popover`}>
                    {AIRDROP_TYPES.map(t => (
                      <SelectItem 
                        key={t} 
                        value={t}
                      >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status" className={`font-mono alpha-text`}>
                  Status *
                </Label>
                <Select value={status} onValueChange={(v) => setStatus(v as AirdropStatus)}>
                  <SelectTrigger className={`font-mono macos-input`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`font-mono macos-popover`}>
                    {AIRDROP_STATUSES.map(s => (
                      <SelectItem 
                        key={s} 
                        value={s}
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Priority & Project Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className={`font-mono flex items-center gap-2 alpha-text`}>
                  <Flag className="w-4 h-4" />
                  Priority Level
                </Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as PriorityLevel)}>
                  <SelectTrigger className={`font-mono macos-input`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`font-mono macos-popover`}>
                    {PRIORITY_LEVELS.map(p => (
                      <SelectItem 
                        key={p} 
                        value={p}
                      >
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline" className={`font-mono flex items-center gap-2 alpha-text`}>
                  <Calendar className="w-4 h-4" />
                  Tanggal Project
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={`font-mono macos-input`}
                  required
                />
                <p className="text-xs font-mono alpha-text-muted">
                  Tanggal ini akan tampil di kartu project dashboard.
                </p>
              </div>
            </div>

            {/* NEW: Priority Toggle */}
            <div className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-colors ${isDark ? 'border-opacity-20' : ''}`}>
              <Checkbox
                id="isPriority"
                checked={isPriority}
                onCheckedChange={(checked) => setIsPriority(checked as boolean)}
                className={isDark ? '' : ''}
              />
              <Label htmlFor="isPriority" className={`font-mono cursor-pointer alpha-text`}>
                Mark as Priority Project (will appear in Priority tab)
              </Label>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className={`text-sm font-mono uppercase tracking-wider alpha-muted`}>
              Links
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="platformLink" className={`font-mono alpha-text`}>
                Platform Link
              </Label>
              <Input
                id="platformLink"
                placeholder="https://..."
                value={platformLink}
                onChange={(e) => setPlatformLink(e.target.value)}
                className={`font-mono macos-input`}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twitterUsername" className={`font-mono alpha-text`}>
                  X (Twitter) Username
                </Label>
                <Input
                  id="twitterUsername"
                  placeholder="username (without @)"
                  value={twitterUsername}
                  onChange={(e) => setTwitterUsername(e.target.value)}
                  className={`font-mono macos-input`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="walletAddress" className={`font-mono alpha-text`}>
                  Wallet Address
                </Label>
                <Input
                  id="walletAddress"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className={`font-mono macos-input`}
                />
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            <h4 className={`text-sm font-mono uppercase tracking-wider alpha-muted`}>
              Tasks
            </h4>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add a task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask())}
                className={`font-mono macos-input`}
              />
              <Button 
                type="button" 
                onClick={handleAddTask}
                variant="outline"
                className={`macos-btn macos-btn--ghost`}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {tasks.length > 0 && (
              <div className="space-y-2">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-center gap-2 p-2 rounded-lg border ${isDark ? 'alpha-panel' : 'alpha-panel'}`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-4 h-4 rounded border ${task.completed ? 'bg-[var(--alpha-accent-from)] border-[var(--alpha-accent-from)]' : ''}`}
                    >
                      {task.completed && (
                        <svg viewBox="0 0 24 24" fill="none" className={`w-full h-full`}>
                          <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                    <span className={`flex-1 font-mono ${task.completed ? 'line-through alpha-muted' : 'alpha-text'}`}>
                      {task.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(task.id)}
                      className={`transition-colors alpha-muted hover:text-red-500`}
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
            <Label htmlFor="notes" className={`font-mono alpha-text`}>
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={`font-mono macos-input`}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
              className={`macos-btn macos-btn--ghost`}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !projectName.trim()}
              className={`macos-btn macos-btn--primary`}
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
