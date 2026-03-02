import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressCard } from '@/components/ui/ProgressCard';
import { 
  Layers, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAirdrops } from '@/hooks/use-airdrops';
import { useUsageLimits } from '@/hooks/use-usage-limits';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function OverviewPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { airdrops } = useAirdrops();
  const { limits } = useUsageLimits();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Hitung statistik langsung dari airdrops (sama persis dengan Dashboard)
  const totalProjects = airdrops.length;
  const ongoing = airdrops.filter(a => a.status === 'Ongoing').length;
  const notProcessing = airdrops.filter(a => a.status === 'Planning').length;
  const completed = airdrops.filter(a => a.status === 'Done').length;

  const stats = [
    { 
      id: 'total',
      label: 'TOTAL_PROJECTS', 
      value: totalProjects, 
      change: '+12%',
      icon: Layers, 
      color: isDark ? '#00FF88' : '#2563EB',
      textColor: isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'
    },
    { 
      id: 'ongoing',
      label: 'ONGOING', 
      value: ongoing, 
      change: '+8%',
      icon: TrendingUp, 
      color: isDark ? '#3B82F6' : '#2563EB',
      textColor: isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'
    },
    { 
      id: 'notprocessing',
      label: 'NOT_PROCESSING', 
      value: notProcessing, 
      change: '-5%',
      icon: XCircle, 
      color: isDark ? '#F59E0B' : '#EA580C',
      textColor: isDark ? 'text-[#F59E0B]' : 'text-[#EA580C]'
    },
    { 
      id: 'completed',
      label: 'COMPLETED', 
      value: completed, 
      change: '+15%',
      icon: CheckCircle, 
      color: isDark ? '#00FF88' : '#10B981',
      textColor: isDark ? 'text-[#00FF88]' : 'text-[#10B981]'
    },
  ];

  const quickLinks = [
    { 
      id: 'dashboard',
      title: 'Dashboard', 
      description: 'Monitor all your airdrop activities and stats in one place.',
      path: '/dashboard',
      icon: Layers,
      color: isDark ? '#00FF88' : '#2563EB'
    },
    { 
      id: 'priority',
      title: 'Priority Projects', 
      description: 'Focus on high-potential projects and maximize your rewards.',
      path: '/priority-projects',
      icon: Sparkles,
      color: isDark ? '#8B5CF6' : '#4F46E5'
    },
    { 
      id: 'ecosystem',
      title: 'Ecosystem', 
      description: 'Explore and manage your project ecosystem efficiently.',
      path: '/ecosystem',
      icon: TrendingUp,
      color: isDark ? '#3B82F6' : '#2563EB'
    },
  ];

  const cardBaseClasses = `relative p-5 rounded-xl border transition-all duration-300 ease-out overflow-hidden group cursor-pointer`;
  
  const cardThemeClasses = isDark 
    ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50' 
    : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/50';

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className={`p-8 rounded-2xl border relative overflow-hidden group ${
            isDark 
              ? 'bg-gradient-to-br from-[#161B22] to-[#0B0F14] border-[#1F2937]' 
              : 'bg-gradient-to-br from-white to-[#F3F4F6] border-[#E5E7EB]'
          }`}>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl transition-all duration-1000 group-hover:scale-110 ${
                isDark ? 'bg-[#00FF88]/10' : 'bg-[#2563EB]/10'
              }`} />
            </div>

            <div className="relative z-10">
              <h1 className={`text-4xl font-bold font-mono mb-4 ${
                isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
              }`}>
                Manage, Track, and Earn from Your Airdrop Journey
              </h1>
              <p className={`font-mono text-sm mb-6 max-w-2xl ${
                isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
              }`}>
                All-in-one dashboard for airdrop hunters, project managers, and web3 enthusiasts.
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className={`font-mono border-2 transition-all duration-200 hover:scale-105 ${
                  isDark 
                    ? 'bg-transparent border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88] hover:text-[#0B0F14]' 
                    : 'bg-transparent border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white'
                }`}
              >
                Explore Features
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Premium Banner */}
        <Card className={`mb-8 border overflow-hidden relative group ${
          isDark 
            ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-[#3B82F6]/20 border-[#8B5CF6]/30' 
            : 'bg-gradient-to-r from-[#4F46E5]/10 to-[#2563EB]/10 border-[#4F46E5]/30'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <CardContent className="p-6 flex items-center justify-between relative">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center animate-bounce ${
                isDark ? 'bg-[#8B5CF6]/20' : 'bg-[#4F46E5]/20'
              }`}>
                <Sparkles className={`w-6 h-6 ${isDark ? 'text-[#8B5CF6]' : 'text-[#4F46E5]'}`} />
              </div>
              <div>
                <h3 className={`font-mono font-bold ${
                  isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                }`}>
                  Unlock Premium Features
                </h3>
                <p className={`font-mono text-xs ${
                  isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                }`}>
                  Upgrade to Author role and get access to 500 documents, 15 tasks per document, 50 project priorities, and more!
                </p>
              </div>
            </div>
            <Button
              className={`font-mono border transition-all duration-300 hover:scale-105 ${
                isDark 
                  ? 'bg-white text-[#0B0F14] border-white hover:bg-[#E5E7EB]' 
                  : 'bg-[#111827] text-white border-[#111827] hover:bg-[#374151]'
              }`}
            >
              Become an Author
            </Button>
          </CardContent>
        </Card>

        {/* Stats Cards - Sama persis dengan Ecosystem */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const isHovered = hoveredCard === stat.id;
            
            return (
              <div
                key={stat.id}
                onMouseEnter={() => setHoveredCard(stat.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`${cardBaseClasses} ${cardThemeClasses} ${isHovered ? 'transform -translate-y-2 shadow-2xl' : ''}`}
              >
                {/* Radial Gradient Glow - Sama dengan Ecosystem */}
                <div 
                  className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none`}
                  style={{ 
                    background: `radial-gradient(circle at 50% 0%, ${stat.color}20 0%, transparent 70%)`
                  }}
                />

                {/* Shine Effect */}
                <div 
                  className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
                  style={{
                    background: `linear-gradient(105deg, transparent 40%, ${stat.color}10 50%, transparent 60%)`,
                    transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
                    transition: 'transform 0.8s ease-out, opacity 0.3s'
                  }}
                />

                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                      {stat.label}
                    </span>
                    <span className={`text-xs font-mono ${
                      stat.change.startsWith('+') 
                        ? isDark ? 'text-[#00FF88]' : 'text-[#10B981]'
                        : isDark ? 'text-[#EF4444]' : 'text-[#DC2626]'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <p 
                      className={`text-3xl font-bold font-mono transition-all duration-300 ${stat.textColor}`}
                      style={{ 
                        textShadow: isHovered ? `0 0 20px ${stat.color}40` : 'none'
                      }}
                    >
                      {String(stat.value).padStart(2, '0')}
                    </p>
                    <div 
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}
                      style={{ 
                        backgroundColor: isDark ? `${stat.color}10` : `${stat.color}10`,
                        border: `1px solid ${isDark ? `${stat.color}30` : `${stat.color}30`}`,
                        boxShadow: isHovered ? `0 0 20px ${stat.color}40` : 'none'
                      }}
                    >
                      <stat.icon 
                        className={`w-5 h-5 transition-all duration-300 ${stat.textColor}`}
                        style={{ 
                          filter: isHovered ? `drop-shadow(0 0 8px ${stat.color})` : 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Usage & Limits */}
        <div className="mb-8">
          <h2 className={`text-lg font-mono font-bold mb-4 ${
            isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
          }`}>
            Your Usage & Limits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProgressCard 
              title="Documents" 
              used={limits.documents.used} 
              limit={limits.documents.limit} 
            />
            <ProgressCard 
              title="Ecosystem" 
              used={limits.ecosystem.used} 
              limit={limits.ecosystem.limit} 
            />
            <ProgressCard 
              title="Project Priorities" 
              used={limits.priorities.used} 
              limit={limits.priorities.limit} 
            />
            <ProgressCard 
              title="Reminder Daily" 
              used={limits.reminderDaily.used} 
              limit={limits.reminderDaily.limit} 
            />
            <ProgressCard 
              title="Reminder Once" 
              used={limits.reminderOnce.used} 
              limit={limits.reminderOnce.limit} 
            />
            <ProgressCard 
              title="Notes per Document" 
              used={limits.notesPerDoc.used} 
              limit={limits.notesPerDoc.limit} 
            />
            <ProgressCard 
              title="Tasks per Document" 
              used={limits.tasksPerDoc.used} 
              limit={limits.tasksPerDoc.limit} 
            />
            <ProgressCard 
              title="Multiple Accounts per Document" 
              used={limits.multipleAccounts.used} 
              limit={limits.multipleAccounts.limit} 
            />
            <ProgressCard 
              title="Retroactive Projects per Document" 
              used={limits.retroactive.used} 
              limit={limits.retroactive.limit} 
            />
          </div>
        </div>

        {/* Quick Links - Sama persis dengan Ecosystem */}
        <div>
          <h2 className={`text-lg font-mono font-bold mb-4 ${
            isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
          }`}>
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link) => {
              const isHovered = hoveredCard === link.id;
              
              return (
                <div
                  key={link.id}
                  onClick={() => navigate(link.path)}
                  onMouseEnter={() => setHoveredCard(link.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`${cardBaseClasses} ${cardThemeClasses} ${isHovered ? 'transform -translate-y-2 shadow-2xl' : ''}`}
                >
                  {/* Radial Gradient Glow */}
                  <div 
                    className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none`}
                    style={{ 
                      background: `radial-gradient(circle at 50% 0%, ${link.color}20 0%, transparent 70%)`
                    }}
                  />

                  {/* Shine Effect */}
                  <div 
                    className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
                    style={{
                      background: `linear-gradient(105deg, transparent 40%, ${link.color}10 50%, transparent 60%)`,
                      transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
                      transition: 'transform 0.8s ease-out, opacity 0.3s'
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div 
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}
                        style={{ 
                          backgroundColor: isDark ? `${link.color}10` : `${link.color}10`,
                          border: `1px solid ${isDark ? `${link.color}30` : `${link.color}30`}`,
                          boxShadow: isHovered ? `0 0 20px ${link.color}40` : 'none'
                        }}
                      >
                        <link.icon 
                          className={`w-5 h-5 transition-all duration-300`}
                          style={{ color: link.color }}
                        />
                      </div>
                      <ArrowRight 
                        className={`w-5 h-5 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}
                        style={{ color: isDark ? '#6B7280' : '#6B7280' }}
                      />
                    </div>
                    
                    <h3 
                      className={`font-mono font-bold mb-1 transition-colors duration-300 ${
                        isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                      }`}
                      style={{ 
                        color: isHovered ? link.color : (isDark ? '#E5E7EB' : '#111827')
                      }}
                    >
                      {link.title}
                    </h3>
                    <p className={`font-mono text-xs ${
                      isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                    }`}>
                      {link.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}