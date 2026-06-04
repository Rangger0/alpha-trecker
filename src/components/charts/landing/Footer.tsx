// src/components/landing/Footer.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const footerLinks = {
  'About Us': ['Dashboard', 'Multiple Account', 'Features', 'Pricing'],
  'Support': ['Documentation', 'API Reference', 'Community', 'Contact'],
  'Social': [
    { name: 'Twitter', href: 'https://x.com/rinzx_' },
    { name: 'Telegram', href: 'https://t.me/+MGzRobr9cp4yMTk1' },
    { name: 'GitHub', href: 'https://github.com/Rangger0' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@rinzzx0' },
  ],
};

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className={`border-t py-12 px-4 sm:px-6 lg:px-8 ${
      isDark ? 'border-[var(--alpha-border)] bg-[var(--alpha-surface-strong)]' : 'border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)]'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand dengan Logo PNG */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              {!logoError ? (
                <img 
                  src="/logo.png" 
                  alt="Alpha Tracker"
                  className="w-8 h-8 object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded flex items-center justify-center bg-[color:var(--alpha-hover-soft)]">
                  <span className={`font-mono font-bold ${isDark ? 'text-[var(--alpha-signal)]' : 'text-[color:var(--alpha-signal)]'}`}>
                    {'>'}_
                  </span>
                </div>
              )}
              <span className={`font-bold font-mono ${isDark ? 'text-[color:var(--alpha-text)]' : 'text-[color:var(--alpha-text)]'}`}>
                <span className={isDark ? 'text-[var(--alpha-signal)]' : 'text-[color:var(--alpha-signal)]'}>ALPHA</span>_TRACKER
              </span>
            </Link>
            <p className={`text-sm ${isDark ? 'text-[color:var(--alpha-text-muted)]' : 'text-[color:var(--alpha-text-muted)]'}`}>
              The ultimate toolkit for serious project hunters.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className={`font-bold font-mono mb-4 ${
                isDark ? 'text-[color:var(--alpha-text)]' : 'text-[color:var(--alpha-text)]'
              }`}>
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    {typeof link === 'string' ? (
                      <a href="#" className={`text-sm hover:text-[var(--alpha-signal)] transition-colors ${
                        isDark ? 'text-[color:var(--alpha-text-muted)]' : 'text-[color:var(--alpha-text-muted)]'
                      }`}>
                        {link}
                      </a>
                    ) : (
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-sm hover:text-[var(--alpha-signal)] transition-colors ${
                          isDark ? 'text-[color:var(--alpha-text-muted)]' : 'text-[color:var(--alpha-text-muted)]'
                        }`}
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDark ? 'border-[var(--alpha-border)]' : 'border-[color:var(--alpha-border)]'
        }`}>
          <p className={`text-sm ${isDark ? 'text-[color:var(--alpha-text-muted)]' : 'text-[color:var(--alpha-text-muted)]'}`}>
            Copyright © 2026 Alpha Tracker
          </p>
          <a href="#" className={`text-sm hover:text-[var(--alpha-signal)] transition-colors ${
            isDark ? 'text-[color:var(--alpha-text-muted)]' : 'text-[color:var(--alpha-text-muted)]'
          }`}>
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}