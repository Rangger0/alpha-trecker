import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useWalletContext } from '@/contexts/WalletContext';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  Globe, 
  Droplets, 
  Users, 
  Star, 
  Info,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletConnectModal } from '@/components/modals/WalletConnectModal';
import { EligibilityModal } from '@/components/modals/EligibilityModal';

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export function Sidebar({ onCollapseChange }: SidebarProps) {
  const { theme } = useTheme();
  const { wallets } = useWalletContext();
  const location = useLocation();
  const isDark = theme === 'dark';
  const [collapsed, setCollapsed] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(false);

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onCollapseChange?.(newState);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/overview', label: 'Overview', icon: Layers },
    { path: '/ecosystem', label: 'Ecosystem', icon: Globe },
    { path: '/faucet', label: 'Faucet', icon: Droplets },
    { path: '/multiple-account', label: 'Multi Account', icon: Users },
    { path: '/priority-projects', label: 'Priority', icon: Star },
  ];

  return (
    <>
      <aside 
        className={`fixed left-0 top-0 h-screen z-40 border-r transition-all duration-300 flex flex-col ${
          collapsed ? 'w-16' : 'w-64'
        } ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}`}
      >
        {/* Logo - ALPHA_TRACKER (Tanpa Border) */}
        <div className={`h-16 flex items-center justify-center border-b ${
          isDark ? 'border-[#1f293700]' : 'border-[#e5e7eb00]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded flex items-center justify-center transition-all duration-300 hover:scale-105 ${
              isDark ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'bg-[#2563EB]/10 text-[#2563EB]'
            }`}>
              <img src="/logo.png" alt="Alpha Tracker" className="w-8 h-8 object-contain" />
            </div>
            {!collapsed && (
              <span className={`font-bold tracking-tighter font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                <span className={isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}>ALPHA</span>
                <span className={isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'}>_TRACKER</span>
              </span>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className={`absolute -right-3 top-20 w-6 h-6 rounded-full border shadow-md ${
            isDark 
              ? 'bg-[#161B22] border-[#1F2937] text-[#6B7280] hover:text-[#00ff88]' 
              : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#2563EB]'
          }`}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>

        {/* Navigation */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-mono text-sm ${
                  isActive
                    ? isDark
                      ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20'
                      : 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20'
                    : isDark
                      ? 'text-[#6B7280] hover:bg-[#00FF88]/5 hover:text-[#E5E7EB]'
                      : 'text-[#6B7280] hover:bg-[#2563EB]/5 hover:text-[#111827]'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </NavLink>
            );
          })}

          {/* Wallet & Check - Text only, no background, above About */}
          <div className={`mt-4 pt-4 border-t ${isDark ? 'border-[#1F2937]' : 'border-[#E5E7EB]'}`}>
            {!collapsed && (
              <p className={`px-3 mb-2 text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                TOOLS
              </p>
            )}
            
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-mono text-sm ${
                isDark 
                  ? 'text-[#8B5CF6] hover:bg-[#8B5CF6]/10' 
                  : 'text-[#4F46E5] hover:bg-[#4F46E5]/10'
              }`}
            >
              <Wallet className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium">
                  Wallet {wallets.length > 0 && `(${wallets.length})`}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsEligibilityModalOpen(true)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-mono text-sm ${
                isDark 
                  ? 'text-[#F59E0B] hover:bg-[#F59E0B]/10' 
                  : 'text-[#EA580C] hover:bg-[#EA580C]/10'
              }`}
            >
              <Search className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium">Check</span>
              )}
            </button>
          </div>
        </nav>

        {/* About - Bottom */}
        <div className={`p-3 border-t ${isDark ? 'border-[#1F2937]' : 'border-[#E5E7EB]'}`}>
          <NavLink
            to="/about"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-mono text-sm ${
              location.pathname === '/about'
                ? isDark
                  ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20'
                  : 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20'
                : isDark
                  ? 'text-[#6B7280] hover:bg-[#00FF88]/5 hover:text-[#E5E7EB]'
                  : 'text-[#6B7280] hover:bg-[#2563EB]/5 hover:text-[#111827]'
            }`}
          >
            <Info className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="font-medium">About</span>
            )}
          </NavLink>
        </div>
      </aside>

      {/* Modals */}
      <WalletConnectModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
      <EligibilityModal isOpen={isEligibilityModalOpen} onClose={() => setIsEligibilityModalOpen(false)} />
    </>
  );
}