// PriorityProjectsPage.tsx
import { useState, useMemo, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ArrowRight, 
  Star, 
  Flag, 
  Clock, 
  Wallet,
  X,
  ArrowUpRight
} from 'lucide-react';
import { useAirdrops } from '@/hooks/use-airdrops';
import { useWallets } from '@/hooks/use-wallets';
import type { Airdrop, PriorityLevel } from '@/types';
import { AirdropModal } from '@/components/modals/AirdropModal';
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';
import { supabase } from '@/lib/supabase';

interface PriorityProject {
  id: string;
  name: string;
  icon: string;
  logo?: string;
  link: string;
  status: string;
  completed: boolean;
  priorityScore: number;
  walletCount: number;
  deadline?: string;
  priority: PriorityLevel;
  rawAirdrop: Airdrop;
}

const getAccentColor = (priority: PriorityLevel) => {
  switch(priority) {
    case 'High': return 'var(--alpha-danger)';
    case 'Medium': return 'var(--alpha-warning)';
    case 'Low': return 'var(--alpha-signal)';
    default: return 'var(--alpha-signal)';
  }
};

export function PriorityProjectsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { airdrops, refetch } = useAirdrops();
  const { wallets } = useWallets();
  const [searchQuery, setSearchQuery] = useState('');
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  
  const [selectedAirdrop, setSelectedAirdrop] = useState<Airdrop | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // build map of projectId -> walletCount
  const walletCountMap: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {};
    if (!Array.isArray(wallets)) return map;
    wallets.forEach((wallet: any) => {
      // support multiple naming conventions (projectId or project_id) to avoid mismatch
      const pid = wallet.projectId ?? wallet.project_id ?? wallet.project_id?.toString() ?? wallet.project?.id;
      if (!pid) return;
      map[pid] = (map[pid] || 0) + 1;
    });
    return map;
  }, [wallets]);

  // total wallets derived from walletCountMap (keeps numbers in sync with per-project counts)
  const totalWallets = useMemo(() => {
    return Object.values(walletCountMap).reduce((sum, n) => sum + (n || 0), 0);
  }, [walletCountMap]);

  const priorityProjects: PriorityProject[] = useMemo(() => {
    const filtered = airdrops.filter((a: Airdrop) => a.isPriority === true);
    return filtered.map((airdrop: Airdrop) => {
      const wCount = walletCountMap[airdrop.id] || 0;
      let priorityScore = 0;
      
      if (airdrop.priority === 'High') priorityScore += 30;
      else if (airdrop.priority === 'Medium') priorityScore += 20;
      else if (airdrop.priority === 'Low') priorityScore += 10;
      else priorityScore += 5;
      
      if (airdrop.isPriority) priorityScore += 10;
      if (wCount > 1) priorityScore += wCount * 5;
      if (airdrop.status === 'Ongoing') priorityScore += 5;
      else if (airdrop.status === 'Planning') priorityScore += 3;
      
      if (airdrop.deadline) {
        const daysUntil = Math.ceil((new Date(airdrop.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysUntil > 0 && daysUntil <= 3) priorityScore += 20;
        else if (daysUntil > 3 && daysUntil <= 7) priorityScore += 15;
        else if (daysUntil > 7 && daysUntil <= 30) priorityScore += 8;
      }

      return {
        id: airdrop.id,
        name: airdrop.projectName,
        icon: airdrop.projectName[0].toUpperCase(),
        logo: airdrop.projectLogo,
        link: airdrop.platformLink || '#',
        status: airdrop.status === 'Done' ? 'Completed' : 'Active',
        completed: airdrop.status === 'Done',
        priorityScore,
        walletCount: wCount,
        deadline: airdrop.deadline,
        priority: airdrop.priority || 'Low',
        rawAirdrop: airdrop
      };
    }).sort((a: PriorityProject, b: PriorityProject) => b.priorityScore - a.priorityScore);
  }, [airdrops, walletCountMap]);

  const filteredProjects = priorityProjects.filter((p: PriorityProject) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogoError = (id: string) => {
    setLogoError(prev => ({ ...prev, [id]: true }));
  };

  const handleViewDetails = (project: PriorityProject) => {
    setSelectedAirdrop(project.rawAirdrop);
    setIsEditModalOpen(true);
  };

  const handleRemoveClick = (e: React.MouseEvent, project: PriorityProject) => {
    e.stopPropagation();
    setRemovingId(project.id);
    setIsRemoveModalOpen(true);
  };

  const confirmRemove = async () => {
    if (!removingId) return;
    try {
      const { error } = await supabase
        .from('airdrops')
        .update({ is_priority: false, priority: 'Low' })
        .eq('id', removingId);
      if (error) throw error;
      await refetch();
      setIsRemoveModalOpen(false);
      setRemovingId(null);
    } catch (error) {
      console.error('Failed to remove:', error);
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedAirdrop(null);
    refetch();
  };

  const removingProject = priorityProjects.find(p => p.id === removingId);

  return (
    <DashboardLayout disableMonochrome>
      <div className="macos-root macos-page-shell">
        {/* Header */}
        <div className="macos-page-header macos-animate-up">
          <div className="macos-page-kicker">
            <Star className="h-3.5 w-3.5" />
            Priority Queue
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-2xl ${isDark ? 'bg-[var(--alpha-signal-soft)]' : 'bg-[var(--alpha-signal-soft)]'}`}>
              <Star className={`w-6 h-6 ${isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]'}`} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold font-mono ${isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'}`}>
                Priority Projects
              </h1>
              <p className={`font-mono text-sm ${isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'}`}>
                Sorted by priority level, deadline urgency, and wallet count.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className={`macos-premium-card px-4 py-3 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)]' : 'bg-[var(--alpha-panel)] border-[var(--alpha-border)]'}`}>
            <Star className={`w-5 h-5 ${isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]'}`} />
            <div>
              <p className={`text-xs font-mono ${isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'}`}>Priority Projects</p>
              <p className={`text-xl font-bold font-mono ${isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'}`}>{priorityProjects.length}</p>
            </div>
          </div>
          <div className={`macos-premium-card px-4 py-3 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)]' : 'bg-[var(--alpha-panel)] border-[var(--alpha-border)]'}`}>
            <Wallet className={`w-5 h-5 ${isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]'}`} />
            <div>
              <p className={`text-xs font-mono ${isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'}`}>Total Wallets</p>
              <p className={`text-xl font-bold font-mono ${isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'}`}>{totalWallets}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative max-w-md group flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-[var(--alpha-text-muted)] group-focus-within:text-[var(--alpha-signal)]' : 'text-[var(--alpha-text-muted)] group-focus-within:text-[var(--alpha-signal)]'}`} />
            <Input
              placeholder="Search priority projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 font-mono border-2 transition-all duration-200 ${isDark 
                ? 'bg-[var(--alpha-surface-strong)] border-[var(--alpha-border)] text-[var(--alpha-text)] focus:border-[var(--alpha-signal)]' 
                : 'bg-[var(--alpha-surface-soft)] border-[var(--alpha-border)] text-[var(--alpha-text)] focus:border-[var(--alpha-signal)]'
              }`}
            />
          </div>
          
          <Button
            variant="outline"
            className={`font-mono border-2 transition-all duration-200 ${isDark 
              ? 'border-[var(--alpha-signal)] text-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-soft)]' 
              : 'border-[var(--alpha-signal)] text-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-soft)]'
            }`}
            onClick={() => window.location.href = '/dashboard'}
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="macos-empty-state py-16 text-center">
            <Star className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'}`} />
            <h3 className={`font-mono font-bold mb-2 ${isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'}`}>
              No Priority Projects
            </h3>
            <p className={`font-mono text-sm mb-4 ${isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'}`}>
              Mark projects as priority or set High/Medium priority level to see them here.
            </p>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className={`font-mono border-2 ${
                isDark 
                  ? 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] border-[var(--alpha-signal)]' 
                  : 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] border-[var(--alpha-signal)]'
              }`}
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProjects.map((project, index) => {
              const accent = getAccentColor(project.priority);
              
              return (
                <div
                  key={project.id}
                  className={`
                    macos-premium-card macos-card-entry relative p-4 overflow-hidden group cursor-pointer
                    transition-all duration-300 ease-out
                    transform hover:-translate-y-1 hover:shadow-xl
                    ${isDark
                      ? "bg-[var(--alpha-surface)] border-[var(--alpha-border)] hover:border-[var(--alpha-border-strong)]"
                      : "bg-[var(--alpha-panel)] border-[var(--alpha-border)] hover:border-[var(--alpha-border-strong)]"}
                  `}
                  style={{ borderLeft: `3px solid ${accent}`, ['--mac-delay' as any]: `${index * 26}ms` }}
                >
                  {/* Glow effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${accent}08 0%, transparent 50%)`
                    }}
                  />

                  {/* Remove button */}
                  <button
                    onClick={(e) => handleRemoveClick(e, project)}
                    className={`absolute top-2 right-2 z-20 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                      isDark 
                        ? 'bg-[var(--alpha-surface-strong)] text-[var(--alpha-text-muted)] hover:text-[var(--alpha-danger)]' 
                        : 'bg-[var(--alpha-surface-soft)] text-[var(--alpha-text-muted)] hover:text-[var(--alpha-danger)]'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative">
                    <div className="flex items-start gap-3 mb-3">
                      <div 
                        className="w-12 h-12 rounded-xl overflow-hidden border flex-shrink-0 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center"
                        style={{
                          background: isDark ? 'var(--alpha-surface-strong)' : 'var(--alpha-surface-soft)',
                          borderColor: 'var(--alpha-border)',
                        }}
                      >
                        {project.logo && !logoError[project.id] ? (
                          <img 
                            src={project.logo} 
                            alt={project.name}
                            className="w-full h-full object-cover"
                            onError={() => handleLogoError(project.id)}
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center font-bold text-lg"
                            style={{ color: accent }}
                          >
                            {project.icon}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-mono font-bold text-sm transition-colors truncate ${isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'}`}>
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span 
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1"
                            style={{ color: accent, borderColor: `${accent}40`, background: `${accent}10` }}
                          >
                            <Flag className="w-2.5 h-2.5" />
                            {project.priority}
                          </span>
                          {project.walletCount > 0 && (
                            <span className={`text-[10px] font-mono flex items-center gap-1 ${isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'}`}>
                              <Wallet className="w-2.5 h-2.5" />
                              {project.walletCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`mb-3 flex items-center gap-2 rounded-lg border p-2 ${isDark ? 'bg-[var(--alpha-surface-strong)] border-[var(--alpha-border)]' : 'bg-[var(--alpha-surface-soft)] border-[var(--alpha-border)]'}`}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: project.completed ? 'var(--alpha-signal)' : 'var(--alpha-warning)' }} />
                      <span className={`text-[10px] font-mono flex-1 ${isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'}`}>
                        {project.completed ? 'Completed' : 'In Progress'}
                      </span>
                      {project.deadline && (
                        <span className={`text-[10px] font-mono flex items-center gap-1 ${isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'}`}>
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className={`w-full font-mono text-[10px] border transition-all duration-200 ${isDark 
                        ? 'border-[var(--alpha-border)] text-[var(--alpha-text)] hover:bg-[var(--alpha-signal-soft)] hover:border-[var(--alpha-signal)] hover:text-[var(--alpha-signal)]' 
                        : 'border-[var(--alpha-border)] text-[var(--alpha-text)] hover:bg-[var(--alpha-signal-soft)] hover:border-[var(--alpha-signal)] hover:text-[var(--alpha-signal)]'
                      }`}
                      onClick={() => handleViewDetails(project)}
                    >
                      View Details
                      <ArrowUpRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>

                  {/* Bottom accent line */}
                  <div 
                    className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: accent }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AirdropModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSubmit={() => { setTimeout(() => refetch(), 500); handleModalClose(); }}
        mode="edit"
        airdrop={selectedAirdrop}
        isDark={isDark}
      />

      <DeleteConfirmModal
        isOpen={isRemoveModalOpen}
        onClose={() => { setIsRemoveModalOpen(false); setRemovingId(null); }}
        onConfirm={confirmRemove}
        projectName={removingProject?.name || 'this project'}
        isDark={isDark}
        title="Remove from Priority"
        description="This will remove the project from your priority list, but it will remain in your dashboard."
        confirmLabel="Remove"
        variant="remove"
      />
    </DashboardLayout>
  );
}
