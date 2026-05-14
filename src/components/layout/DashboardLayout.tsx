import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  disableMonochrome?: boolean;
}

export function DashboardLayout({ children, disableMonochrome = true }: DashboardLayoutProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  });
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return false;
  });

  useEffect(() => {
    const onResize = () => {
      const nextIsDesktop = window.innerWidth >= 1024;
      setIsDesktop(nextIsDesktop);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sidebarLeftOffset = 24;
  const sidebarWidth = 252;
  const topBarHeight = 56;
  const sidebarTopOffset = topBarHeight + 14;
  const sidebarBottomOffset = 16;
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className={`alpha-theme ${isDark ? 'dark' : 'light'} alpha-bg macos-app-shell min-h-screen`}>
      <Sidebar
        open={sidebarOpen}
        onClose={closeSidebar}
        isDesktop={isDesktop}
        topOffset={sidebarTopOffset}
        bottomOffset={sidebarBottomOffset}
        leftOffset={sidebarLeftOffset}
        width={sidebarWidth}
      />

      <TopBar
        onToggleSidebar={toggleSidebar}
      />

      <main
        className="alpha-dashboard-main w-full pt-14 sm:pt-[60px] lg:pt-16"
      >
        <div className="w-full px-2 pb-2 pt-2 sm:px-3 sm:pb-3 sm:pt-3 lg:px-4 lg:pb-4 lg:pt-4">
          <div
            className={`macos-panel ${disableMonochrome ? '' : 'macos-theme-monochrome'} overflow-hidden rounded-[1.65rem] border shadow-[var(--alpha-shadow)]`}
            style={{
              borderColor: 'var(--alpha-shell-border)',
              background: 'var(--alpha-shell-gradient)',
              minHeight: 'calc(100dvh - 76px)',
            }}
          >
            <div className="p-3.5 sm:p-4 lg:p-5">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
