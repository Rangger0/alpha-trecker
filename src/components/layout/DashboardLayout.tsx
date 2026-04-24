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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sidebarLeftOffset = 24;
  const sidebarWidth = 252;
  const topBarHeight = 56;
  const sidebarTopOffset = topBarHeight + 14;
  const sidebarBottomOffset = 16;
  const mainTopPadding = topBarHeight;

  return (
    <div className={`alpha-theme ${isDark ? 'dark' : 'light'} alpha-bg macos-app-shell min-h-screen`}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isDesktop={isDesktop}
        topOffset={sidebarTopOffset}
        bottomOffset={sidebarBottomOffset}
        leftOffset={sidebarLeftOffset}
        width={sidebarWidth}
      />

      <TopBar
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
      />

      <main
        className="w-full"
        style={{
          paddingTop: `${mainTopPadding}px`,
        }}
      >
        <div className="w-full px-2 pb-2 pt-1.5 sm:px-3 sm:pb-3 sm:pt-2 lg:px-4 lg:pb-4">
          <div
            className={`macos-panel ${disableMonochrome ? '' : 'macos-theme-monochrome'} macos-window-open overflow-hidden rounded-[1.65rem] border shadow-[var(--alpha-shadow)]`}
            style={{
              borderColor: 'var(--alpha-shell-border)',
              background: 'var(--alpha-shell-gradient)',
              minHeight: `calc(100vh - ${mainTopPadding + 14}px)`,
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
