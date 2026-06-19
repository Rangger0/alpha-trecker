import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MoonStar, SunMedium, ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Preview', href: '#preview' },
  { label: 'Workspace', href: '#workspace' },
];

interface NavbarProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export function Navbar({ onOpenAuth }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const ThemeIcon = isDark ? MoonStar : SunMedium;

  return (
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-[80] px-4 pb-4 pt-4 sm:px-6 lg:px-8">
      <div className="macos-landing-width">
        <div
          className="macos-nav-shell pointer-events-auto flex h-[66px] items-center justify-between gap-3 px-4 sm:px-5"
          style={{
            background: 'color-mix(in srgb, var(--alpha-panel) 88%, transparent)',
            borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
          }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/" className="flex min-w-0 shrink-0 items-center gap-3">
              <img src="/logo/logo.png" alt="Alpha Tracker" className="alpha-brand-logo h-9 w-9 object-contain" />
              <div className="min-w-0">
                <p className="alpha-landing-nav-title truncate">
                  Alpha Tracker
                </p>
                <p className="alpha-landing-nav-note hidden sm:block">
                  Web3 research workspace
                </p>
              </div>
            </Link>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              item.href.startsWith('/') ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-sm font-medium transition-opacity duration-150 hover:opacity-85"
                  style={{ color: 'var(--alpha-text-muted)' }}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium transition-opacity duration-150 hover:opacity-85"
                  style={{ color: 'var(--alpha-text-muted)' }}
                >
                  {item.label}
                </a>
              )
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenAuth('login')}
              className="hidden rounded-full px-4 text-sm font-medium transition-opacity duration-150 hover:opacity-85 sm:inline-flex"
              style={{ color: 'var(--alpha-text-muted)' }}
            >
              Sign In
            </Button>

            <Button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="macos-btn rounded-full px-4 text-sm font-semibold transition-opacity duration-150 hover:opacity-92 sm:px-5"
              style={{
                background: 'var(--alpha-accent)',
                color: 'var(--alpha-accent-contrast)',
                border: '1px solid color-mix(in srgb, var(--alpha-accent) 72%, transparent)',
              }}
            >
              <span className="hidden sm:inline">Start Tracking</span>
              <ArrowRight className="h-4 w-4 sm:ml-1" />
            </Button>

            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-11 w-11 items-center justify-center rounded-[14px] border"
              style={{
                borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
                color: 'var(--alpha-text-muted)',
                background: 'color-mix(in srgb, var(--alpha-surface) 88%, transparent)',
              }}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              aria-pressed={isDark}
            >
              <ThemeIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
