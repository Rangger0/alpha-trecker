import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Menu, Clock3 } from 'lucide-react';
import { AirdropModal } from '@/components/modals/AirdropModal';
import { createAirdrop } from '@/services/database';
import { emitAirdropsSync, invalidateAirdropsCache } from '@/lib/airdrops-store';
import type { Airdrop } from '@/types';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export function TopBar({ onToggleSidebar }: TopBarProps) {
  const { theme } = useTheme();
  const { t } = useI18n();
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

  const currentSectionLabel = (() => {
    const path = location.pathname;

    if (path.startsWith('/overview')) return t('topbar.section.overview');
    if (path.startsWith('/dashboard')) return t('topbar.section.dashboard');
    if (path.startsWith('/priority-projects')) return t('topbar.section.priority');
    if (path.startsWith('/ecosystem')) return t('topbar.section.ecosystem');
    if (path.startsWith('/screening')) return t('topbar.section.screening');
    if (path.startsWith('/check-eligibility')) return t('topbar.section.eligibility');
    if (path.startsWith('/faucet')) return t('topbar.section.faucet');
    if (path.startsWith('/multiple-account')) return t('topbar.section.multiAccount');
    if (path.startsWith('/reward-vault')) return t('topbar.section.rewardVault');
    if (path.startsWith('/calculator')) return t('topbar.section.calculator');
    if (path.startsWith('/live-gas-fee')) return t('topbar.section.liveGasFee');
    if (path.startsWith('/tools')) return t('topbar.section.tools');
    if (path.startsWith('/deploy')) return t('topbar.section.deploy');
    if (path.startsWith('/swap-bridge') || path.startsWith('/swap')) return t('topbar.section.swapBridge');
    if (path.startsWith('/ai-tools')) return t('topbar.section.aiTools');
    if (path.startsWith('/feedback-inbox')) return t('topbar.section.feedbackInbox');
    if (path.startsWith('/about')) return t('topbar.section.about');

    return t('topbar.section.app');
  })();

  return (
    <>
      <header
        className="alpha-app-topbar fixed inset-x-0 top-0 z-[120] px-2 pt-2 sm:px-3 sm:pt-3 lg:px-4 lg:pt-4"
      >
        <div
          className="alpha-topbar-shell macos-panel grid h-12 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center rounded-[1.25rem] px-3.5 lg:px-4"
          style={{
            borderColor: 'var(--alpha-shell-border)',
            boxShadow: 'var(--alpha-shadow)',
            background: 'var(--alpha-topbar-gradient)',
          }}
        >
          <div className="flex min-w-0 items-center gap-3 justify-self-start">
            <button
              onClick={onToggleSidebar}
              aria-label={t('topbar.openSidebar')}
              className="macos-icon macos-focus flex h-9 w-9 items-center justify-center rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] transition-transform duration-150 ease-out active:scale-95"
              type="button"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="alpha-topbar-chip hidden px-3 py-1.5 text-[11px] font-display font-semibold uppercase tracking-[0.18em] md:flex">
              <span
                className="h-2 w-2 rounded-full bg-[color:var(--alpha-accent)]"
                style={{ boxShadow: '0 0 14px color-mix(in srgb, var(--alpha-accent) 45%, transparent)' }}
              />
              {currentSectionLabel}
            </div>
          </div>

          <div
            className="alpha-topbar-chip hidden items-center gap-2 justify-self-center px-3.5 py-1.5 text-[11.5px] font-display font-bold tracking-[0.08em] alpha-text lg:flex"
            style={{
              borderColor: 'var(--alpha-topbar-chip-border)',
            }}
          >
            <Clock3 className="h-3.5 w-3.5 text-gold" />
            {formattedTime}
          </div>

          <div className="flex min-w-0 items-center justify-end gap-2.5 justify-self-end">
            {session?.user ? (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="macos-btn macos-btn--primary inline-flex items-center gap-2 rounded-[1rem] px-3.5 py-2 text-[11px] font-display font-semibold uppercase tracking-[0.18em] md:px-4"
                title={t('topbar.addAirdrop')}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t('topbar.addAirdrop')}</span>
              </button>
            ) : null}
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
