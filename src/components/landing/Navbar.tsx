import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MoonStar, SunMedium } from 'lucide-react';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <nav className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div
          className="macos-nav-shell flex h-16 items-center justify-between px-4 sm:px-5"
          style={{
            background: 'color-mix(in srgb, var(--alpha-surface) 84%, transparent)',
            borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
            boxShadow: '0 18px 44px rgba(18, 20, 31, 0.12)',
          }}
        >
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Alpha Tracker" className="h-10 w-10 object-contain" />
            <span
              className="text-lg font-semibold tracking-[-0.02em]"
              style={{ color: 'var(--alpha-text)' }}
            >
              ALPHA_TRACKER
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {['Features', 'Projects', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium transition-opacity duration-150 hover:opacity-85"
                style={{ color: 'var(--alpha-text-muted)' }}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login">
              <Button
                variant="ghost"
                className="rounded-full px-4 text-sm font-medium transition-opacity duration-150 hover:opacity-85"
                style={{ color: 'var(--alpha-text-muted)' }}
              >
                Login
              </Button>
            </Link>

            <Link to="/register">
              <Button
                className="macos-btn rounded-full px-5 text-sm font-semibold transition-opacity duration-150 hover:opacity-92"
                style={{
                  background:
                    'linear-gradient(135deg, var(--alpha-accent-from), color-mix(in srgb, var(--alpha-accent-to) 78%, var(--alpha-accent) 22%))',
                  color: 'var(--alpha-accent-contrast)',
                  boxShadow: '0 16px 34px color-mix(in srgb, var(--alpha-accent-to) 24%, transparent)',
                }}
              >
                Sign Up
              </Button>
            </Link>

            <button
              onClick={toggleTheme}
              className="flex h-11 w-11 items-center justify-center rounded-[14px] border transition-opacity duration-150 hover:opacity-85"
              style={{
                borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
                color: 'var(--alpha-text-muted)',
                background: 'color-mix(in srgb, var(--alpha-surface) 92%, transparent)',
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
