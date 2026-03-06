import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Star,
  Wallet,
  Search,
  Droplets,
  Users,
  Bot,
  Wrench,
  ArrowLeftRight,
  Trophy,
  Info,
  LogOut,
  X
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  isDesktop: boolean;
  topOffset: number;
  bottomOffset: number;
  leftOffset: number;
  width: number;
}

export function Sidebar({
  open,
  onClose,
  isDesktop,
  topOffset,
  bottomOffset,
  leftOffset,
  width,
}: SidebarProps) {
  const { logout } = useAuth();
  const location = useLocation();

  const links = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/priority-projects", icon: Star, label: "Priority" },
    { to: "/ecosystem", icon: Wallet, label: "Ecosystem" },
    { to: "/screening", icon: Search, label: "Screening" },
    { to: "/faucet", icon: Droplets, label: "Faucet" },
    { to: "/multiple-account", icon: Users, label: "Multi Account" },
    { to: "/ai-tools", icon: Bot, label: "AI Tools" },
    { to: "/tools", icon: Wrench, label: "Tools" },
    { to: "/swap-bridge", icon: ArrowLeftRight, label: "Swap & Bridge" },
    { to: "/reward-vault", icon: Trophy, label: "Reward Vault" },
  ];

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, open]);

  const panelStyle = isDesktop
    ? {
        top: `${topOffset}px`,
        left: `${leftOffset}px`,
        bottom: `${bottomOffset}px`,
        width: `${width}px`,
        borderColor: 'var(--alpha-border)',
        transform: open ? 'translate3d(0, 0, 0)' : 'translate3d(-108%, 0, 0)',
        opacity: open ? 1 : 0,
      }
    : {
        top: '0px',
        left: '0px',
        width: `${width}px`,
        borderColor: 'var(--alpha-border)',
        transform: open ? 'translate3d(0, 0, 0)' : 'translate3d(-108%, 0, 0)',
        opacity: open ? 1 : 0,
      };

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={open ? onClose : undefined}
        className={`fixed inset-0 z-40 bg-black/18 transition-opacity duration-150 ease-out ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        className={`fixed z-50 flex flex-col alpha-bg macos-panel will-change-transform transition-[transform,opacity] duration-180 ease-out ${
          isDesktop
            ? "h-auto overflow-hidden rounded-[1.75rem] border"
            : "h-screen border-r rounded-none"
        } ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={panelStyle}
      >
        <div
          className="flex h-16 flex-shrink-0 items-center justify-between px-4 border-b"
          style={{ borderColor: 'var(--alpha-border)' }}
        >
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Alpha Tracker" className="h-8 w-8" />
            <span className="font-bold font-mono text-lg alpha-text tracking-tighter">
              ALPHA<span className="alpha-text-muted">_TRACKER</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10"
            type="button"
          >
            <X className="w-5 h-5 alpha-text" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-mono transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.99] ${
                    isActive
                      ? "bg-gold/10 text-gold font-medium"
                      : "alpha-text hover:bg-black/5 dark:hover:bg-white/10"
                  }`
                }
              >
                <link.icon className={`w-4 h-4 ${isActive ? "text-gold" : "alpha-text-muted"}`} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}

          <div className="my-4 border-t" style={{ borderColor: 'var(--alpha-border)' }} />

          <NavLink
            to="/about"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-mono transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.99] ${
                isActive
                  ? "bg-gold/10 text-gold font-medium"
                  : "alpha-text hover:bg-black/5 dark:hover:bg-white/10"
              }`
            }
          >
            <Info className="w-4 h-4" />
            <span>About</span>
          </NavLink>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-mono text-red-500 transition-[background-color,color,transform] duration-150 ease-out hover:bg-red-500/10 active:scale-[0.99]"
            type="button"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
