import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`min-h-screen font-mono transition-colors duration-300 ${
      isDark ? 'bg-[#0B0F14] text-[#E5E7EB]' : 'bg-[#F3F4F6] text-[#111827]'
    }`}>
      <Sidebar onCollapseChange={setSidebarCollapsed} />
      <TopBar sidebarCollapsed={sidebarCollapsed} />
      
      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'pl-16' : 'pl-64'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}