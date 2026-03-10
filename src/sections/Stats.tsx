import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  Wallet,
  Target
} from 'lucide-react';

export const Stats: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const stats = [
    {
      label: 'TOTAL_INVESTED',
      value: '$25,000',
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]'
    },
    {
      label: 'CURRENT_VALUE',
      value: '$28,125',
      change: '+11.2%',
      isPositive: true,
      icon: Wallet,
      color: isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]'
    },
    {
      label: 'TOTAL_PROFIT',
      value: '$3,125',
      change: '+11.2%',
      isPositive: true,
      icon: TrendingUp,
      color: isDark ? 'text-[var(--alpha-violet)]' : 'text-[var(--alpha-violet)]'
    },
    {
      label: 'ACTIVE_AIRDROPS',
      value: '18',
      change: '+3 new',
      isPositive: true,
      icon: Target,
      color: isDark ? 'text-[var(--alpha-warning)]' : 'text-[var(--alpha-warning)]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className={`border transition-all duration-300 ${
          isDark 
            ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] hover:border-[var(--alpha-signal-border)]' 
            : 'bg-white border-[var(--alpha-border)] hover:border-[var(--alpha-signal-border)]'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-mono mb-1 ${
                  isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                }`}>{stat.label}</p>
                <p className={`text-2xl font-bold font-mono ${
                  isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
                }`}>
                  {stat.value}
                </p>
                <p className={`text-xs font-mono mt-1 ${
                  stat.isPositive
                    ? (isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]')
                    : (isDark ? 'text-[var(--alpha-danger)]' : 'text-[var(--alpha-danger)]')
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded flex items-center justify-center ${
                isDark ? 'bg-[var(--alpha-signal-softest)] border border-[var(--alpha-signal-border)]' : 'bg-[var(--alpha-signal-softest)] border border-[var(--alpha-signal-border)]'
              }`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};