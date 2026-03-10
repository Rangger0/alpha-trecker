import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      <div
        className="macos-landing-width flex flex-col gap-6 rounded-[2rem] border border-[color:var(--alpha-border)] px-6 py-6 sm:flex-row sm:items-end sm:justify-between"
        style={{ background: 'color-mix(in srgb, var(--alpha-surface) 70%, transparent)' }}
      >
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo/logo.png" alt="Alpha Tracker" className="alpha-brand-logo h-8 w-8 object-contain" />
            <span className="alpha-landing-nav-title text-lg">
              Alpha Tracker
            </span>
          </Link>
          <p className="mt-3 max-w-md text-sm leading-7 text-[var(--alpha-text-muted)]">
            One workspace for crypto research, tracking, execution, and review.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--alpha-text-muted)]">
          <a href="https://github.com/Rangger0" target="_blank" rel="noopener noreferrer" className="transition-opacity duration-150 hover:opacity-80">
            GitHub
          </a>
          <a href="https://x.com/rinzx_" target="_blank" rel="noopener noreferrer" className="transition-opacity duration-150 hover:opacity-80">
            Twitter
          </a>
          <a href="https://t.me/+MGzRobr9cp4yMTk1" target="_blank" rel="noopener noreferrer" className="transition-opacity duration-150 hover:opacity-80">
            Telegram
          </a>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
