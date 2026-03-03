import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Plus, Menu } from 'lucide-react';
import { AirdropModal } from '@/components/modals/AirdropModal';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export function TopBar({ onToggleSidebar }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-12 z-30 border-b bg-inherit">
        <div className="h-full px-4 flex items-center">

          {/* Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="mr-3"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Add */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="text-sm font-mono"
          >
            <Plus className="h-4 w-4 mr-2" />
            NEW PROJECT
          </Button>

          {/* Clock */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-sm font-mono">
            {new Date().toLocaleTimeString()}
          </div>

          {/* Theme */}
          <div className="ml-auto">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

        </div>
      </header>

      <AirdropModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async () => {}}
        mode="add"
        isDark={isDark}
      />
    </>
  );
}