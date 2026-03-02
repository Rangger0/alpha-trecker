import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  LayoutGrid,
  Twitter,
  ExternalLink,
  X,
  Trash2
} from 'lucide-react';
import { useAirdrops } from '@/hooks/use-airdrops';
import { getEcosystemById } from '@/lib/ecosystems';
import { updateAirdropEcosystem } from '@/services/database';
import { useNavigate, useParams } from 'react-router-dom';

export function EcosystemDetailPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { airdrops, refetch } = useAirdrops();
  
  const ecosystem = getEcosystemById(id || '');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [, setHoveredCard] = useState<string | null>(null);

  if (!ecosystem) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto text-center py-20">
          <h1 className={`text-2xl font-bold font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
            Ecosystem Not Found
          </h1>
          <Button onClick={() => navigate('/ecosystem')} className="mt-4">
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const assignedProjects = airdrops.filter(a => a.ecosystemId === ecosystem.id);
  const availableProjects = airdrops.filter(a => !a.ecosystemId);

  const handleAssignProject = async (projectId: string) => {
    await updateAirdropEcosystem(projectId, ecosystem.id);
    await refetch();
  };

  const handleRemoveProject = async (projectId: string) => {
    if (confirm('Remove this project from ecosystem?')) {
      await updateAirdropEcosystem(projectId, null);
      await refetch();
    }
  };

  const filteredAssigned = assignedProjects.filter(a => 
    a.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const progress = assignedProjects.length > 0
    ? Math.round(assignedProjects.reduce((sum, p) => {
        const completed = p.tasks.filter(t => t.completed).length;
        return sum + (p.tasks.length > 0 ? (completed / p.tasks.length) * 100 : 0);
      }, 0) / assignedProjects.length)
    : 0;

  const cardBaseClasses = `relative p-4 rounded-xl border transition-all duration-300 ease-out overflow-hidden group`;
  
  const cardThemeClasses = isDark 
    ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50' 
    : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/50';

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/ecosystem')}
          className={`mb-6 font-mono ${isDark ? 'text-[#6B7280] hover:text-[#E5E7EB]' : 'text-[#6B7280] hover:text-[#111827]'}`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ecosystems
        </Button>

        <div className={`${cardBaseClasses} ${cardThemeClasses} mb-8`}>
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div 
              className="w-20 h-20 rounded-2xl overflow-hidden border flex-shrink-0"
              style={{ backgroundColor: isDark ? '#0B0F14' : '#F3F4F6', borderColor: isDark ? '#1F2937' : '#E5E7EB' }}
            >
              {!logoError && ecosystem.logo ? (
                <img 
                  src={ecosystem.logo} 
                  alt={ecosystem.name}
                  className="w-full h-full object-cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center font-bold text-3xl"
                  style={{ color: ecosystem.color }}
                >
                  {ecosystem.icon}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className={`text-3xl font-bold font-mono mb-2 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                {ecosystem.name}
              </h1>
              <a 
                href={`https://twitter.com/${ecosystem.twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm font-mono flex items-center gap-2 transition-colors ${isDark ? 'text-[#6B7280] hover:text-[#00FF88]' : 'text-[#6B7280] hover:text-[#2563EB]'}`}
              >
                <Twitter className="w-4 h-4" />
                @{ecosystem.twitterHandle}
              </a>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                <p className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>Projects</p>
                <p className="text-2xl font-bold font-mono" style={{ color: ecosystem.color }}>
                  {assignedProjects.length}
                </p>
              </div>
              <div className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                <p className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>Progress</p>
                <p className="text-2xl font-bold font-mono" style={{ color: ecosystem.color }}>
                  {progress}%
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className={`h-3 rounded-full overflow-hidden border ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'}`}>
              <div 
                className="h-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: ecosystem.color }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative max-w-md group flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-[#6B7280] group-focus-within:text-[#00FF88]' : 'text-[#6B7280] group-focus-within:text-[#2563EB]'}`} />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 font-mono border-2 transition-all ${isDark ? 'bg-[#161B22] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#00FF88]' : 'bg-white border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'}`}
            />
          </div>
          
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className={`font-mono border-2 transition-all duration-200 ${isDark ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90' : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90'}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Projects
          </Button>
        </div>

        {filteredAssigned.length === 0 ? (
          <Card className={`${cardBaseClasses} ${cardThemeClasses}`}>
            <CardContent className="p-12 text-center">
              <LayoutGrid className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'}`} />
              <h3 className={`font-mono font-bold mb-2 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>No Projects Yet</h3>
              <p className={`font-mono text-sm mb-4 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                Add projects from your dashboard to this ecosystem.
              </p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className={`font-mono border-2 ${isDark ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88]' : 'bg-[#2563EB] text-white border-[#2563EB]'}`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Projects
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssigned.map((project) => {
              const projectProgress = project.tasks.length > 0
                ? Math.round((project.tasks.filter(t => t.completed).length / project.tasks.length) * 100)
                : 0;

              return (
                <div
                  key={project.id}
                  className={`${cardBaseClasses} ${cardThemeClasses}`}
                  onMouseEnter={() => setHoveredCard(project.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${ecosystem.color}10 0%, transparent 100%)` }}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg overflow-hidden border ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'}`}>
                          {project.projectLogo ? (
                            <img src={project.projectLogo} alt={project.projectName} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center font-bold ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>
                              {project.projectName[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className={`font-mono font-bold truncate max-w-[150px] ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                            {project.projectName}
                          </h4>
                          <span className={`text-xs font-mono px-2 py-0.5 rounded ${isDark ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'bg-[#2563EB]/10 text-[#2563EB]'}`}>
                            {project.type}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveProject(project.id)}
                        className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${isDark ? 'text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10' : 'text-[#6B7280] hover:text-[#DC2626] hover:bg-[#DC2626]/10'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mb-3">
                      <div className={`flex items-center justify-between text-xs font-mono mb-1 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                        <span>Progress</span>
                        <span style={{ color: ecosystem.color }}>{projectProgress}%</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#0B0F14]' : 'bg-[#F3F4F6]'}`}>
                        <div className="h-full transition-all duration-500" style={{ width: `${projectProgress}%`, backgroundColor: ecosystem.color }} />
                      </div>
                    </div>

                    <Button variant="outline" size="sm" asChild className={`flex-1 font-mono text-xs ${isDark ? 'border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10 hover:text-[#00FF88]' : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10 hover:text-[#2563EB]'}`}>
                      <a href={project.platformLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visit
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className={`w-full max-w-2xl max-h-[80vh] overflow-hidden border-2 ${isDark ? 'bg-[#161B22] border-[#00FF88]/30' : 'bg-white border-[#2563EB]/30'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-xl font-mono font-bold ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                    Add Projects to {ecosystem.name}
                  </h2>
                  <p className={`text-sm font-mono mt-1 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                    {availableProjects.length} projects available
                  </p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-[#1F2937] text-[#6B7280]' : 'hover:bg-[#F3F4F6] text-[#6B7280]'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {availableProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className={`font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                    All projects have been assigned to ecosystems.
                  </p>
                  <Button onClick={() => setIsAddModalOpen(false)} className="mt-4">Close</Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {availableProjects.map((project) => (
                    <div
                      key={project.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-[#0B0F14] border-[#1F2937] hover:border-[#00FF88]/30' : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#2563EB]/30'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg overflow-hidden border ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}`}>
                          {project.projectLogo ? (
                            <img src={project.projectLogo} alt={project.projectName} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center font-bold ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>
                              {project.projectName[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className={`font-mono font-bold ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>{project.projectName}</h4>
                          <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>{project.type}</span>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => handleAssignProject(project.id)}
                        className={`font-mono text-xs ${isDark ? 'bg-[#00FF88] text-[#0B0F14] hover:bg-[#00FF88]/90' : 'bg-[#2563EB] text-white hover:bg-[#2563EB]/90'}`}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}