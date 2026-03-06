import { useState, useEffect } from 'react';
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

  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sidebarLeftOffset = 16;
  const sidebarWidth = 240;
  const topBarHeight = 48;
  const sidebarTopOffset = topBarHeight + 12;
  const sidebarBottomOffset = 16;
  const mainTopPadding = topBarHeight + 16;

  return (
    // alpha-theme wrapper: palet hanya mempengaruhi halaman dengan layout ini
    <div className={`alpha-theme ${isDark ? 'dark' : ''} alpha-bg macos-app-shell min-h-screen`}>
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
        <div className="w-full px-4 py-5 sm:px-6 sm:py-6">
          <div className="macos-panel overflow-hidden rounded-[2rem] border border-alpha-border/80 bg-white/10 shadow-[var(--alpha-shadow)]">
            <div className="p-5 sm:p-6">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
