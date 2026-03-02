// src/components/landing/FeaturesSection.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { LayoutDashboard, Zap, Users, Shield } from 'lucide-react';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Multi-Account Dashboard',
    description: 'Manage multiple wallets & projects in one place.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Zap,
    title: 'Realtime Airdrop Checker',
    description: 'Check airdrop & task status instantly.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite your team, track progress, and assign tasks together.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Shield,
    title: 'Data Privacy & Security',
    description: 'Encrypted data, your privacy & security are protected.',
    color: 'from-orange-500 to-orange-600',
  },
];

export function FeaturesSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 ${
            isDark ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'bg-blue-100 text-blue-600'
          }`}>
            Features
          </span>
          <h2 className={`text-3xl sm:text-4xl font-bold font-mono mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Why Use Alpha Tracker?
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Everything you need for efficient airdrop hunting and project management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
                isDark 
                  ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50' 
                  : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-lg font-bold font-mono mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}