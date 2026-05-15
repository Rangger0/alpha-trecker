import { useEffect, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { isFeedbackInboxOwner } from "@/lib/feedback-access";
import {
  ArrowLeftRight,
  Bot,
  Calculator,
  Droplets,
  Flame,
  House,
  Inbox,
  Info,
  LayoutDashboard,
  Languages,
  LogIn,
  LogOut,
  Moon,
  Rocket,
  Search,
  Settings2,
  ShieldCheck,
  Star,
  Trophy,
  Users,
  Wallet,
  Wrench,
  X,
  type LucideIcon,
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

interface PreferenceButtonProps {
  active: boolean;
  icon?: LucideIcon;
  label: string;
  onClick: () => void;
}

interface PreferenceGroupProps {
  icon: LucideIcon;
  label: string;
  value: string;
  children: ReactNode;
}

function PreferenceButton({ active, icon: Icon, label, onClick }: PreferenceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-[11px] font-display font-semibold transition-all duration-200 ${
        active
          ? "border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight)] text-[color:var(--alpha-accent-contrast)] shadow-[0_10px_22px_rgba(0,0,0,0.12)]"
          : "border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] alpha-text hover:bg-[color:var(--alpha-hover-soft)]"
      }`}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      <span>{label}</span>
    </button>
  );
}

function PreferenceGroup({ icon: Icon, label, value, children }: PreferenceGroupProps) {
  return (
    <div
      className="rounded-[1.15rem] border p-3"
      style={{
        borderColor: "color-mix(in srgb, var(--alpha-border) 88%, transparent)",
        background: "color-mix(in srgb, var(--alpha-surface) 82%, transparent)",
      }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
          style={{
            borderColor: "color-mix(in srgb, var(--alpha-border) 90%, transparent)",
            background: "color-mix(in srgb, var(--alpha-hover-soft) 72%, transparent)",
          }}
        >
          <Icon className="h-4 w-4 alpha-text" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold alpha-text">{label}</p>
          <p className="text-[11px] alpha-text-muted">{value}</p>
        </div>
      </div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}

export function Sidebar({
  open,
  onClose,
  isDesktop,
  leftOffset,
  width,
}: SidebarProps) {
  const { logout, isAuthenticated, session } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();
  const location = useLocation();
  const showFeedbackInbox = isFeedbackInboxOwner(session?.user?.email);

  const sections = [
    {
      id: "workspace",
      title: t("sidebar.section.workspace"),
      links: [
        { to: "/overview", icon: House, label: t("sidebar.link.overview") },
        { to: "/dashboard", icon: LayoutDashboard, label: t("sidebar.link.dashboard") },
        { to: "/priority-projects", icon: Star, label: t("sidebar.link.priority") },
        { to: "/ecosystem", icon: Wallet, label: t("sidebar.link.ecosystem") },
      ],
    },
    {
      id: "tracking",
      title: t("sidebar.section.tracking"),
      links: [
        { to: "/screening", icon: Search, label: t("sidebar.link.screening") },
        { to: "/check-eligibility", icon: ShieldCheck, label: t("sidebar.link.eligibility") },
        { to: "/faucet", icon: Droplets, label: t("sidebar.link.faucet") },
        { to: "/multiple-account", icon: Users, label: t("sidebar.link.multiAccount") },
        { to: "/reward-vault", icon: Trophy, label: t("sidebar.link.rewardVault") },
        { to: "/calculator", icon: Calculator, label: t("sidebar.link.calculator") },
        { to: "/live-gas-fee", icon: Flame, label: t("sidebar.link.liveGasFee") },
      ],
    },
    {
      id: "tools",
      title: t("sidebar.section.tools"),
      links: [
        { to: "/tools", icon: Wrench, label: t("sidebar.link.tools") },
        { to: "/deploy", icon: Rocket, label: t("sidebar.link.deploy") },
        { to: "/swap-bridge", icon: ArrowLeftRight, label: t("sidebar.link.swapBridge") },
      ],
    },
    {
      id: "ai",
      title: t("sidebar.section.ai"),
      links: [{ to: "/ai-tools", icon: Bot, label: t("sidebar.link.aiTools") }],
    },
    ...(showFeedbackInbox
      ? [
          {
            id: "operator",
            title: t("sidebar.section.operator"),
            links: [{ to: "/feedback-inbox", icon: Inbox, label: t("sidebar.link.feedbackInbox") }],
          },
        ]
      : []),
  ];

  const isLinkActive = (to: string) =>
    location.pathname === to || (to !== "/" && location.pathname.startsWith(`${to}/`));

  const getEntryStyle = (delay: number) => ({
    transitionDelay: open ? `${delay}ms` : "0ms",
  });

  const currentThemeLabel = theme === "dark" ? t("common.dark") : t("common.light");
  const currentLanguageLabel = language.toUpperCase();

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
        top: "50%",
        left: `${leftOffset}px`,
        width: `${width}px`,
        height: "min(720px, calc(100dvh - 92px))",
        borderColor: "var(--alpha-shell-border)",
        transform: open ? "translate3d(0, -50%, 0) scale(1)" : "translate3d(calc(-100% - 28px), -50%, 0) scale(0.96)",
        opacity: open ? 1 : 0,
      }
    : {
        top: "50%",
        left: "12px",
        width: "min(340px, calc(100vw - 24px))",
        height: "min(680px, calc(100dvh - 76px))",
        borderColor: "var(--alpha-shell-border)",
        transform: open ? "translate3d(0, -50%, 0) scale(1)" : "translate3d(calc(-100% - 24px), -50%, 0) scale(0.96)",
        opacity: open ? 1 : 0,
      };

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={open ? onClose : undefined}
        className={`alpha-sidebar-backdrop fixed inset-0 transition-opacity duration-200 ease-out ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background: "color-mix(in srgb, var(--alpha-overlay) 72%, transparent)" }}
      />

      <aside
        className={`alpha-sidebar-panel fixed flex flex-col macos-panel overflow-hidden rounded-[2rem] border will-change-transform transition-[transform,opacity] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          ...panelStyle,
          background: "var(--alpha-shell-gradient)",
        }}
      >
        <div
          className="flex h-16 flex-shrink-0 items-center justify-between border-b px-4"
          style={{ borderColor: "var(--alpha-border)" }}
        >
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Alpha Tracker" className="alpha-brand-logo h-8 w-8" />
            <span className="font-display text-[1.06rem] font-bold alpha-text tracking-[-0.04em]">
              ALPHA<span className="alpha-text-muted">_TRACKER</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1 transition-colors duration-150 hover:bg-[color:var(--alpha-hover-soft)]"
            type="button"
            aria-label={t("common.close")}
          >
            <X className="h-5 w-5 alpha-text" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-3">
          <div className="space-y-1">
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="space-y-1">
                {sectionIndex > 0 ? (
                  <div className="my-4 border-t" style={{ borderColor: "var(--alpha-border)" }} />
                ) : null}

                <p
                  className={`px-3 pb-1 text-[11px] font-display font-bold uppercase tracking-[0.24em] alpha-text-muted transition-[opacity,transform] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] ${
                    open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
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
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-display font-semibold tracking-[-0.015em] transition-[background-color,color,transform,box-shadow,opacity] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] active:scale-[0.99] ${
                        open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                      } ${
                        isActive
                          ? "translate-x-1 border border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight)] text-[color:var(--alpha-accent-contrast)] font-bold shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
                          : "alpha-text hover:translate-x-1 hover:bg-[color:var(--alpha-hover-soft)]"
                      }`}
                    >
                      <link.icon
                        className={`h-[17px] w-[17px] ${
                          isActive ? "text-[color:var(--alpha-accent-contrast)]" : "alpha-text-muted"
                        }`}
                      />
                      <span>{link.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="my-4 border-t" style={{ borderColor: "var(--alpha-border)" }} />

          <NavLink
            to="/about"
            onClick={onClose}
            style={getEntryStyle(sections.length * 55 + 10)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-display font-semibold tracking-[-0.015em] transition-[background-color,color,transform,box-shadow,opacity] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] active:scale-[0.99] ${
                open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
              } ${
                isActive
                  ? "translate-x-1 border border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight)] text-[color:var(--alpha-accent-contrast)] font-bold shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
                  : "alpha-text hover:translate-x-1 hover:bg-[color:var(--alpha-hover-soft)]"
              }`
            }
          >
            <Info className="h-[17px] w-[17px]" />
            <span>{t("sidebar.link.about")}</span>
          </NavLink>

          {isAuthenticated ? (
            <button
              onClick={logout}
              style={getEntryStyle(sections.length * 55 + 40)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-display font-semibold tracking-[-0.015em] text-[var(--alpha-danger)] transition-[background-color,color,transform,box-shadow,opacity] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] hover:translate-x-1 hover:bg-[color:var(--alpha-danger-soft)] active:scale-[0.99] ${
                open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
              }`}
              type="button"
            >
              <LogOut className="h-[17px] w-[17px]" />
              <span>{t("sidebar.link.logout")}</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={onClose}
              style={getEntryStyle(sections.length * 55 + 40)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-display font-semibold tracking-[-0.015em] transition-[background-color,color,transform,box-shadow,opacity] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] active:scale-[0.99] ${
                  open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                } ${
                  isActive
                    ? "translate-x-1 border border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight)] text-[color:var(--alpha-accent-contrast)] font-bold shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
                    : "alpha-text hover:translate-x-1 hover:bg-[color:var(--alpha-hover-soft)]"
                }`
              }
            >
              <LogIn className="h-[17px] w-[17px]" />
              <span>{t("sidebar.link.login")}</span>
            </NavLink>
          )}

          <div
            className={`mt-5 rounded-[1.5rem] border p-3.5 transition-[opacity,transform] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] ${
              open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
            }`}
            style={{
              ...getEntryStyle(sections.length * 55 + 70),
              borderColor: "var(--alpha-border)",
              background: "color-mix(in srgb, var(--alpha-hover-soft) 72%, transparent)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border"
                style={{
                  borderColor: "color-mix(in srgb, var(--alpha-border) 90%, transparent)",
                  background: "color-mix(in srgb, var(--alpha-surface) 84%, transparent)",
                }}
              >
                <Settings2 className="h-4.5 w-4.5 alpha-text" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-display font-bold uppercase tracking-[0.24em] alpha-text-muted">
                  {t("sidebar.section.preferences")}
                </p>
                <p className="text-xs alpha-text-muted">
                  {currentLanguageLabel} · {currentThemeLabel}
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <PreferenceGroup
                icon={Languages}
                label={t("sidebar.preference.languageLabel")}
                value={currentLanguageLabel}
              >
                <PreferenceButton active={language === "id"} label="ID" onClick={() => setLanguage("id")} />
                <PreferenceButton active={language === "en"} label="EN" onClick={() => setLanguage("en")} />
              </PreferenceGroup>

              <PreferenceGroup
                icon={Moon}
                label={t("sidebar.preference.themeLabel")}
                value={currentThemeLabel}
              >
                <PreferenceButton active={theme === "dark"} label={t("common.dark")} onClick={() => setTheme("dark")} />
                <PreferenceButton active={theme === "light"} label={t("common.light")} onClick={() => setTheme("light")} />
              </PreferenceGroup>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
