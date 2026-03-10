import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Plus, Menu, Clock3 } from 'lucide-react';
import { AirdropModal } from '@/components/modals/AirdropModal';
import { createAirdrop } from '@/services/database';
import { emitAirdropsSync, invalidateAirdropsCache } from '@/lib/airdrops-store';
import type { Airdrop } from '@/types';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export function TopBar({ onToggleSidebar }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { session } = useAuth();
  const location = useLocation();
  const isDark = theme === 'dark';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const updateNow = () => setNow(new Date());
    updateNow();

    const intervalId = window.setInterval(updateNow, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const handleAddProject = async (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!session?.user) return;

    try {
      await createAirdrop(data, session.user.id);
      setIsAddModalOpen(false);

      if (location.pathname === '/dashboard') {
        window.location.reload();
        return;
      }

      invalidateAirdropsCache(session.user.id);
      emitAirdropsSync({ userId: session.user.id });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-[90] macos-panel"
        style={{
          borderBottom: '1px solid color-mix(in srgb, var(--alpha-border) 92%, transparent)',
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--alpha-surface) 97%, transparent), color-mix(in srgb, var(--alpha-panel) 96%, transparent))',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div className="flex h-12 items-center px-3 lg:pr-6">
          {/* Hamburger kiri */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              aria-label="Open sidebar"
              className="macos-icon macos-focus transition-transform duration-150 ease-out active:scale-95"
              type="button"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* center clock */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-mono alpha-muted md:flex"
            style={{
              borderColor: 'color-mix(in srgb, var(--alpha-border) 92%, transparent)',
              background: 'var(--alpha-surface)',
            }}
          >
            <Clock3 className="h-3.5 w-3.5 text-gold" />
            {formattedTime}
          </div>

          {/* right */}
          <div className="ml-auto flex items-center gap-3">
            {session?.user ? (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="macos-btn macos-btn--primary inline-flex items-center gap-2 rounded-[1rem] px-3 py-2 text-xs md:px-4 md:py-2.5"
                title="Add airdrop"
              >
                <Plus className="h-4 w-4" />
                <span className="font-mono hidden sm:inline">ADD AIRDROP</span>
              </button>
            ) : null}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] text-[color:var(--alpha-text)] hover:border-[color:var(--alpha-border-strong)] hover:bg-[color:var(--alpha-hover-soft)] hover:text-[color:var(--alpha-text)]"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {session?.user ? (
        <AirdropModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddProject}
          mode="add"
          isDark={isDark}
        />
      ) : null}
    </>
  );
}
