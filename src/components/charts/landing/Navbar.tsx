// src/components/landing/Navbar.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function Navbar() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [logoError, setLogoError] = useState(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
      isDark 
        ? 'bg-[var(--alpha-surface-strong)] border-[var(--alpha-border)]' 
        : 'bg-[color:color-mix(in_srgb,var(--alpha-panel)_80%,transparent)] border-[color:var(--alpha-border)]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo PNG */}
          <Link to="/" className="flex items-center gap-3 group">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="Alpha Tracker"
                className="w-10 h-10 object-contain transition-transform group-hover:scale-110"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-10 h-10 rounded flex items-center justify-center bg-[color:var(--alpha-hover-soft)]">
                <span className={`font-mono font-bold text-xl ${isDark ? 'text-[var(--alpha-signal)]' : 'text-[color:var(--alpha-signal)]'}`}>
                  {'>'}_
                </span>
              </div>
            )}
            
            <span className={`font-bold text-lg font-mono ${isDark ? 'text-[color:var(--alpha-text)]' : 'text-[color:var(--alpha-text)]'}`}>
              <span className={isDark ? 'text-[var(--alpha-signal)]' : 'text-[color:var(--alpha-signal)]'}>ALPHA</span>_TRACKER
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Projects', 'Pricing'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isDark ? 'text-[color:var(--alpha-text-muted)] hover:text-[var(--alpha-signal)]' : 'text-[color:var(--alpha-text-muted)] hover:text-[color:var(--alpha-signal)]'
                }`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className={`font-mono text-sm transition-all duration-300 hover:scale-105 ${
                isDark ? 'text-[color:var(--alpha-text-muted)] hover:text-[color:var(--alpha-text)]' : 'text-[color:var(--alpha-text-muted)] hover:text-[color:var(--alpha-text)]'
              }`}>
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className={`font-mono text-sm px-6 transition-all duration-300 hover:scale-105 ${
                isDark 
                  ? 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] hover:bg-[var(--alpha-signal-press)] shadow-[0_0_20px_var(--alpha-signal-glow)]' 
                  : 'bg-gradient-to-r from-[color:var(--alpha-main)] to-[color:var(--alpha-highlight)] text-[color:var(--alpha-text)] hover:opacity-90 shadow-lg'
              }`}>
                Sign Up →
              </Button>
            </Link>
            <div
              className={`p-2 rounded-lg border ${
                isDark
                  ? 'border-[var(--alpha-border)] text-[color:var(--alpha-text-muted)]'
                  : 'border-[color:var(--alpha-border)] text-[color:var(--alpha-text-muted)]'
              }`}
            >
              ☀
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
