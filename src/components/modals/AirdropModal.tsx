// ALPHA TRECKER - Airdrop Modal (Add/Edit)
import { useState, useEffect } from 'react';
import {
  DialogClose,
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
import { useI18n } from '@/contexts/LanguageContext';
import type { Airdrop, AirdropType, AirdropStatus, Task, PriorityLevel } from '@/types';
import { generateId } from '@/services/crypto';

const AIRDROP_TYPES: AirdropType[] = [
  'Testnet', 'AI', 'Quest', 'Daily', 'Daily Quest',
  'Retroactive', 'Waitlist', 'Node', 'Depin', 'NFT', 'Domain Name',
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

export function AirdropModal({ isOpen, onClose, onSubmit, mode, airdrop }: AirdropModalProps) {
  const { t, translateOption } = useI18n();
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
  
  const [priority, setPriority] = useState<PriorityLevel>('Low');
  const [deadline, setDeadline] = useState<string>(getTodayDateInputValue());
  const [waitlistCount, setWaitlistCount] = useState<number | ''>('');
  const [funding, setFunding] = useState('');
  const [potential, setPotential] = useState<PriorityLevel>('Medium');
  const [airdropConfirmed, setAirdropConfirmed] = useState(false);
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
      setPriority(airdrop.priority ?? 'Low');
      setDeadline(normalizeDateInputValue(airdrop.deadline ?? airdrop.createdAt));
      setWaitlistCount(airdrop.waitlistCount ?? '');
      setFunding(airdrop.funding ?? '');
      setPotential(airdrop.potential ?? 'Medium');
      setAirdropConfirmed(Boolean(airdrop.airdropConfirmed));
      setIsPriority(airdrop.isPriority ?? airdrop.is_priority ?? false);
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
    setWaitlistCount('');
    setFunding('');
    setPotential('Medium');
    setAirdropConfirmed(false);
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
      waitlistCount: typeof waitlistCount === 'number' ? waitlistCount : undefined,
      funding: funding.trim() || undefined,
      potential,
      airdropConfirmed,
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
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] max-w-[760px] overflow-y-auto border-0 bg-transparent p-0 shadow-none"
      >
        <div className="macos-modal macos-modal-compact">
          <div className="macos-modal-header">
            <DialogHeader className="flex-1 gap-0 text-left">
              <DialogTitle className="macos-modal-title">
                {mode === 'add' ? t('airdropModal.addTitle') : t('airdropModal.editTitle')}
              </DialogTitle>
              <DialogDescription className="macos-modal-description">
                {mode === 'add'
                  ? t('airdropModal.addDescription')
                  : t('airdropModal.editDescription')}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2 pr-8">
              <Button
                form="airdrop-form"
                type="submit"
                disabled={isLoading || !projectName.trim()}
                className="macos-btn macos-btn--primary macos-modal-submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'add' ? t('airdropModal.adding') : t('airdropModal.updating')}
                  </>
                ) : mode === 'add' ? t('airdropModal.addAction') : t('airdropModal.editAction')}
              </Button>

              <DialogClose asChild>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-alpha-border bg-[color:var(--alpha-surface)] alpha-text transition-[background-color,color,border-color] duration-150 hover:border-[color:var(--alpha-border-strong)] hover:bg-[color:var(--alpha-hover-soft)]"
                  aria-label={t('common.close')}
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogClose>
            </div>
          </div>

          <form id="airdrop-form" onSubmit={handleSubmit} className="mt-5 space-y-6 pb-6">
          
          <div className="macos-modal-block space-y-4">
            <h4 className="macos-modal-section-label">
              {t('airdropModal.section.basic')}
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName" className="macos-modal-label">
                  {t('airdropModal.projectName')} *
                </Label>
                <Input
                  id="projectName"
                  placeholder={t('airdropModal.projectNamePlaceholder')}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  className="macos-input macos-modal-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectLogo" className="macos-modal-label">
                  {t('airdropModal.projectLogo')}
                </Label>
                <Input
                  id="projectLogo"
                  placeholder="https://..."
                  value={projectLogo}
                  onChange={(e) => setProjectLogo(e.target.value)}
                  className="macos-input macos-modal-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="macos-modal-label">
                  {t('airdropModal.type')} *
                </Label>
                <Select value={type} onValueChange={(v) => setType(v as AirdropType)}>
                  <SelectTrigger className="macos-input macos-modal-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="macos-popover">
                    {AIRDROP_TYPES.map(t => (
                      <SelectItem 
                        key={t} 
                        value={t}
                      >
                        {translateOption('airdropType', t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status" className="macos-modal-label">
                  {t('airdropModal.status')} *
                </Label>
                <Select value={status} onValueChange={(v) => setStatus(v as AirdropStatus)}>
                  <SelectTrigger className="macos-input macos-modal-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="macos-popover">
                    {AIRDROP_STATUSES.map(s => (
                      <SelectItem 
                        key={s} 
                        value={s}
                      >
                        {translateOption('airdropStatus', s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="waitlistCount" className="macos-modal-label">
                  Waitlist
                </Label>
                <Input
                  id="waitlistCount"
                  type="number"
                  placeholder="Enter waitlist count"
                  value={waitlistCount}
                  onChange={(e) => setWaitlistCount(e.target.value ? Number(e.target.value) : '')}
                  className="macos-input macos-modal-input"
                  min={0}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="funding" className="macos-modal-label">
                  Funding
                </Label>
                <Input
                  id="funding"
                  placeholder="$120K"
                  value={funding}
                  onChange={(e) => setFunding(e.target.value)}
                  className="macos-input macos-modal-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="potential" className="macos-modal-label">
                  Potential Level
                </Label>
                <Select value={potential} onValueChange={(v) => setPotential(v as PriorityLevel)}>
                  <SelectTrigger className="macos-input macos-modal-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="macos-popover">
                    {PRIORITY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-3.5 transition-colors">
              <Checkbox
                id="airdropConfirmed"
                checked={airdropConfirmed}
                onCheckedChange={(checked) => setAirdropConfirmed(Boolean(checked))}
              />
              <Label htmlFor="airdropConfirmed" className="macos-modal-label cursor-pointer">
                Airdrop Confirmed
              </Label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="macos-modal-label flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  {t('airdropModal.tier')}
                </Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as PriorityLevel)}>
                  <SelectTrigger className="macos-input macos-modal-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="macos-popover">
                    {PRIORITY_LEVELS.map(p => (
                      <SelectItem 
                        key={p} 
                        value={p}
                      >
                        {translateOption('priority', p)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline" className="macos-modal-label flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('airdropModal.date')}
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="macos-input macos-modal-input"
                  required
                />
                <p className="macos-modal-note">
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-alpha-border bg-[color:var(--alpha-hover-soft)] p-3.5 transition-colors">
              <Checkbox
                id="isPriority"
                checked={isPriority}
                onCheckedChange={(checked) => setIsPriority(checked as boolean)}
              />
              <Label htmlFor="isPriority" className="macos-modal-label cursor-pointer">
                {t('airdropModal.priorityToggle')}
              </Label>
            </div>
          </div>

          <div className="macos-modal-block space-y-4">
            <h4 className="macos-modal-section-label">
              {t('airdropModal.section.links')}
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="platformLink" className="macos-modal-label">
                {t('airdropModal.platformLink')}
              </Label>
              <Input
                id="platformLink"
                placeholder="https://..."
                value={platformLink}
                onChange={(e) => setPlatformLink(e.target.value)}
                className="macos-input macos-modal-input"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twitterUsername" className="macos-modal-label">
                  {t('airdropModal.twitterUsername')}
                </Label>
                <Input
                  id="twitterUsername"
                  placeholder={t('airdropModal.twitterPlaceholder')}
                  value={twitterUsername}
                  onChange={(e) => setTwitterUsername(e.target.value)}
                  className="macos-input macos-modal-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="walletAddress" className="macos-modal-label">
                  {t('airdropModal.walletAddress')}
                </Label>
                <Input
                  id="walletAddress"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="macos-input macos-modal-input"
                />
              </div>
            </div>
          </div>

        
          <div className="macos-modal-block space-y-4">
            <h4 className="macos-modal-section-label">
              {t('airdropModal.section.tasks')}
            </h4>
            
            <div className="flex gap-2">
              <Input
                placeholder={t('airdropModal.addTask')}
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask())}
                className="macos-input macos-modal-input"
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
                    className="flex items-center gap-2 rounded-2xl border border-alpha-border bg-[color:var(--alpha-surface)] p-2.5"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className={`h-4 w-4 rounded border border-alpha-border ${task.completed ? 'border-[var(--alpha-accent-from)] bg-[var(--alpha-accent-from)] text-[var(--alpha-accent-contrast)]' : ''}`}
                    >
                      {task.completed && (
                        <svg viewBox="0 0 24 24" fill="none" className={`w-full h-full`}>
                          <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                    <span className={`flex-1 text-sm ${task.completed ? 'line-through alpha-muted' : 'alpha-text'}`}>
                      {task.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(task.id)}
                      className={`transition-colors alpha-muted hover:text-[var(--alpha-danger)]`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="macos-modal-block space-y-2">
            <Label htmlFor="notes" className="macos-modal-label">
              {t('airdropModal.notes')}
            </Label>
            <Textarea
              id="notes"
              placeholder={t('airdropModal.notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="macos-input macos-modal-input min-h-[108px]"
            />
          </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
