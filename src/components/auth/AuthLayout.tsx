import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, MoonStar, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  features: readonly string[];
}

export function AuthLayout({ children, title, subtitle, features }: AuthLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isDark = theme === 'dark';
  const isLoginRoute = location.pathname === '/login';
  const authTransition = ((location.state as { authTransition?: 'left' | 'right' } | null)?.authTransition) ?? 'idle';
  const authTransitionClass =
    authTransition === 'left'
      ? 'macos-auth-switch-left'
      : authTransition === 'right'
        ? 'macos-auth-switch-right'
        : 'macos-auth-switch-idle';

  const shellBorder = 'color-mix(in srgb, var(--alpha-border) 86%, rgba(255, 255, 255, 0.35))';
  const shellGlow = isDark ? '0 34px 90px rgba(16, 18, 28, 0.34)' : '0 28px 80px rgba(108, 96, 79, 0.15)';
  const glassPanel = 'linear-gradient(145deg, color-mix(in srgb, var(--alpha-panel) 92%, var(--alpha-bg) 8%), color-mix(in srgb, var(--alpha-bg) 76%, var(--alpha-panel) 24%))';
  const featurePanel = 'linear-gradient(180deg, color-mix(in srgb, var(--alpha-surface) 92%, transparent), color-mix(in srgb, var(--alpha-panel) 74%, transparent))';
  const softAccent = 'color-mix(in srgb, var(--alpha-accent) 18%, transparent)';
  const softAccentStrong = 'color-mix(in srgb, var(--alpha-accent) 28%, transparent)';

  return (
    <div className="macos-root macos-auth-shell min-h-screen overflow-hidden" style={{ background: 'var(--alpha-bg)' }}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[4%] top-[6%] h-36 w-36 rounded-full blur-2xl opacity-60"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--alpha-accent) 22%, transparent), transparent 68%)' }}
        />
        <div
          className="absolute right-[8%] top-[12%] h-40 w-40 rounded-full blur-2xl opacity-55"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--alpha-border) 26%, transparent), transparent 72%)' }}
        />
        <div
          className="absolute bottom-[10%] left-[14%] h-36 w-36 rounded-full blur-2xl opacity-55"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--alpha-accent) 16%, transparent), transparent 70%)' }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1380px] items-center px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
        <div
          className="w-full rounded-[2.2rem] p-[10px] sm:p-3"
          style={{
            border: `1px solid ${shellBorder}`,
            background: 'color-mix(in srgb, var(--alpha-surface) 74%, var(--alpha-bg) 26%)',
            boxShadow: shellGlow,
          }}
        >
          <div
            className="relative overflow-hidden rounded-[1.9rem] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
            style={{ background: glassPanel }}
          >
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute inset-x-0 top-0 h-36"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.12), transparent)' }}
              />
              <div
                className="absolute -left-16 top-20 hidden h-72 w-72 rounded-full border sm:block"
                style={{ borderColor: 'color-mix(in srgb, var(--alpha-border) 52%, transparent)' }}
              />
              <div
                className="absolute left-16 top-20 hidden h-52 w-44 rounded-[2rem] sm:block"
                style={{
                  border: `1px solid ${shellBorder}`,
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.06), transparent)',
                  transform: 'rotate(-9deg)',
                }}
              />
              <div
                className="absolute left-[28%] top-[18%] hidden h-48 w-48 rounded-full lg:block"
                style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--alpha-accent) 10%, transparent), transparent 66%)' }}
              />
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <Link to="/" className="min-w-0">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem]"
                    style={{
                      border: `1px solid ${shellBorder}`,
                      background: 'color-mix(in srgb, var(--alpha-surface) 86%, transparent)',
                      boxShadow: '0 14px 30px rgba(18, 20, 31, 0.14)',
                    }}
                  >
                    <img src="/logo.png" alt="Alpha Tracker" className="alpha-brand-logo macos-auth-logo-spin h-7 w-7 object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="truncate text-[10px] uppercase tracking-[0.3em]"
                      style={{ color: 'color-mix(in srgb, var(--alpha-text-muted) 88%, transparent)' }}
                    >
                      Mission Control
                    </p>
                    <p
                      className="truncate text-sm font-semibold tracking-[0.2em] sm:text-base"
                      style={{ color: 'var(--alpha-text)' }}
                    >
                      ALPHA_TRACKER
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:gap-3 lg:w-auto">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-opacity duration-150 hover:opacity-90 sm:px-4"
                  style={{
                    border: `1px solid ${shellBorder}`,
                    background: 'color-mix(in srgb, var(--alpha-surface) 78%, transparent)',
                    color: 'var(--alpha-text)',
                  }}
                >
                  <MoonStar className="h-4 w-4" />
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    state={{ authTransition: 'right' }}
                    className="rounded-full px-4 py-2 text-sm font-semibold transition-opacity duration-150 hover:opacity-90"
                    style={{
                      border: isLoginRoute ? '1px solid transparent' : `1px solid ${shellBorder}`,
                      background: isLoginRoute ? 'var(--alpha-accent)' : 'color-mix(in srgb, var(--alpha-surface) 78%, transparent)',
                      color: isLoginRoute ? 'var(--alpha-accent-contrast)' : 'var(--alpha-text)',
                    }}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    state={{ authTransition: 'left' }}
                    className="rounded-full px-4 py-2 text-sm font-semibold transition-opacity duration-150 hover:opacity-90"
                    style={{
                      border: !isLoginRoute ? '1px solid transparent' : `1px solid ${shellBorder}`,
                      background: !isLoginRoute ? 'var(--alpha-accent)' : 'color-mix(in srgb, var(--alpha-surface) 78%, transparent)',
                      color: !isLoginRoute ? 'var(--alpha-accent-contrast)' : 'var(--alpha-text)',
                    }}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>

            <div
              key={location.pathname}
              className={`relative z-10 mt-6 grid gap-5 lg:mt-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,430px)] lg:gap-8 ${authTransitionClass}`}
            >
              <div
                className="macos-auth-copy-panel relative overflow-hidden rounded-[1.8rem] px-5 py-6 sm:px-7 sm:py-7"
                style={{
                  border: `1px solid ${shellBorder}`,
                  background: featurePanel,
                }}
              >
                <div className="pointer-events-none absolute inset-0">
                  <div
                    className="absolute inset-x-[10%] top-[16%] hidden h-44 rounded-[2rem] sm:block"
                    style={{
                      border: `1px solid ${shellBorder}`,
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.06), transparent)',
                      transform: 'rotate(-7deg)',
                    }}
                  />
                  <div
                    className="absolute right-[6%] top-[18%] hidden h-56 w-56 rounded-full sm:block"
                    style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--alpha-accent) 10%, transparent), transparent 64%)' }}
                  />
                  <div
                    className="absolute right-[8%] top-[20%] hidden h-48 w-48 rounded-full lg:block"
                    style={{ border: `1px dashed ${shellBorder}` }}
                  />
                    <img
                      src="/logo.png"
                      alt=""
                      className="alpha-brand-logo macos-auth-logo-spin macos-auth-logo-spin--ambient absolute right-[8%] top-[18%] hidden h-56 w-56 object-contain opacity-[0.08] lg:block"
                    />
                </div>

                <div className="relative z-10 max-w-[34rem]">
                  <div
                    className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.28em]"
                    style={{
                      border: `1px solid ${shellBorder}`,
                      background: 'color-mix(in srgb, var(--alpha-surface) 66%, transparent)',
                      color: 'var(--alpha-text-muted)',
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--alpha-accent)' }} />
                    Secure Access
                  </div>

                  <h1
                    className="max-w-[28rem] text-4xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-5xl"
                    style={{ color: 'var(--alpha-text)' }}
                  >
                    {title}
                  </h1>
                  <p
                    className="mt-4 max-w-[29rem] text-sm leading-7 sm:text-base"
                    style={{ color: 'var(--alpha-text-muted)' }}
                  >
                    {subtitle}
                  </p>
                </div>

                <div className="relative z-10 mt-7 grid gap-3 xl:max-w-[38rem] xl:grid-cols-2">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm"
                      style={{
                        border: `1px solid ${shellBorder}`,
                        background: 'color-mix(in srgb, var(--alpha-surface) 62%, transparent)',
                        color: 'var(--alpha-text)',
                        boxShadow: `0 16px 30px ${softAccent}`,
                      }}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background: softAccentStrong,
                          color: 'var(--alpha-accent)',
                          border: `1px solid ${shellBorder}`,
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="macos-auth-form-shell flex items-start justify-center lg:justify-end">
                <div className="macos-auth-stage w-full max-w-[430px] lg:min-h-[548px]">
                  <div
                    key={isLoginRoute ? 'login' : 'register'}
                    className="macos-window-open"
                  >
                    {children}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-5 flex flex-col gap-4 lg:mt-6 lg:flex-row lg:items-end lg:justify-between">
              <Link to="/" className="w-full max-w-[360px]">
                <div
                  className="rounded-[1.6rem] px-4 py-4"
                  style={{
                    border: `1px solid ${shellBorder}`,
                    background: 'color-mix(in srgb, var(--alpha-surface) 88%, transparent)',
                    boxShadow: '0 18px 36px rgba(24, 27, 39, 0.12)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-[1rem]"
                      style={{
                        background: 'color-mix(in srgb, var(--alpha-bg) 56%, var(--alpha-surface) 44%)',
                        border: `1px solid ${shellBorder}`,
                      }}
                    >
                      <img src="/logo.png" alt="Alpha Tracker" className="alpha-brand-logo macos-auth-logo-spin macos-auth-logo-spin--slow h-9 w-9 object-contain" />
                    </div>
                    <div>
                      <p
                        className="font-[ui-serif,Georgia,serif] text-2xl font-semibold leading-none"
                        style={{ color: 'var(--alpha-text)' }}
                      >
                        Alpha Tracker
                      </p>
                      <p className="mt-1 text-sm" style={{ color: 'var(--alpha-text-muted)' }}>
                        Private workspace for wallets, drops, and ecosystem tracking.
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <div
                className="flex flex-wrap items-center gap-3 text-xs"
                style={{ color: 'var(--alpha-text-muted)' }}
              >
                <span>Dashboard palette</span>
                <span className="h-1 w-1 rounded-full" style={{ background: 'var(--alpha-border)' }} />
                <span>Smooth transition</span>
                <span className="h-1 w-1 rounded-full" style={{ background: 'var(--alpha-border)' }} />
                <span>Mobile ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
