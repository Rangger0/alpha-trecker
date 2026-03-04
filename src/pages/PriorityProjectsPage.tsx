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
import { motion } from 'framer-motion';

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
    case 'High': return '#EF4444';
    case 'Medium': return '#F59E0B';
    case 'Low': return '#10B981';
    default: return '#00D4AA';
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

  const walletCountMap: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {};
    if (!Array.isArray(wallets)) return map;
    wallets.forEach((wallet: any) => {
      if (wallet.projectId) {
        map[wallet.projectId] = (map[wallet.projectId] || 0) + 1;
      }
    });
    return map;
  }, [wallets]);

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
    <DashboardLayout>
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-[#00FF88]/10' : 'bg-[#2563EB]/10'}`}>
              <Star className={`w-6 h-6 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                Priority Projects
              </h1>
              <p className={`font-mono text-sm ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                Sorted by priority level, deadline urgency, and wallet count.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}`}>
            <Star className={`w-5 h-5 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`} />
            <div>
              <p className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>Priority Projects</p>
              <p className={`text-xl font-bold font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>{priorityProjects.length}</p>
            </div>
          </div>
          <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}`}>
            <Wallet className={`w-5 h-5 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`} />
            <div>
              <p className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>Total Wallets</p>
              <p className={`text-xl font-bold font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>{wallets.length}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative max-w-md group flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-[#6B7280] group-focus-within:text-[#00FF88]' : 'text-[#6B7280] group-focus-within:text-[#2563EB]'}`} />
            <Input
              placeholder="Search priority projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 font-mono border-2 transition-all duration-200 ${isDark 
                ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
              }`}
            />
          </div>
          
          <Button
            variant="outline"
            className={`font-mono border-2 transition-all duration-200 ${isDark 
              ? 'border-[#00FF88]/50 text-[#00FF88] hover:bg-[#00FF88]/10' 
              : 'border-[#2563EB]/50 text-[#2563EB] hover:bg-[#2563EB]/10'
            }`}
            onClick={() => window.location.href = '/dashboard'}
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed rounded-xl border-[#1F2937]">
            <Star className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'}`} />
            <h3 className={`font-mono font-bold mb-2 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
              No Priority Projects
            </h3>
            <p className={`font-mono text-sm mb-4 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
              Mark projects as priority or set High/Medium priority level to see them here.
            </p>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className={`font-mono border-2 ${
                isDark 
                  ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88]' 
                  : 'bg-[#2563EB] text-white border-[#2563EB]'
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
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    relative p-4 rounded-xl border overflow-hidden group cursor-pointer
                    transition-all duration-300 ease-out
                    transform hover:-translate-y-1 hover:shadow-xl
                    ${isDark
                      ? "bg-[#161B22] border-[#1F2937] hover:border-[#1F2937]"
                      : "bg-white border-[#E5E7EB] hover:border-[#E5E7EB]"}
                  `}
                  style={{ borderLeft: `3px solid ${accent}` }}
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
                        ? 'bg-[#0B0F14] text-[#6B7280] hover:text-[#EF4444]' 
                        : 'bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#DC2626]'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative">
                    <div className="flex items-start gap-3 mb-3">
                      <div 
                        className="w-12 h-12 rounded-xl overflow-hidden border flex-shrink-0 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center"
                        style={{ background: isDark ? '#0B0F14' : '#F3F4F6', borderColor: isDark ? '#1F2937' : '#E5E7EB' }}
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
                        <h3 className={`font-mono font-bold text-sm transition-colors truncate ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
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
                            <span className={`text-[10px] font-mono flex items-center gap-1 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                              <Wallet className="w-2.5 h-2.5" />
                              {project.walletCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-2 p-2 rounded-lg mb-3 border ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: project.completed ? '#10B981' : '#F59E0B' }} />
                      <span className={`text-[10px] font-mono flex-1 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                        {project.completed ? 'Completed' : 'In Progress'}
                      </span>
                      {project.deadline && (
                        <span className={`text-[10px] font-mono flex items-center gap-1 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className={`w-full font-mono text-[10px] border transition-all duration-200 ${isDark 
                        ? 'border-[#1F2937] text-[#E5E7EB] hover:bg-[#00FF88]/10 hover:border-[#00FF88] hover:text-[#00FF88]' 
                        : 'border-[#E5E7EB] text-[#111827] hover:bg-[#2563EB]/10 hover:border-[#2563EB] hover:text-[#2563EB]'
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
                </motion.div>
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