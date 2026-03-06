import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressCard } from '@/components/ui/ProgressCard';
import {
  Layers,
  TrendingUp,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Wallet,
  BarChart3,
  ChevronRight,
  Zap,
  Users,
  Bot,
  Wrench,
  Repeat,
  Droplets
} from 'lucide-react';
import { useAirdrops } from '@/hooks/use-airdrops';
import { useUsageLimits } from '@/hooks/use-usage-limits';
import { useNavigate } from 'react-router-dom';

export function OverviewPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { airdrops } = useAirdrops();
  const { limits } = useUsageLimits();
  const navigate = useNavigate();

  // Hitung statistik
  const totalProjects = airdrops.length;
  const ongoing = airdrops.filter(a => a.status === 'Ongoing').length;
  const notProcessing = airdrops.filter(a => a.status === 'Planning').length;
  const completed = airdrops.filter(a => a.status === 'Done').length;

  const stats = [
    {
      id: 'total',
      label: 'Total Projects',
      value: totalProjects,
      change: '+12%',
      icon: Layers,
      color: isDark ? '#00FF88' : '#10B981',
      borderColor: isDark ? 'border-l-[3px] border-l-[#00FF88]' : 'border-l-[3px] border-l-[#10B981]'
    },
    {
      id: 'ongoing',
      label: 'Ongoing',
      value: ongoing,
      change: '+8%',
      icon: TrendingUp,
      color: isDark ? '#3B82F6' : '#2563EB',
      borderColor: isDark ? 'border-l-[3px] border-l-[#3B82F6]' : 'border-l-[3px] border-l-[#2563EB]'
    },
    {
      id: 'completed',
      label: 'Completed',
      value: completed,
      change: '+15%',
      icon: CheckCircle,
      color: isDark ? '#00FF88' : '#10B981',
      borderColor: isDark ? 'border-l-[3px] border-l-[#00FF88]' : 'border-l-[3px] border-l-[#10B981]'
    },
    {
      id: 'notprocessing',
      label: 'Not Processing',
      value: notProcessing,
      change: '-5%',
      icon: XCircle,
      color: isDark ? '#F59E0B' : '#EA580C',
      borderColor: isDark ? 'border-l-[3px] border-l-[#F59E0B]' : 'border-l-[3px] border-l-[#EA580C]'
    },
    {
      id: 'success',
      label: 'Success Rate',
      value: totalProjects > 0 ? Math.round((completed / totalProjects) * 100) + '%' : '0%',
      change: '+23%',
      icon: Zap,
      color: isDark ? '#8B5CF6' : '#4F46E5',
      borderColor: isDark ? 'border-l-[3px] border-l-[#8B5CF6]' : 'border-l-[3px] border-l-[#4F46E5]'
    },
  ];

  const quickLinks = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      subtitle: 'Monitor all activities',
      path: '/dashboard',
      icon: BarChart3,
      color: isDark ? '#00FF88' : '#10B981',
      borderColor: isDark ? 'border-l-[3px] border-l-[#00FF88]' : 'border-l-[3px] border-l-[#10B981]'
    },
    {
      id: 'priority',
      title: 'Priority',
      subtitle: 'High-potential rewards',
      path: '/priority-projects',
      icon: Sparkles,
      color: isDark ? '#8B5CF6' : '#4F46E5',
      borderColor: isDark ? 'border-l-[3px] border-l-[#8B5CF6]' : 'border-l-[3px] border-l-[#4F46E5]'
    },
    {
      id: 'ecosystem',
      title: 'Ecosystem',
      subtitle: 'Manage projects',
      path: '/ecosystem',
      icon: Wallet,
      color: isDark ? '#3B82F6' : '#2563EB',
      borderColor: isDark ? 'border-l-[3px] border-l-[#3B82F6]' : 'border-l-[3px] border-l-[#2563EB]'
    },
    {
      id: 'screening',
      title: 'Screening',
      subtitle: 'Wallet analysis',
      path: '/screening',
      icon: Wallet,
      color: isDark ? '#00FF88' : '#10B981',
      borderColor: isDark ? 'border-l-[3px] border-l-[#00FF88]' : 'border-l-[3px] border-l-[#10B981]'
    },
  ];

  const tools = [
    {
      id: 'faucet',
      title: 'Faucet',
      subtitle: 'Get testnet tokens',
      path: '/faucet',
      icon: Droplets,
      color: isDark ? '#3B82F6' : '#2563EB',
      borderColor: isDark ? 'border-l-[3px] border-l-[#3B82F6]' : 'border-l-[3px] border-l-[#2563EB]'
    },
    {
      id: 'multi',
      title: 'Multi Account',
      subtitle: 'Manage accounts',
      path: '/multiple-account',
      icon: Users,
      color: isDark ? '#F59E0B' : '#EA580C',
      borderColor: isDark ? 'border-l-[3px] border-l-[#F59E0B]' : 'border-l-[3px] border-l-[#EA580C]'
    },
    {
      id: 'ai',
      title: 'AI Tools',
      subtitle: 'AI assistants for coding, research, and crypto analysis',
      path: '/ai-tools',
      icon: Bot,
      color: isDark ? '#5cceff' : '#2bcaf6',
      borderColor: isDark ? 'border-l-[3px] border-l-[#5cceff]' : 'border-l-[3px] border-l-[#2bcaf6]'
    },
    {
      id: 'tools',
      title: 'Tools',
      subtitle: 'Utilities and helper tools',
      path: '/tools',
      icon: Wrench,
      color: isDark ? '#F97316' : '#EA580C',
      borderColor: isDark ? 'border-l-[3px] border-l-[#F97316]' : 'border-l-[3px] border-l-[#EA580C]'
    },
    {
      id: 'swap',
      title: 'Swap & Bridge',
      subtitle: 'Token swap and cross-chain bridge',
      path: '/swap-bridge',
      icon: Repeat,
      color: isDark ? '#10B981' : '#059669',
      borderColor: isDark ? 'border-l-[3px] border-l-[#10B981]' : 'border-l-[3px] border-l-[#059669]'
    },
  ];

  const handleNavigate = (path: string) => navigate(path);

  return (
    <DashboardLayout>
      <div className="macos-root macos-page-shell">
        {/* Welcome Header */}
        <div className="macos-page-header macos-animate-up">
          <div className="macos-page-kicker">
            <Sparkles className="h-3.5 w-3.5" />
            Mission Control
          </div>
          <h1 className="macos-page-title">Overview</h1>
          <p className="macos-page-subtitle">
            Ringkasan workspace Anda dalam satu panel macOS style yang lebih halus, cepat dibaca, dan konsisten dengan dashboard baru.
          </p>
        </div>

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`macos-premium-card macos-sheen relative cursor-pointer p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md ${stat.borderColor}`}
                style={{ borderColor: 'var(--alpha-border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>{stat.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${stat.change.startsWith('+') ? (isDark ? 'bg-[#00FF88]/20 text-[#00FF88]' : 'bg-green-100 text-green-600') : (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600')}`}>
                    {stat.change}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-bold font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                    {typeof stat.value === 'number' ? String(stat.value).padStart(2, '0') : stat.value}
                  </p>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Usage & Limits */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-sm font-bold font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>Usage & Limits</h2>
            <button className={`text-xs font-mono flex items-center gap-1 transition-colors ${isDark ? 'text-[#6B7280] hover:text-[#00FF88]' : 'text-[#6B7280] hover:text-[#2563EB]'}`}>
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
            <ProgressCard title="Documents" used={limits.documents.used} limit={limits.documents.limit} compact />
            <ProgressCard title="Ecosystem" used={limits.ecosystem.used} limit={limits.ecosystem.limit} compact />
            <ProgressCard title="Priorities" used={limits.priorities.used} limit={limits.priorities.limit} compact />
            <ProgressCard title="Reminders" used={limits.reminderDaily.used} limit={limits.reminderDaily.limit} compact />
            <ProgressCard title="Notes" used={limits.notesPerDoc.used} limit={limits.notesPerDoc.limit} compact />
            <ProgressCard title="Tasks" used={limits.tasksPerDoc.used} limit={limits.tasksPerDoc.limit} compact />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-6">
          <div className="macos-section-label">
            <ArrowRight className="h-3.5 w-3.5" />
            Quick Links
          </div>
          <h2 className={`text-sm font-bold font-mono mb-3 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>Quick Links</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <div
                  key={link.id}
                  onClick={() => handleNavigate(link.path)}
                  className={`macos-premium-card group relative cursor-pointer p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md ${link.borderColor}`}
                  style={{ borderColor: 'var(--alpha-border)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${link.color}15` }}>
                        <Icon className="w-5 h-5" style={{ color: link.color }} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>{link.title}</h3>
                        <p className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>{link.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5`} style={{ color: isDark ? '#6B7280' : '#9CA3AF' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tools */}
        <div className="mb-6">
          <div className="macos-section-label">
            <Wrench className="h-3.5 w-3.5" />
            Tools
          </div>
          <h2 className={`text-sm font-bold font-mono mb-3 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>Tools</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleNavigate(tool.path)}
                  className={`macos-premium-card group relative cursor-pointer p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md ${tool.borderColor}`}
                  style={{ borderColor: 'var(--alpha-border)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${tool.color}15` }}>
                        <Icon className="w-4 h-4" style={{ color: tool.color }} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>{tool.title}</h3>
                        <p className={`text-[10px] font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>{tool.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }} />
                  </div>
                </div>
              );
            })}

            <div className={`macos-empty-state p-4`} style={{ borderColor: 'var(--alpha-border)' }}>
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>More tools coming soon</span>
            </div>

            <div className={`macos-empty-state p-4`} style={{ borderColor: 'var(--alpha-border)' }}>
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>More tools coming soon</span>
            </div>
          </div>
        </div>

        {/* Premium Banner */}
        <Card className="macos-premium-card">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ background: isDark ? 'rgba(139,92,246,0.08)' : '#f3e8ff' }}>
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-[#8B5CF6]' : 'text-purple-600'}`} />
              </div>
              <div>
                <h3 className={`font-bold text-sm font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>Unlock Premium Features</h3>
                <p className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>Get access to 500 documents, 50 priorities, unlimited tasks, and advanced analytics!</p>
              </div>
            </div>
            <Button size="sm" className={`macos-btn macos-btn--primary`}>
              Upgrade Now
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
