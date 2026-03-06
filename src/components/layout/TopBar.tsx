import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Plus, Menu } from 'lucide-react';
import { AirdropModal } from '@/components/modals/AirdropModal';
import { createAirdrop } from '@/services/database';
import type { Airdrop } from '@/types';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export function TopBar({ onToggleSidebar }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { session } = useAuth();
  const isDark = theme === 'dark';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddProject = async (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!session?.user) return;

    try {
      await createAirdrop(data, session.user.id);
      setIsAddModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 alpha-surface macos-panel`}
        style={{
          borderBottom: `1px solid var(--alpha-border)`
        }}
      >
        <div className="h-12 flex items-center px-3 lg:pr-6">
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
          <div className="absolute left-1/2 transform -translate-x-1/2 text-xs font-mono alpha-muted">
            {new Date().toLocaleTimeString()}
          </div>

          {/* right */}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="macos-btn macos-btn--primary hidden md:inline-flex"
              title="New project"
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs font-mono">NEW PROJECT</span>
            </button>

            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <AirdropModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProject}
        mode="add"
        isDark={isDark}
      />
    </>
  );
}
