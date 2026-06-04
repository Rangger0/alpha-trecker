// src/components/landing/FeaturesSection.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { LayoutDashboard, Zap, Users, Shield } from 'lucide-react';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Multi-Account Dashboard',
    description: 'Manage multiple wallets & projects in one place.',
    color: 'from-[color:var(--alpha-main)] to-[color:var(--alpha-main)]',
  },
  {
    icon: Zap,
    title: 'Realtime Airdrop Checker',
    description: 'Check airdrop & task status instantly.',
    color: 'from-[color:var(--alpha-highlight)] to-[color:var(--alpha-highlight)]',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite your team, track progress, and assign tasks together.',
    color: 'from-[color:var(--alpha-main)] to-[color:var(--alpha-main)]',
  },
  {
    icon: Shield,
    title: 'Data Privacy & Security',
    description: 'Encrypted data, your privacy & security are protected.',
    color: 'from-[color:var(--alpha-highlight)] to-[color:var(--alpha-highlight)]',
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
            isDark ? 'bg-[var(--alpha-signal-soft)] text-[var(--alpha-signal)]' : 'bg-[color:var(--alpha-signal-soft)] text-[color:var(--alpha-signal)]'
          }`}>
            Features
          </span>
          <h2 className={`text-3xl sm:text-4xl font-bold font-mono mb-4 ${
            isDark ? 'text-[color:var(--alpha-text)]' : 'text-[color:var(--alpha-text)]'
          }`}>
            Why Use Alpha Tracker?
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-[color:var(--alpha-text-muted)]' : 'text-[color:var(--alpha-text-muted)]'
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
                  ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] hover:border-[var(--alpha-signal)]' 
                  : 'bg-[color:var(--alpha-panel)] border-[color:var(--alpha-border)] hover:border-[color:var(--alpha-signal-border)] shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-[color:var(--alpha-text)]" />
              </div>
              <h3 className={`text-lg font-bold font-mono mb-2 ${
                isDark ? 'text-[color:var(--alpha-text)]' : 'text-[color:var(--alpha-text)]'
              }`}>
                {feature.title}
              </h3>
              <p className={`text-sm ${isDark ? 'text-[color:var(--alpha-text-muted)]' : 'text-[color:var(--alpha-text-muted)]'}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}