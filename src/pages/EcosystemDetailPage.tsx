import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { motion } from 'framer-motion';
import { setEcosystemCssVars, hexToRgba, normalizeLogoUrl } from '@/lib/utils';
import { getPublicUrlFromBuckets } from '@/services/storage';

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
  const [logoSrc, setLogoSrc] = useState<string | undefined>(undefined);

  // ref to the container so we can set per-ecosystem CSS vars
  const containerRef = useRef<HTMLDivElement | null>(null);

  // apply per-ecosystem CSS vars + theme class
  useEffect(() => {
    if (!containerRef.current || !ecosystem) return;
    setEcosystemCssVars(containerRef.current, ecosystem.color || '#00BFA6', isDark);

    // ensure only relevant theme classes exist
    containerRef.current.classList.remove('alpha-theme', 'light', 'dark');
    containerRef.current.classList.add('alpha-theme', isDark ? 'dark' : 'light');
  }, [ecosystem, isDark]);

  // compute logoSrc & reset logoError when ecosystem.logo changes
  useEffect(() => {
    setLogoError(false);

    if (!ecosystem?.logo) {
      setLogoSrc(undefined);
      return;
    }

    const raw = ecosystem.logo;

    // If it's already an absolute URL or root-relative path, normalize and use it
    if (/^https?:\/\//i.test(raw) || raw.startsWith('/')) {
      setLogoSrc(normalizeLogoUrl(raw));
      return;
    }

    // Otherwise try to resolve via configured storage buckets
    let cancelled = false;
    (async () => {
      const publicUrl = await getPublicUrlFromBuckets(raw, ['logos', 'public', 'assets']);
      if (!cancelled) setLogoSrc(publicUrl);
    })();

    return () => { cancelled = true; };
  }, [ecosystem?.logo]);

  if (!ecosystem) {
    return (
      <DashboardLayout>
        <div className="w-full px-6 py-20 text-center macos-root">
          <h1 className={`text-2xl font-bold font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
            Ecosystem Not Found
          </h1>
          <Button onClick={() => navigate('/ecosystem')} className="mt-4 macos-btn macos-btn--ghost">
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

  const accentBase = ecosystem.color || '#00BFA6';

  return (
    <DashboardLayout>
      <div
        ref={containerRef}
        className="w-full px-6 py-6 macos-root"
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/ecosystem')}
          className={`mb-6 font-mono macos-btn macos-btn--ghost ${isDark ? 'text-[#6B7280] hover:text-[#E5E7EB]' : 'text-[#6B7280] hover:text-[#111827]'}`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ecosystems
        </Button>

        {/* Ecosystem Header Card */}
        <div
          className="mb-8 p-6 rounded-xl border overflow-hidden relative group macos-card macos-panel"
          style={{ borderLeft: `3px solid var(--ecosystem-accent, ${accentBase})` }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: `linear-gradient(135deg, var(--ecosystem-accent-bg, ${hexToRgba(accentBase, 0.06)}) 0%, transparent 50%)` }}
          />

          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden border flex items-center justify-center flex-shrink-0"
              style={{ background: isDark ? 'var(--mac-backdrop)' : '#F3F4F6', borderColor: isDark ? '#1F2937' : '#E5E7EB' }}
            >
              {!logoError && logoSrc ? (
                <img
                  src={logoSrc}
                  alt={ecosystem.name}
                  className="w-full h-full object-contain p-3"
                  onError={(e) => {
                    // stop further infinite onerror loops and show fallback icon
                    (e.currentTarget as HTMLImageElement).onerror = null;
                    setLogoError(true);
                    setLogoSrc(undefined);
                  }}
                  loading="lazy"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center font-bold text-3xl"
                  style={{ color: 'var(--ecosystem-accent, ' + accentBase + ')' }}
                >
                  {ecosystem.icon || ecosystem.name?.[0]?.toUpperCase()}
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
              <div className={`px-4 py-3 rounded-xl border`} style={{ background: isDark ? '#0B0F14' : 'var(--ecosystem-accent-bg, rgba(0,191,166,0.12))', borderColor: isDark ? '#1F2937' : 'var(--ecosystem-accent-border, rgba(0,191,166,0.22))' }}>
                <p className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>Projects</p>
                <p className="text-2xl font-bold font-mono" style={{ color: 'var(--ecosystem-accent, ' + accentBase + ')' }}>
                  {assignedProjects.length}
                </p>
              </div>
              <div className={`px-4 py-3 rounded-xl border`} style={{ background: isDark ? '#0B0F14' : 'var(--ecosystem-accent-bg, rgba(0,191,166,0.12))', borderColor: isDark ? '#1F2937' : 'var(--ecosystem-accent-border, rgba(0,191,166,0.22))' }}>
                <p className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>Progress</p>
                <p className="text-2xl font-bold font-mono" style={{ color: 'var(--ecosystem-accent, ' + accentBase + ')' }}>
                  {progress}%
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className={`h-3 rounded-full overflow-hidden border ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'}`}>
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: 'var(--ecosystem-accent, ' + accentBase + ')' }}
              />
            </div>
          </div>
        </div>

        {/* Search and Add */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative max-w-md group flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-[#6B7280] group-focus-within:text-[#00FF88]' : 'text-[#6B7280] group-focus-within:text-[#2563EB]'}`} />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 font-mono macos-input border-2 transition-all ${isDark ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'}`}
            />
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className={`font-mono macos-btn macos-btn--primary border-2 transition-all duration-200 ${isDark ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90' : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90'}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Projects
          </Button>
        </div>

        {/* Assigned projects grid (unchanged) */}
        {filteredAssigned.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed rounded-xl border-[#1F2937] macos-card macos-panel">
            <LayoutGrid className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'}`} />
            <h3 className={`font-mono font-bold mb-2 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>No Projects Yet</h3>
            <p className={`font-mono text-sm mb-4 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
              Add projects from your dashboard to this ecosystem.
            </p>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className={`font-mono macos-btn macos-btn--primary border-2 ${isDark ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88]' : 'bg-[#2563EB] text-white border-[#2563EB]'}`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Projects
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredAssigned.map((project, index) => {
              const projectProgress = project.tasks.length > 0
                ? Math.round((project.tasks.filter(t => t.completed).length / project.tasks.length) * 100)
                : 0;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    relative p-4 rounded-xl border overflow-hidden group
                    transition-all duration-300 ease-out
                    transform hover:-translate-y-1 hover:shadow-xl macos-card
                    ${isDark
                      ? "bg-[#161B22] border-[#1F2937] hover:border-[#1F2937]"
                      : "bg-white border-[#E5E7EB] hover:border-[#E5E7EB]"}
                  `}
                  style={{ borderLeft: `3px solid var(--ecosystem-accent, ${accentBase})` }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                    style={{ background: `linear-gradient(135deg, var(--ecosystem-accent-bg, ${hexToRgba(accentBase, 0.05)}) 0%, transparent 50%)` }}
                  />

                  <button
                    onClick={() => handleRemoveProject(project.id)}
                    className={`absolute top-2 right-2 z-20 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                      isDark ? 'bg-[#0B0F14] text-[#6B7280] hover:text-[#EF4444]' : 'bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#DC2626]'
                    }`}
                    aria-label={`Remove ${project.projectName}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl overflow-hidden border flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ background: isDark ? '#0B0F14' : 'var(--ecosystem-accent-bg, rgba(0,191,166,0.12))', borderColor: isDark ? '#1F2937' : 'var(--ecosystem-accent-border, rgba(0,191,166,0.22))' }}
                      >
                        {project.projectLogo ? (
                          <img loading="lazy" src={project.projectLogo} alt={project.projectName} className="w-full h-full object-cover" />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center font-bold text-lg"
                            style={{ color: 'var(--ecosystem-accent, ' + accentBase + ')' }}
                          >
                            {project.projectName[0].toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className={`font-mono font-bold text-sm truncate ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                          {project.projectName}
                        </h4>
                        <span
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded border mt-1 inline-block"
                          style={{ color: 'var(--ecosystem-accent, ' + accentBase + ')', borderColor: 'var(--ecosystem-accent-border, rgba(0,191,166,0.22))', background: 'var(--ecosystem-accent-bg, rgba(0,191,166,0.12))' }}
                        >
                          {project.type}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className={`flex items-center justify-between text-[10px] font-mono mb-1 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                        <span>Progress</span>
                        <span style={{ color: 'var(--ecosystem-accent, ' + accentBase + ')' }}>{projectProgress}%</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#0B0F14]' : 'bg-[#F3F4F6]'}`}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${projectProgress}%`, backgroundColor: 'var(--ecosystem-accent, ' + accentBase + ')' }} />
                      </div>
                    </div>

                    <Button variant="outline" size="sm" asChild className={`w-full font-mono text-[10px] border transition-all ${isDark ? 'border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10 hover:text-[#00FF88]' : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10 hover:text-[#2563EB]'}`}>
                      <a href={project.platformLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visit
                      </a>
                    </Button>
                  </div>

                  <div
                    className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: 'var(--ecosystem-accent, ' + accentBase + ')' }}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Project Modal (unchanged) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm macos-modal" role="dialog" aria-modal="true" aria-label="Add projects modal">
          <div className={`w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-xl border-2 ${isDark ? 'bg-[#161B22] border-[#00FF88]/30' : 'bg-white border-[#2563EB]/30'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-xl font-mono font-bold ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                    Add Projects to {ecosystem.name}
                  </h2>
                  <p className={`text-sm font-mono mt-1 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                    {availableProjects.length} projects available
                  </p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-[#1F2937] text-[#6B7280]' : 'hover:bg-[#F3F4F6] text-[#6B7280]'}`} aria-label="Close add projects">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {availableProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className={`font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                    All projects have been assigned to ecosystems.
                  </p>
                  <Button onClick={() => setIsAddModalOpen(false)} className="mt-4 macos-btn macos-btn--ghost">Close</Button>
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
                            <img loading="lazy" src={project.projectLogo} alt={project.projectName} className="w-full h-full object-cover" />
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
                        className={`font-mono text-xs macos-btn macos-btn--primary ${isDark ? 'bg-[#00FF88] text-[#0B0F14] hover:bg-[#00FF88]/90' : 'bg-[#2563EB] text-white hover:bg-[#2563EB]/90'}`}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
