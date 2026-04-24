import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MoonStar, SunMedium } from 'lucide-react';

const navLinks = [
  { label: 'Workflow', href: '#workflow' },
  { label: 'Preview', href: '#preview' },
  { label: 'Ecosystems', href: '#ecosystems' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

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
                  Disciplined crypto research and execution workspace
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
            <Link to="/login">
              <Button
                variant="ghost"
                className="rounded-full px-4 text-sm font-medium transition-opacity duration-150 hover:opacity-85"
                style={{ color: 'var(--alpha-text-muted)' }}
              >
                Sign In
              </Button>
            </Link>

            <Link to="/register">
              <Button
                className="macos-btn macos-sheen rounded-full px-5 text-sm font-semibold transition-opacity duration-150 hover:opacity-92"
                style={{
                  background: 'var(--alpha-accent-to)',
                  color: 'var(--alpha-accent-contrast)',
                  border: '1px solid color-mix(in srgb, var(--alpha-accent-to) 72%, transparent)',
                }}
              >
                Start Free
              </Button>
            </Link>

            <button
              onClick={toggleTheme}
              className="flex h-11 w-11 items-center justify-center rounded-[14px] border transition-opacity duration-150 hover:opacity-85"
              style={{
                borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
                color: 'var(--alpha-text-muted)',
                background: 'color-mix(in srgb, var(--alpha-surface) 88%, transparent)',
              }}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
