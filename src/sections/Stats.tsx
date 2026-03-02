import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
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
      color: isDark ? 'text-[#00FF88]' : 'text-[#10B981]'
    },
    {
      label: 'CURRENT_VALUE',
      value: '$28,125',
      change: '+11.2%',
      isPositive: true,
      icon: Wallet,
      color: isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'
    },
    {
      label: 'TOTAL_PROFIT',
      value: '$3,125',
      change: '+11.2%',
      isPositive: true,
      icon: TrendingUp,
      color: isDark ? 'text-[#8B5CF6]' : 'text-[#4F46E5]'
    },
    {
      label: 'ACTIVE_AIRDROPS',
      value: '18',
      change: '+3 new',
      isPositive: true,
      icon: Target,
      color: isDark ? 'text-[#F59E0B]' : 'text-[#EA580C]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className={`border transition-all duration-300 ${
          isDark 
            ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/30' 
            : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/30'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-mono mb-1 ${
                  isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                }`}>{stat.label}</p>
                <p className={`text-2xl font-bold font-mono ${
                  isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                }`}>
                  {stat.value}
                </p>
                <p className={`text-xs font-mono mt-1 ${
                  stat.isPositive
                    ? (isDark ? 'text-[#00FF88]' : 'text-[#10B981]')
                    : (isDark ? 'text-[#EF4444]' : 'text-[#DC2626]')
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded flex items-center justify-center ${
                isDark ? 'bg-[#00FF88]/5 border border-[#00FF88]/20' : 'bg-[#2563EB]/5 border border-[#2563EB]/20'
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