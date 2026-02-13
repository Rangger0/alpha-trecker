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
    <footer className="border-t border-red-500/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo-flat.png" 
              alt="ALPHA TRECKER" 
              className="w-10 h-10"
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
                className="p-3 rounded-full bg-muted/50 hover:bg-red-500/20 transition-colors duration-200"
                aria-label={link.name}
              >
                <link.icon className="h-5 w-5 text-muted-foreground hover:text-red-500 transition-colors" />
              </a>
            ))}
          </div>
          
          {/* Divider */}
          <div className="w-24 h-px bg-red-500/30" />
          
          {/* Credit */}
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              Created with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by
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
