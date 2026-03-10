import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart,
  Activity
} from 'lucide-react';

interface PortfolioData {
  totalValue: number;
  totalChange: number;
  changePercentage: number;
  distribution: {
    name: string;
    value: number;
    percentage: number;
    color: string;
  }[];
  history: {
    date: string;
    value: number;
  }[];
}

export const PortfolioChart: React.FC = () => {
  const { theme } = useTheme();
  const [data, setData] = useState<PortfolioData>({
    totalValue: 0,
    totalChange: 0,
    changePercentage: 0,
    distribution: [],
    history: []
  });

  const isDark = theme === 'dark';

  // Mock data - ganti dengan data real dari API
  useEffect(() => {
    setData({
      totalValue: 12500.50,
      totalChange: 1250.75,
      changePercentage: 11.12,
      distribution: [
        { name: 'Ethereum', value: 5000, percentage: 40, color: '#627eea' },
        { name: 'BSC', value: 3000, percentage: 24, color: '#f3ba2f' },
        { name: 'Polygon', value: 2500, percentage: 20, color: '#8247e5' },
        { name: 'Arbitrum', value: 2000, percentage: 16, color: '#28a0f0' },
      ],
      history: [
        { date: '2024-01', value: 10000 },
        { date: '2024-02', value: 10500 },
        { date: '2024-03', value: 11200 },
        { date: '2024-04', value: 12500 },
      ]
    });
  }, []);

  const maxValue = Math.max(...data.history.map(h => h.value));
  const minValue = Math.min(...data.history.map(h => h.value));

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`border ${
          isDark ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)]' : 'bg-white border-[var(--alpha-border)]'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-mono mb-1 ${
                  isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                }`}>TOTAL_VALUE</p>
                <p className={`text-2xl font-bold font-mono ${
                  isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
                }`}>
                  ${data.totalValue.toLocaleString()}
                </p>
              </div>
              <div className={`w-10 h-10 rounded flex items-center justify-center ${
                isDark ? 'bg-[var(--alpha-signal-soft)] border border-[var(--alpha-signal-border)]' : 'bg-[var(--alpha-signal-soft)] border border-[var(--alpha-signal-border)]'
              }`}>
                <DollarSign className={`w-5 h-5 ${isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border ${
          isDark ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)]' : 'bg-white border-[var(--alpha-border)]'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-mono mb-1 ${
                  isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                }`}>24H_CHANGE</p>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold font-mono ${
                    data.totalChange >= 0 
                      ? (isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]')
                      : (isDark ? 'text-[var(--alpha-danger)]' : 'text-[var(--alpha-danger)]')
                  }`}>
                    {data.totalChange >= 0 ? '+' : ''}{data.totalChange.toLocaleString()}
                  </p>
                  {data.totalChange >= 0 ? (
                    <TrendingUp className={`w-5 h-5 ${isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]'}`} />
                  ) : (
                    <TrendingDown className={`w-5 h-5 ${isDark ? 'text-[var(--alpha-danger)]' : 'text-[var(--alpha-danger)]'}`} />
                  )}
                </div>
              </div>
              <div className={`w-10 h-10 rounded flex items-center justify-center ${
                data.totalChange >= 0
                  ? (isDark ? 'bg-[var(--alpha-signal-soft)] border border-[var(--alpha-signal-border)]' : 'bg-[var(--alpha-signal-soft)] border border-[var(--alpha-signal-border)]')
                  : (isDark ? 'bg-[var(--alpha-danger-soft)] border border-[var(--alpha-danger-border)]' : 'bg-[var(--alpha-danger-soft)] border border-[var(--alpha-danger-border)]')
              }`}>
                <Activity className={`w-5 h-5 ${
                  data.totalChange >= 0
                    ? (isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]')
                    : (isDark ? 'text-[var(--alpha-danger)]' : 'text-[var(--alpha-danger)]')
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border ${
          isDark ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)]' : 'bg-white border-[var(--alpha-border)]'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-mono mb-1 ${
                  isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                }`}>CHANGE_%</p>
                <p className={`text-2xl font-bold font-mono ${
                  data.changePercentage >= 0 
                    ? (isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]')
                    : (isDark ? 'text-[var(--alpha-danger)]' : 'text-[var(--alpha-danger)]')
                }`}>
                  {data.changePercentage >= 0 ? '+' : ''}{data.changePercentage.toFixed(2)}%
                </p>
              </div>
              <div className={`w-10 h-10 rounded flex items-center justify-center ${
                isDark ? 'bg-[var(--alpha-violet-soft)] border border-[var(--alpha-violet-border)]' : 'bg-[var(--alpha-violet-soft)] border border-[var(--alpha-violet-border)]'
              }`}>
                <PieChart className={`w-5 h-5 ${isDark ? 'text-[var(--alpha-violet)]' : 'text-[var(--alpha-violet)]'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Chart */}
      <Card className={`border ${
        isDark ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)]' : 'bg-white border-[var(--alpha-border)]'
      }`}>
        <CardContent className="p-4">
          <h3 className={`font-mono font-bold mb-4 ${
            isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
          }`}>
            {isDark ? '> PORTFOLIO_DISTRIBUTION' : 'Portfolio Distribution'}
          </h3>
          
          <div className="space-y-3">
            {data.distribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-mono text-sm ${
                      isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
                    }`}>{item.name}</span>
                    <span className={`font-mono text-sm ${
                      isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                    }`}>
                      ${item.value.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${
                    isDark ? 'bg-[var(--alpha-surface-strong)]' : 'bg-[var(--alpha-surface-soft)]'
                  }`}>
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Simple Bar Chart History */}
      <Card className={`border ${
        isDark ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)]' : 'bg-white border-[var(--alpha-border)]'
      }`}>
        <CardContent className="p-4">
          <h3 className={`font-mono font-bold mb-4 ${
            isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
          }`}>
            {isDark ? '> VALUE_HISTORY' : 'Value History'}
          </h3>
          
          <div className="flex items-end gap-2 h-32">
            {data.history.map((item, idx) => {
              const height = ((item.value - minValue) / (maxValue - minValue)) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center h-24">
                    <div 
                      className={`w-full max-w-[40px] rounded-t transition-all duration-500 ${
                        isDark ? 'bg-[var(--alpha-signal-strong)]' : 'bg-[var(--alpha-signal-strong)]'
                      }`}
                      style={{ height: `${Math.max(height, 10)}%` }}
                    />
                  </div>
                  <span className={`font-mono text-xs ${
                    isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                  }`}>
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};