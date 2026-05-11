import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  disableMonochrome?: boolean;
}

export function DashboardLayout({ children, disableMonochrome = true }: DashboardLayoutProps) {
  const { theme } = useTheme();
  const location = useLocation();
  const isDark = theme === 'dark';
  const contentRef = useRef<HTMLDivElement | null>(null);

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

  useLayoutEffect(() => {
    const resetScroll = () => {
      const content = contentRef.current;
      if (!content) return;

      content.scrollTop = 0;
      content.scrollLeft = 0;
    };

    resetScroll();

    const firstFrame = window.requestAnimationFrame(() => {
      resetScroll();
      window.requestAnimationFrame(resetScroll);
    });
    const timeoutId = window.setTimeout(resetScroll, 80);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearTimeout(timeoutId);
    };
  }, [location.pathname, location.search]);

  const sidebarLeftOffset = 24;
  const sidebarWidth = 252;
  const topBarHeight = 56;
  const shellGap = 6;
  const sidebarTopOffset = topBarHeight + shellGap;
  const sidebarBottomOffset = shellGap;
  const mainTopPadding = topBarHeight;

  return (
    <div className={`alpha-theme ${isDark ? 'dark' : 'light'} alpha-bg macos-app-shell h-[100dvh] w-full overflow-hidden`}>
      <div className="tactical-world-grid" aria-hidden="true" />
      <div className="tactical-projector tactical-projector--app" aria-hidden="true" />
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
        className="h-full w-full overflow-hidden"
      >
        <div className="h-full w-full px-2 pb-2 pt-1.5 sm:px-3 lg:px-4">
          <motion.div
            key={location.pathname}
            className={`tactical-shell-panel macos-panel ${disableMonochrome ? '' : 'macos-theme-monochrome'} macos-window-open overflow-hidden rounded-[1.65rem] border shadow-[var(--alpha-shadow)]`}
            style={{
              borderColor: 'var(--alpha-shell-border)',
              background: 'var(--alpha-shell-gradient)',
              height: `calc(100dvh - ${mainTopPadding + shellGap * 2}px)`,
            }}
            initial={{ opacity: 0, y: 18, scale: 0.992 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="tactical-panel-code tactical-panel-code--left" aria-hidden="true">SYS-ALPHA/OS</span>
            <span className="tactical-panel-code tactical-panel-code--right" aria-hidden="true">LIVE COMMAND</span>
            <div ref={contentRef} className="tactical-shell-content h-full w-full overflow-y-auto p-3 sm:p-3.5 lg:p-4">
              {children}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
