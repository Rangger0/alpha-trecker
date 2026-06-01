import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, Database, LineChart, MoonStar, ShieldCheck, SunMedium } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  features: readonly string[];
}

const proofItems = [
  { icon: LineChart, label: 'Research', value: 'Opportunity pipeline' },
  { icon: ShieldCheck, label: 'Tracking', value: 'Wallet and reward context' },
  { icon: Database, label: 'Review', value: 'One source of truth' },
];

export function AuthLayout({ children, title, subtitle, features }: AuthLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isDark = theme === 'dark';
  const isLoginRoute = location.pathname === '/login';
  const ThemeIcon = isDark ? MoonStar : SunMedium;

  return (
    <div className={`alpha-theme ${theme} macos-root alpha-auth-redesign min-h-screen`}>
      <div className="alpha-auth-background" aria-hidden="true" />

      <header className="alpha-auth-topbar">
        <Link to="/" className="alpha-auth-brand" aria-label="Alpha Tracker home">
          <img src="/logo.png" alt="Alpha Tracker" className="alpha-brand-logo h-9 w-9 object-contain" />
          <div>
            <p>Alpha Tracker</p>
            <span>Disciplined crypto workspace</span>
          </div>
        </Link>

        <div className="alpha-auth-nav">
          <button
            type="button"
            onClick={toggleTheme}
            className="alpha-auth-icon-btn"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            aria-pressed={isDark}
          >
            <ThemeIcon className="h-4 w-4" />
          </button>
          <Link to={isLoginRoute ? '/register' : '/login'} className="alpha-auth-nav-link">
            {isLoginRoute ? 'Create Account' : 'Sign In'}
          </Link>
        </div>
      </header>

      <main className="alpha-auth-main">
        <section className="alpha-auth-panel alpha-auth-product-panel">
          <div className="alpha-auth-product-copy">
            <p className="alpha-auth-kicker">Alpha Tracker</p>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          <div className="alpha-auth-proof-board">
            <div className="alpha-auth-proof-header">
              <span>Workspace loop</span>
              <strong>Research {'->'} Track {'->'} Execute {'->'} Review</strong>
            </div>

            <div className="alpha-auth-proof-grid">
              {proofItems.map((item) => (
                <article key={item.label}>
                  <item.icon className="h-4 w-4" />
                  <p>{item.label}</p>
                  <span>{item.value}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="alpha-auth-benefits">
            {features.map((feature) => (
              <div key={feature}>
                <span>
                  <Check className="h-4 w-4" />
                </span>
                <p>{feature}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="alpha-auth-form-panel">
          {children}
        </section>
      </main>
    </div>
  );
}
