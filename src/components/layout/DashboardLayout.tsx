import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  disableMonochrome?: boolean;
}

export function DashboardLayout({ children, disableMonochrome = false }: DashboardLayoutProps) {
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
  const topBarHeight = 48;
  const sidebarTopOffset = topBarHeight + 20;
  const sidebarBottomOffset = 20;
  const mainTopPadding = topBarHeight + 18;

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
        <div className="w-full px-3.5 py-4 sm:px-5 sm:py-5">
          <div
            className={`macos-panel ${disableMonochrome ? '' : 'macos-theme-monochrome'} macos-window-open overflow-hidden rounded-[2rem] border shadow-[var(--alpha-shadow)]`}
            style={{
              borderColor: 'color-mix(in srgb, var(--alpha-border) 92%, transparent)',
              background:
                'linear-gradient(180deg, color-mix(in srgb, var(--alpha-surface) 97%, transparent), color-mix(in srgb, var(--alpha-panel) 95%, transparent))',
            }}
          >
            <div className="p-4 sm:p-5">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
