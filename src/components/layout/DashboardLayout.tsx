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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'bg-[#0B0F14] text-[#E5E7EB]' : 'bg-[#F3F4F6] text-[#111827]'
      }`}
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <TopBar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

      <main className="pt-12 w-full">
        <div className="w-full px-6 py-4">
          {children}
        </div>
      </main>
    </div>
  );
}