// PriorityProjectsPage.tsx
import { useState, useMemo, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/EmptyState';
import { 
  Search, 
  ArrowRight, 
  Star, 
  Flag, 
  Clock, 
  Wallet,
  X
} from 'lucide-react';
import { useAirdrops } from '@/hooks/use-airdrops';
import { useWallets } from '@/hooks/use-wallets';
import type { Airdrop, PriorityLevel } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
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
  is_priority?: boolean;  // <-- tambah ini  // <-- keep ini untuk backward compatibility
  deadline?: string;
  priority: PriorityLevel;
  rawAirdrop: Airdrop;
}

export function PriorityProjectsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { airdrops, refetch } = useAirdrops();
  const { wallets } = useWallets();
  const [searchQuery, setSearchQuery] = useState('');
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
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
    // FIX: Hanya filter berdasarkan isPriority = true, ignore High/Medium/Low
       const filtered = airdrops.filter((a: Airdrop) => {
       return a.isPriority === true;  // ← cek camelCase (sesuai mapping di getAirdropsByUserId)
         });

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
        isPriority: airdrop.isPriority,
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
  console.log('=== REMOVE DEBUG ===');
  console.log('Removing ID:', removingId);
  try {
    const { error } = await supabase
      .from('airdrops')
      .update({ 
        is_priority: false,  // ← snake_case ke Supabase (BENAR)
        priority: 'Low'
      })
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

  const handleAirdropSubmit = async () => {
    setTimeout(() => refetch(), 500);
    handleModalClose();
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch(priority) {
      case 'High': 
        return { 
          label: 'High', 
          color: isDark ? 'text-red-400 bg-red-400/10 border-red-400/30' : 'text-red-600 bg-red-50 border-red-200',
          icon: <Flag className="w-3 h-3" />
        };
      case 'Medium': 
        return { 
          label: 'Medium', 
          color: isDark ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' : 'text-yellow-600 bg-yellow-50 border-yellow-200',
          icon: <Flag className="w-3 h-3" />
        };
      case 'Low': 
        return { 
          label: 'Low', 
          color: isDark ? 'text-[#00FF88] bg-[#00FF88]/10 border-[#00FF88]/30' : 'text-green-600 bg-green-50 border-green-200',
          icon: <Flag className="w-3 h-3" />
        };
    }
  };

  const cardBaseClasses = `relative p-6 rounded-xl border transition-all duration-300 ease-out overflow-hidden group cursor-pointer`;
  
  const cardThemeClasses = isDark 
    ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]' 
    : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]';

  const removingProject = priorityProjects.find(p => p.id === removingId);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-[#00FF88]/10' : 'bg-[#2563EB]/10'}`}>
                <Star className={`w-5 h-5 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`} />
              </div>
              <h1 className={`text-2xl font-bold font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                Priority Projects
              </h1>
            </div>
            <p className={`font-mono text-sm ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
              Sorted by priority level, deadline urgency, and wallet count.
            </p>
          </div>
          
          <Button
            variant="outline"
            className={`font-mono border-2 transition-all duration-200 ${isDark 
              ? 'border-[#00FF88]/50 text-[#00FF88] hover:bg-[#00FF88]/10 hover:border-[#00FF88]' 
              : 'border-[#2563EB]/50 text-[#2563EB] hover:bg-[#2563EB]/10 hover:border-[#2563EB]'
            }`}
            onClick={() => window.location.href = '/dashboard'}
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Stats Card */}
        <div className={`${cardBaseClasses} ${cardThemeClasses} mb-6`}>
          <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${isDark ? 'from-[#00FF88]/20 via-transparent to-[#00FF88]/20' : 'from-[#2563EB]/20 via-transparent to-[#2563EB]/20'}`} />
          
          <div className="relative flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Star className={`w-4 h-4 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`} />
              <span className={`font-mono text-sm ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                {priorityProjects.length} Priority Projects
              </span>
            </div>
            <div className={`w-px h-6 ${isDark ? 'bg-[#1F2937]' : 'bg-[#E5E7EB]'}`} />
            <div className="flex items-center gap-2">
              <Wallet className={`w-4 h-4 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`} />
              <span className={`font-mono text-sm ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                {wallets.length} Total Wallets
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md group">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-[#6B7280] group-focus-within:text-[#00FF88]' : 'text-[#6B7280] group-focus-within:text-[#2563EB]'}`} />
            <Input
              placeholder="Search priority projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 font-mono border transition-all duration-200 ${isDark 
                ? 'bg-[#161B22] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88]/20' 
                : 'bg-white border-[#E5E7EB] text-[#111827] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20'
              }`}
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <Card className={`${cardBaseClasses} ${cardThemeClasses}`}>
            <CardContent className="p-12 text-center relative">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-[#0B0F14]' : 'bg-[#F3F4F6]'}`}>
                <Star className={`w-8 h-8 ${isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'}`} />
              </div>
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
                    ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90' 
                    : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90'
                }`}
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: PriorityProject, index: number) => {
              const priorityBadge = getPriorityBadge(project.priority);
              const isHovered = hoveredCard === project.id;
              
              return (
                <div 
                  key={project.id} 
                  className={`${cardBaseClasses} ${cardThemeClasses}`}
                  onMouseEnter={() => setHoveredCard(project.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${isDark ? 'from-[#00FF88]/20 via-transparent to-[#00FF88]/20' : 'from-[#2563EB]/20 via-transparent to-[#2563EB]/20'}`} />
                  
                  <button
                    onClick={(e) => handleRemoveClick(e, project)}
                    className={`absolute top-4 right-4 z-20 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                      isDark 
                        ? 'bg-[#0B0F14] text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10' 
                        : 'bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#DC2626]/10'
                    }`}
                    title="Remove from priority"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="relative">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl overflow-hidden border flex-shrink-0 transition-transform duration-300 ${isHovered ? 'scale-110' : ''} ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'}`}>
                        {project.logo && !logoError[project.id] ? (
                          <img 
                            src={project.logo} 
                            alt={project.name}
                            className="w-full h-full object-cover"
                            onError={() => handleLogoError(project.id)}
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center font-bold text-lg ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>
                            {project.icon}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-mono font-bold text-lg transition-colors truncate ${isDark ? 'text-[#E5E7EB] group-hover:text-[#00FF88]' : 'text-[#111827] group-hover:text-[#2563EB]'}`}>
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-xs font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${priorityBadge.color}`}>
                            {priorityBadge.icon}
                            {priorityBadge.label}
                          </span>
                          {project.walletCount > 0 && (
                            <span className={`text-xs font-mono flex items-center gap-1 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                              <Wallet className="w-3 h-3" />
                              {project.walletCount}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <span className={`font-mono text-2xl font-bold opacity-10 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>
                        #{index + 1}
                      </span>
                    </div>
                    
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`block text-xs font-mono mb-4 truncate transition-colors ${isDark ? 'text-[#6B7280] hover:text-[#00FF88]' : 'text-[#6B7280] hover:text-[#2563EB]'}`}
                    >
                      {project.link}
                    </a>

                    <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 border transition-colors ${isDark ? 'bg-[#0B0F14] border-[#1F2937] group-hover:border-[#00FF88]/30' : 'bg-[#F9FAFB] border-[#E5E7EB] group-hover:border-[#2563EB]/30'}`}>
                      <div className={`w-2 h-2 rounded-full ${project.completed ? 'bg-[#00FF88]' : 'bg-[#F59E0B]'}`} />
                      <span className={`text-xs font-mono flex-1 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                        {project.completed ? 'Completed' : 'In Progress'}
                      </span>
                      {project.deadline && (
                        <span className={`text-xs font-mono flex items-center gap-1 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                          <Clock className="w-3 h-3" />
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      className={`w-full font-mono text-xs border-2 transition-all duration-200 ${isDark 
                        ? 'border-[#1F2937] text-[#E5E7EB] hover:bg-[#00FF88]/10 hover:border-[#00FF88] hover:text-[#00FF88]' 
                        : 'border-[#E5E7EB] text-[#111827] hover:bg-[#2563EB]/10 hover:border-[#2563EB] hover:text-[#2563EB]'
                      }`}
                      onClick={() => handleViewDetails(project)}
                    >
                      View Details
                      <ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AirdropModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSubmit={handleAirdropSubmit}
        mode="edit"
        airdrop={selectedAirdrop}
        isDark={isDark}
      />

      <DeleteConfirmModal
        isOpen={isRemoveModalOpen}
        onClose={() => {
          setIsRemoveModalOpen(false);
          setRemovingId(null);
        }}
        onConfirm={confirmRemove}
        projectName={removingProject?.name || 'this project'}
        isDark={isDark}
        title="Remove from Priority"
        description={`This will remove the project from your priority list, but it will remain in your dashboard. You can add it back to priority anytime.`}
        confirmLabel="Remove"
        variant="remove"
      />
    </DashboardLayout>
  );
}