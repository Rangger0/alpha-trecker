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
  Globe,
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function OverviewPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { airdrops } = useAirdrops();
  const { limits } = useUsageLimits();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Hitung statistik
  const totalProjects = airdrops.length;
  const ongoing = airdrops.filter(a => a.status === 'Ongoing').length;
  const notProcessing = airdrops.filter(a => a.status === 'Planning').length;
  const completed = airdrops.filter(a => a.status === 'Done').length;

  // Stats layout: 5 card sebaris atau 3 atas 2 bawah lebar
  const stats = [
    { 
      id: 'total',
      label: 'Total Projects', 
      value: totalProjects, 
      change: '+12%',
      icon: Layers, 
      color: isDark ? '#00FF88' : '#10B981',
      borderColor: isDark ? 'border-l-[#00FF88]' : 'border-l-[#10B981]' },
    { 
      id: 'ongoing',
      label: 'Ongoing', 
      value: ongoing, 
      change: '+8%',
      icon: TrendingUp, 
      color: isDark ? '#3B82F6' : '#2563EB',
      borderColor: isDark ? 'border-l-[#3B82F6]' : 'border-l-[#2563EB]' },
    { 
      id: 'completed',
      label: 'Completed', 
      value: completed, 
      change: '+15%',
      icon: CheckCircle, 
      color: isDark ? '#00FF88' : '#10B981',
      borderColor: isDark ? 'border-l-[#00FF88]' : 'border-l-[#10B981]' },
    { 
      id: 'notprocessing',
      label: 'Not Processing', 
      value: notProcessing, 
      change: '-5%',
      icon: XCircle, 
      color: isDark ? '#F59E0B' : '#EA580C',
      borderColor: isDark ? 'border-l-[#F59E0B]' : 'border-l-[#EA580C]' },
    { 
      id: 'success',
      label: 'Success Rate', 
      value: totalProjects > 0 ? Math.round((completed / totalProjects) * 100) + '%' : '0%', 
      change: '+23%',
      icon: Zap, 
      color: isDark ? '#8B5CF6' : '#4F46E5',
      borderColor: isDark ? 'border-l-[#8B5CF6]' : 'border-l-[#4F46E5]' },
  ];

  // Quick links - 4 atau 5 columns
  const quickLinks = [
    { 
      id: 'dashboard',
      title: 'Dashboard', 
      subtitle: 'Monitor all activities',
      path: '/dashboard',
      icon: BarChart3,
      color: isDark ? '#00FF88' : '#10B981',
      borderColor: isDark ? 'border-l-[#00FF88]' : 'border-l-[#10B981]' },
    { 
      id: 'priority',
      title: 'Priority', 
      subtitle: 'High-potential rewards',
      path: '/priority-projects',
      icon: Sparkles,
      color: isDark ? '#8B5CF6' : '#4F46E5',
      borderColor: isDark ? 'border-l-[#8B5CF6]' : 'border-l-[#4F46E5]' },
    { 
      id: 'ecosystem',
      title: 'Ecosystem', 
      subtitle: 'Manage projects',
      path: '/ecosystem',
      icon: Globe,
      color: isDark ? '#3B82F6' : '#2563EB',
      borderColor: isDark ? 'border-l-[#3B82F6]' : 'border-l-[#2563EB]' },
    { 
      id: 'screening',
      title: 'Screening', 
      subtitle: 'Wallet analysis',
      path: '/screening',
      icon: Wallet,
      color: isDark ? '#00FF88' : '#10B981',
      borderColor: isDark ? 'border-l-[#00FF88]' : 'border-l-[#10B981]' },
  ];

  // Tools section - 4 columns
  const tools = [
  { 
    id: 'faucet',
    title: 'Faucet', 
    subtitle: 'Get testnet tokens',
    path: '/faucet',
    icon: Droplets,
    color: isDark ? '#3B82F6' : '#2563EB',
    borderColor: isDark ? 'border-l-[#3B82F6]' : 'border-l-[#2563EB]' },

  { 
    id: 'multi',
    title: 'Multi Account', 
    subtitle: 'Manage accounts',
    path: '/multiple-account',
    icon: Users,
    color: isDark ? '#F59E0B' : '#EA580C',
    borderColor: isDark ? 'border-l-[#F59E0B]' : 'border-l-[#EA580C]' },

  { 
    id: 'ai',
    title: 'AI Tools', 
    subtitle: 'AI assistants for coding, research, and crypto analysis',
    path: '/ai-tools',
    icon: Bot,
    color: isDark ? '#5cceff' : '#2bcaf6',
    borderColor: isDark ? 'border-l-[#5cceff]' : 'border-l-[#2bcaf6]' },

  { 
    id: 'tools',
    title: 'Tools', 
    subtitle: 'Utilities and helper tools',
    path: '/tools',
    icon: Wrench,
    color: isDark ? '#F97316' : '#EA580C',
    borderColor: isDark ? 'border-l-[#F97316]' : 'border-l-[#EA580C]' },

  { 
    id: 'swap',
    title: 'Swap & Bridge', 
    subtitle: 'Token swap and cross-chain bridge',
    path: '/swap-bridge',
    icon: Repeat,
    color: isDark ? '#10B981' : '#059669',
    borderColor: isDark ? 'border-l-[#10B981]' : 'border-l-[#059669]' },
];


  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <DashboardLayout>
      <div className="w-full px-6 py-6">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className={`text-2xl font-bold mb-1 font-mono ${
            isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
          }`}>
               OVERVIEW
          </h1>
          <p className={`text-sm font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
            <span className={isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}>user</span>
          </p>
        </div>

       
        <div className="grid grid-cols-5 gap-4 mb-6">
          {stats.map((stat, index) => {
            const isHovered = hoveredCard === stat.id;
            
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(stat.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`
                  relative p-4 rounded-lg border transition-all duration-300 cursor-pointer
                  ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}
                  ${stat.borderColor} border-l-[3px]
                  ${isHovered ? 'shadow-lg -translate-y-0.5' : 'shadow-sm'}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                    {stat.label}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    stat.change.startsWith('+') 
                      ? isDark ? 'bg-[#00FF88]/20 text-[#00FF88]' : 'bg-green-100 text-green-600'
                      : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-bold font-mono ${
                    isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                  }`}>
                    {typeof stat.value === 'number' ? String(stat.value).padStart(2, '0') : stat.value}
                  </p>
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300"
                    style={{ 
                      backgroundColor: `${stat.color}15`,
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-sm font-bold font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
              Usage & Limits
            </h2>
            <button className={`text-xs font-mono flex items-center gap-1 transition-colors ${
              isDark ? 'text-[#6B7280] hover:text-[#00FF88]' : 'text-[#6B7280] hover:text-[#2563EB]'
            }`}>
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="grid grid-cols-6 gap-3">
            <ProgressCard 
              title="Documents" 
              used={limits.documents.used} 
              limit={limits.documents.limit} 
              compact
            />
            <ProgressCard 
              title="Ecosystem" 
              used={limits.ecosystem.used} 
              limit={limits.ecosystem.limit} 
              compact
            />
            <ProgressCard 
              title="Priorities" 
              used={limits.priorities.used} 
              limit={limits.priorities.limit} 
              compact
            />
            <ProgressCard 
              title="Reminders" 
              used={limits.reminderDaily.used} 
              limit={limits.reminderDaily.limit} 
              compact
            />
            <ProgressCard 
              title="Notes" 
              used={limits.notesPerDoc.used} 
              limit={limits.notesPerDoc.limit} 
              compact
            />
            <ProgressCard 
              title="Tasks" 
              used={limits.tasksPerDoc.used} 
              limit={limits.tasksPerDoc.limit} 
              compact
            />
          </div>
        </div>

     
        <div className="mb-6">
          <h2 className={`text-sm font-bold font-mono mb-3 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
            Quick Links
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {quickLinks.map((link, index) => {
              const isHovered = hoveredCard === link.id;
              const Icon = link.icon;
              
              return (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={() => handleNavigate(link.path)}
                  onMouseEnter={() => setHoveredCard(link.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`
                    relative p-4 rounded-lg border transition-all duration-300 cursor-pointer group
                    ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}
                    ${link.borderColor} border-l-[3px]
                    ${isHovered ? 'shadow-lg -translate-y-0.5' : 'shadow-sm'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300"
                        style={{ 
                          backgroundColor: `${link.color}15`,
                          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: link.color }} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm font-mono ${
                          isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                        }`}>
                          {link.title}
                        </h3>
                        <p className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                          {link.subtitle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight 
                      className={`w-4 h-4 transition-all duration-300 ${
                        isHovered ? 'translate-x-1' : ''
                      }`}
                      style={{ color: isHovered ? link.color : isDark ? '#6B7280' : '#9CA3AF' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

     
        <div className="mb-6">
          <h2 className={`text-sm font-bold font-mono mb-3 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
            Tools
          </h2>
          <div className="grid grid-cols-4 gap-4">
          

{tools.map((tool, index) => {
  const isHovered = hoveredCard === tool.id;
  const IconComponent = tool.icon;
  
  return (
    <motion.div
      key={tool.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 + index * 0.1 }}
      onClick={() => handleNavigate(tool.path)}
      onMouseEnter={() => setHoveredCard(tool.id)}
      onMouseLeave={() => setHoveredCard(null)}
      className={`
        relative p-3 rounded-lg border transition-all duration-300 cursor-pointer group
        ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}
        ${tool.borderColor} border-l-[3px]
        ${isHovered ? 'shadow-lg -translate-y-0.5' : 'shadow-sm'}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300"
            style={{ 
              backgroundColor: `${tool.color}15`,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <IconComponent className="w-4 h-4" style={{ color: tool.color }} />
          </div>
          <div>
            <h3 className={`font-bold text-sm font-mono ${
              isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
            }`}>
              {tool.title}
            </h3>
            <p className={`text-[10px] font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
              {tool.subtitle}
            </p>
          </div>
        </div>
        <ArrowRight 
          className={`w-4 h-4 transition-all duration-300 ${
            isHovered ? 'translate-x-1' : ''
          }`}
          style={{ color: isHovered ? tool.color : isDark ? '#6B7280' : '#9CA3AF' }}
        />
      </div>
    </motion.div>
  );
})}
            
            {/* Placeholder cards untuk mengisi grid jika hanya 2 tools */}
            <div className={`
              p-4 rounded-lg border border-dashed flex items-center justify-center
              ${isDark ? 'border-[#1F2937] bg-[#161B22]/50' : 'border-[#E5E7EB] bg-gray-50'}
            `}>
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
            
            <div className={`
              p-4 rounded-lg border border-dashed flex items-center justify-center
              ${isDark ? 'border-[#1F2937] bg-[#161B22]/50' : 'border-[#E5E7EB] bg-gray-50'}
            `}>
              <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                More tools coming soon
              </span>
            </div>
          </div>
        </div>

        {/* Premium Banner - Full width */}
        <Card className={`
          border overflow-hidden relative group cursor-pointer
          ${isDark 
            ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-[#3B82F6]/20 border-[#8B5CF6]/30' 
            : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'
          }
        `}>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-[#8B5CF6]/20' : 'bg-purple-100'
              }`}>
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-[#8B5CF6]' : 'text-purple-600'}`} />
              </div>
              <div>
                <h3 className={`font-bold text-sm font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                  Unlock Premium Features
                </h3>
                <p className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                  Get access to 500 documents, 50 priorities, unlimited tasks, and advanced analytics!
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className={`
                text-xs font-mono px-6 py-2 h-auto transition-all duration-300
                ${isDark 
                  ? 'bg-white text-[#0B0F14] hover:bg-[#E5E7EB]' 
                  : 'bg-[#111827] text-white hover:bg-[#374151]'
                }
              `}
            >
              Upgrade Now
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}