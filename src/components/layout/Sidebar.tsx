import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isFeedbackInboxOwner } from "@/lib/feedback-access";
import {
  House,
  LayoutDashboard,
  Star,
  Wallet,
  Search,
  ShieldCheck,
  Droplets,
  Users,
  Bot,
  Wrench,
  Rocket,
  ArrowLeftRight,
  Trophy,
  Inbox,
  Info,
  LogIn,
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
  const { logout, isAuthenticated, session } = useAuth();
  const location = useLocation();
  const showFeedbackInbox = isFeedbackInboxOwner(session?.user?.email);

  const sections = [
    {
      title: "Workspace",
      links: [
        { to: "/overview", icon: House, label: "Overview" },
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/priority-projects", icon: Star, label: "Priority" },
        { to: "/ecosystem", icon: Wallet, label: "Ecosystem" },
      ],
    },
    {
      title: "Tracking",
      links: [
        { to: "/screening", icon: Search, label: "Screening" },
        { to: "/check-eligibility", icon: ShieldCheck, label: "Check Eligibility" },
        { to: "/faucet", icon: Droplets, label: "Faucet" },
        { to: "/multiple-account", icon: Users, label: "Multi Account" },
        { to: "/reward-vault", icon: Trophy, label: "Reward Vault" },
      ],
    },
    {
      title: "Tools",
      links: [
        { to: "/tools", icon: Wrench, label: "Tools" },
        { to: "/deploy", icon: Rocket, label: "Deploy" },
        { to: "/swap-bridge", icon: ArrowLeftRight, label: "Swap & Bridge" },
      ],
    },
    {
      title: "AI",
      links: [
        { to: "/ai-tools", icon: Bot, label: "AI Tools" },
      ],
    },
    ...(showFeedbackInbox
      ? [
          {
            title: "Operator",
            links: [{ to: "/feedback-inbox", icon: Inbox, label: "Feedback Inbox" }],
          },
        ]
      : []),
  ];

  const isLinkActive = (to: string) =>
    location.pathname === to || (to !== '/' && location.pathname.startsWith(`${to}/`));
  const getEntryStyle = (delay: number) => ({
    transitionDelay: open ? `${delay}ms` : '0ms',
  });

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
        top: '50%',
        left: `${leftOffset}px`,
        width: `${width}px`,
        height: `min(760px, calc(100vh - ${topOffset + bottomOffset}px))`,
        borderColor: 'var(--alpha-border)',
        transform: open ? 'translate3d(0, -50%, 0)' : 'translate3d(-118%, -50%, 0)',
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
        className={`fixed inset-0 z-40 transition-opacity duration-150 ease-out ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ background: 'color-mix(in srgb, var(--alpha-overlay) 84%, transparent)' }}
      />
      <aside
        className={`fixed z-[100] flex flex-col macos-panel will-change-transform transition-[transform,opacity] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] ${
          isDesktop
            ? "h-auto overflow-hidden rounded-[2rem] border"
            : "h-screen border-r rounded-none"
        } ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          ...panelStyle,
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--alpha-surface) 98%, transparent), color-mix(in srgb, var(--alpha-panel) 96%, transparent))',
        }}
      >
        <div
          className="flex h-16 flex-shrink-0 items-center justify-between px-4 border-b"
          style={{ borderColor: 'var(--alpha-border)' }}
        >
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Alpha Tracker" className="alpha-brand-logo h-8 w-8" />
            <span className="font-bold font-mono text-lg alpha-text tracking-tighter">
              ALPHA<span className="alpha-text-muted">_TRACKER</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 transition-colors duration-150 hover:bg-[color:var(--alpha-hover-soft)]"
            type="button"
          >
            <X className="w-5 h-5 alpha-text" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {sections.map((section, sectionIndex) => (
            <div key={section.title} className="space-y-1">
              {sectionIndex > 0 ? (
                <div className="my-4 border-t" style={{ borderColor: 'var(--alpha-border)' }} />
              ) : null}

              <p
                className={`px-3 pb-1 text-[10px] font-mono uppercase tracking-[0.28em] alpha-text-muted transition-[opacity,transform] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] ${
                  open ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
                }`}
                style={getEntryStyle(sectionIndex * 45)}
              >
                {section.title}
              </p>

              {section.links.map((link, linkIndex) => {
                const isActive = isLinkActive(link.to);
                const delay = sectionIndex * 45 + linkIndex * 28 + 30;

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    style={getEntryStyle(delay)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-mono transition-[background-color,color,transform,box-shadow,opacity] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] active:scale-[0.99] ${
                      open ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
                    } ${
                      isActive
                        ? "translate-x-1 border border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight)] text-[color:var(--alpha-accent-contrast)] font-semibold shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
                        : "alpha-text hover:translate-x-1 hover:bg-[color:var(--alpha-hover-soft)]"
                    }`}
                  >
                    <link.icon className={`w-4 h-4 ${isActive ? "text-[color:var(--alpha-accent-contrast)]" : "alpha-text-muted"}`} />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}

          <div className="my-4 border-t" style={{ borderColor: 'var(--alpha-border)' }} />

          <NavLink
            to="/about"
            onClick={onClose}
            style={getEntryStyle(sections.length * 55 + 10)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-mono transition-[background-color,color,transform,box-shadow,opacity] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] active:scale-[0.99] ${
                open ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
              } ${
                isActive
                  ? "translate-x-1 border border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight)] text-[color:var(--alpha-accent-contrast)] font-semibold shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
                  : "alpha-text hover:translate-x-1 hover:bg-[color:var(--alpha-hover-soft)]"
              }`
            }
          >
            <Info className="w-4 h-4" />
            <span>About</span>
          </NavLink>

          {isAuthenticated ? (
            <button
              onClick={logout}
              style={getEntryStyle(sections.length * 55 + 40)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--alpha-danger)] transition-[background-color,color,transform,box-shadow,opacity] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] hover:translate-x-1 hover:bg-[color:var(--alpha-danger-soft)] active:scale-[0.99] ${
                open ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
              }`}
              type="button"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={onClose}
              style={getEntryStyle(sections.length * 55 + 40)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-mono transition-[background-color,color,transform,box-shadow,opacity] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] active:scale-[0.99] ${
                  open ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
                } ${
                  isActive
                    ? "translate-x-1 border border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight)] text-[color:var(--alpha-accent-contrast)] font-semibold shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
                    : "alpha-text hover:translate-x-1 hover:bg-[color:var(--alpha-hover-soft)]"
                }`
              }
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </NavLink>
          )}
        </nav>
      </aside>
    </>
  );
}
