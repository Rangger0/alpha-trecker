// ALPHA TRECKER - Footer

import { Twitter, Send, Github, Heart } from 'lucide-react';

const SOCIAL_LINKS = [
  {
    name: 'X (Twitter)',
    url: 'https://x.com/rinzx_',
    icon: Twitter,
  },
  {
    name: 'Telegram',
    url: 'https://t.me/+MGzRobr9cp4yMTk1',
    icon: Send,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/Rangger0',
    icon: Github,
  },
];

export function Footer() {
  return (
    <footer
      className="mt-auto border-t"
      style={{ borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo-flat.png" 
              alt="ALPHA TRECKER" 
              className="alpha-brand-logo w-10 h-10"
            />
            <span className="font-bold text-lg tracking-wider">
              ALPHA TRECKER
            </span>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-3 transition-opacity duration-200 hover:opacity-85"
                style={{
                  background: 'color-mix(in srgb, var(--alpha-surface) 82%, transparent)',
                }}
                aria-label={link.name}
              >
                <link.icon
                  className="h-5 w-5 transition-colors"
                  style={{ color: 'var(--alpha-text-muted)' }}
                />
              </a>
            ))}
          </div>
          
          {/* Divider */}
          <div
            className="h-px w-24"
            style={{ background: 'color-mix(in srgb, var(--alpha-accent) 32%, transparent)' }}
          />
          
          {/* Credit */}
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              Created with <Heart className="h-3 w-3" style={{ color: 'var(--alpha-danger)', fill: 'var(--alpha-danger)' }} /> by
            </p>
            <p className="font-medium text-foreground">
              Rose Alpha
            </p>
          </div>
          
          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ALPHA TRECKER. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
