// src/components/landing/DetailedFeatures.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Star, TrendingUp, Brain, DollarSign, Bell, Monitor } from 'lucide-react';

const detailedFeatures = [
  {
    icon: Star,
    title: 'Priority Projects',
    description: 'Manage your most important airdrop projects with smart countdown timers, task tracking, and automatic notifications.',
    points: ['Real-time countdown timers', 'Task management with progress', 'Smart reset intervals'],
    color: 'from-orange-400 to-red-500',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Market Data',
    description: 'Track live market prices, trends, and get professional charts integrated with TradingView.',
    points: ['Live price updates every 10 minutes', 'Professional TradingView charts', 'Market heatmap visualization'],
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: Brain,
    title: 'AI-Powered Tools',
    description: 'Leverage artificial intelligence to generate airdrop projects, smart search, and discover trending opportunities.',
    points: ['AI Airdrop Generator', 'Smart search & auto-complete', 'Trending airdrops detection'],
    color: 'from-purple-400 to-pink-500',
  },
  {
    icon: DollarSign,
    title: 'Advanced Financial Tools',
    description: 'Calculate profits, manage multiple accounts, and track your portfolio performance with professional tools.',
    points: ['Retroactive profit/loss calculation', 'Multiple account management', 'Portfolio performance tracking'],
    color: 'from-blue-400 to-cyan-500',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Never miss important deadlines with intelligent notifications, real-time alerts, and community chat features.',
    points: ['Global priority notifications', 'Push notifications support', 'Real-time community chat'],
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: Monitor,
    title: 'Modern Experience',
    description: 'Enjoy a seamless experience with PWA support, responsive design, and real-time updates across all devices.',
    points: ['PWA - Install as mobile app', 'Dark/Light mode toggle', 'Real-time live updates'],
    color: 'from-indigo-400 to-purple-500',
  },
];

export function DetailedFeatures() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl sm:text-4xl font-bold font-mono mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Powerful Features for Web3 Enthusiasts
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Everything you need to manage your projects, track market trends, and maximize your opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {detailedFeatures.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                isDark 
                  ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/30' 
                  : 'bg-white border-gray-200 hover:border-blue-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-lg font-bold font-mono mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.points.map((point, i) => (
                  <li key={i} className={`flex items-center gap-2 text-sm ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isDark ? 'bg-[#00FF88]' : 'bg-blue-500'
                    }`} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}