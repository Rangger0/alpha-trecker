// src/components/landing/Footer.tsx
import { Link } from 'react-router-dom';

const footerLinks = {
  'About Us': ['Dashboard', 'Multiple Account', 'Features', 'Pricing'],
  Support: ['Documentation', 'API Reference', 'Community', 'Contact'],
  Social: [
    { name: 'Twitter', href: 'https://x.com/rinzx_' },
    { name: 'Telegram', href: 'https://t.me/+MGzRobr9cp4yMTk1' },
    { name: 'GitHub', href: 'https://github.com/Rangger0' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@rinzzx0' },
  ],
};

export function Footer() {
  return (
    <footer className="px-4 py-12 sm:px-6 lg:px-8">
      <div
        className="macos-landing-card mx-auto max-w-7xl rounded-[2rem] px-6 py-8 sm:px-8"
        style={{
          borderColor: 'color-mix(in srgb, var(--alpha-border) 86%, transparent)',
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--alpha-surface) 96%, transparent), color-mix(in srgb, var(--alpha-panel) 90%, transparent))',
        }}
      >
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-3">
              <img src="/logo.png" alt="Alpha Tracker" className="h-8 w-8 object-contain" />
              <span className="text-lg font-semibold tracking-[-0.02em]" style={{ color: 'var(--alpha-text)' }}>
                ALPHA_TRACKER
              </span>
            </Link>

            <p className="text-sm leading-7" style={{ color: 'var(--alpha-text-muted)' }}>
              The ultimate toolkit for serious project hunters.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-[17px] font-semibold tracking-[-0.02em]" style={{ color: 'var(--alpha-text)' }}>
                {category}
              </h4>

              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    {typeof link === 'string' ? (
                      <a href="#" className="text-sm transition-opacity duration-150 hover:opacity-80" style={{ color: 'var(--alpha-text-muted)' }}>
                        {link}
                      </a>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm transition-opacity duration-150 hover:opacity-80"
                        style={{ color: 'var(--alpha-text-muted)' }}
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

        <div
          className="flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
          style={{ borderColor: 'color-mix(in srgb, var(--alpha-border) 78%, transparent)' }}
        >
          <p className="text-sm" style={{ color: 'var(--alpha-text-muted)' }}>
            Copyright © 2026 Alpha Tracker
          </p>
          <a href="#" className="text-sm transition-opacity duration-150 hover:opacity-80" style={{ color: 'var(--alpha-text-muted)' }}>
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
