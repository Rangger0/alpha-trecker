import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Research', href: '#research' },
  { label: 'Projects', href: '#projects' },
  { label: 'Docs', href: '#docs' },
  { label: 'Leaderboard', href: '#leaderboard' },
];

interface NavbarProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export function Navbar({ onOpenAuth: _onOpenAuth }: NavbarProps) {
  return (
    <nav className="alpha-v2-navbar pointer-events-none fixed inset-x-0 top-0 z-[80] px-4 pb-4 pt-4 sm:px-6 lg:px-8">
      <div className="macos-landing-width">
        <div className="alpha-v2-nav-shell pointer-events-auto flex h-[68px] items-center justify-between gap-3 px-4 sm:px-5">
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
              <a key={item.label} href={item.href} className="alpha-v2-nav-link text-sm font-medium">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link to="/login" className="hidden sm:inline-flex">
              <Button
                type="button"
                variant="ghost"
                className="alpha-v2-nav-login h-11 rounded-lg px-4 text-sm font-medium"
              >
                Login
              </Button>
            </Link>

            <Link to="/register">
              <Button
                type="button"
                className="alpha-v2-primary-btn h-11 rounded-lg px-4 text-sm font-semibold sm:px-5"
              >
                <span className="hidden sm:inline">Get Started</span>
                <ArrowRight className="h-4 w-4 sm:ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
