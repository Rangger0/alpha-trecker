import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export function AboutPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const mediaLinks = [
    { name: 'X', handle: '@rinzx_', url: 'https://x.com/rinzx_', Icon: XIcon },
    { name: 'Telegram', handle: 'Alpha', url: 'https://t.me/+MGzRobr9cp4yMTk1', Icon: TelegramIcon },
    { name: 'GitHub', handle: 'Rangger0', url: 'https://github.com/Rangger0', Icon: GitHubIcon },
    { name: 'TikTok', handle: '@rinzzx0', url: 'https://www.tiktok.com/@rinzzx0', Icon: TikTokIcon },
  ];

  const cardBaseClasses = `relative p-6 rounded-xl border transition-all duration-300 ease-out overflow-hidden group`;
  
  const cardThemeClasses = isDark 
    ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]' 
    : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-105 ${isDark ? 'bg-[#161B22] border border-[#1F2937]' : 'bg-white border border-[#E5E7EB]'}`}>
            <img src="/logo.png" alt="Alpha Tracker" className="w-12 h-12 object-contain" />
          </div>
          <h1 className={`text-3xl font-bold font-mono mb-3 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
            ALPHA_TRACKER
          </h1>
          <p className={`font-mono text-sm max-w-md mx-auto ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
            Track and manage your airdrop portfolio. Organize projects, monitor progress, and never miss an opportunity in the Web3 space.
          </p>
        </div>

        {/* Main Grid - Portfolio & Rose Alpha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Left - Portfolio */}
          <div className={`${cardBaseClasses} ${cardThemeClasses}`}>
            {/* Animated gradient border */}
            <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${isDark ? 'from-[#00FF88]/20 via-transparent to-[#00FF88]/20' : 'from-[#2563EB]/20 via-transparent to-[#2563EB]/20'}`} />
            
            <h2 className={`font-mono text-xs mb-4 flex items-center gap-2 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              <span className="opacity-60">$</span>
              <span>cat portfolio.json</span>
            </h2>
            
            <a
              href="https://alpha-terminal-eta.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isDark ? 'hover:bg-[#0B0F14]' : 'hover:bg-[#F3F4F6]'}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${isDark ? 'bg-[#0B0F14]' : 'bg-[#F3F4F6]'}`}>
                <img src="/logo1.png" alt="Alpha Terminal" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <p className={`font-mono text-sm font-bold ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                  Alpha Terminal
                </p>
                <p className={`font-mono text-xs ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>
                  alpha-terminal-eta.vercel.app
                </p>
              </div>
            </a>
          </div>

          {/* Right - Rose Alpha */}
          <div className={`${cardBaseClasses} ${cardThemeClasses}`}>
            <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${isDark ? 'from-[#00FF88]/20 via-transparent to-[#00FF88]/20' : 'from-[#2563EB]/20 via-transparent to-[#2563EB]/20'}`} />
            
            <h2 className={`font-mono text-xs mb-4 flex items-center gap-2 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>
              <span className="opacity-60">$</span>
              <span>whoami</span>
            </h2>
            
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105 ring-2 ring-transparent group-hover:ring-current ${isDark ? 'group-hover:ring-[#00FF88]/50' : 'group-hover:ring-[#2563EB]/50'}`}>
                <img src="/profile.png" alt="Rose Alpha" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className={`font-mono text-sm font-bold ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                  Rose Alpha
                </p>
                <p className={`font-mono text-xs ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                  Developer & Creator
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Media - Horizontal Layout */}
        <div className={`${cardBaseClasses} ${cardThemeClasses}`}>
          <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${isDark ? 'from-[#00FF88]/20 via-transparent to-[#00FF88]/20' : 'from-[#2563EB]/20 via-transparent to-[#2563EB]/20'}`} />
          
          <h2 className={`font-mono text-xs mb-6 flex items-center gap-2 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span className="opacity-60">$</span>
            <span>ls -la media/</span>
          </h2>
          
          <div className="flex items-center justify-center gap-6 md:gap-8 flex-wrap">
            {mediaLinks.map((link, index) => (
              <div key={link.name} className="flex items-center gap-6 md:gap-8">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 transition-all duration-200 hover:scale-105 ${isDark ? 'hover:text-[#00FF88]' : 'hover:text-[#2563EB]'}`}
                >
                  <div className={`w-8 h-8 rounded flex items-center justify-center transition-all duration-200 ${isDark ? 'text-[#6B7280] hover:text-[#00FF88] hover:bg-[#00FF88]/10' : 'text-[#6B7280] hover:text-[#2563EB] hover:bg-[#2563EB]/10'}`}>
                    <link.Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-mono text-sm font-bold ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                      {link.name}
                    </p>
                    <p className={`font-mono text-xs ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                      {link.handle}
                    </p>
                  </div>
                </a>
                
                {index < mediaLinks.length - 1 && (
                  <span className={`hidden md:block transition-colors duration-200 ${isDark ? 'text-[#1F2937] group-hover:text-[#00FF88]/30' : 'text-[#E5E7EB] group-hover:text-[#2563EB]/30'}`}>—</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center mt-12 font-mono text-xs ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
          <p>© 2026 ALPHA_TRACKER. All rights reserved.</p>
          <p className="mt-1">Built with passion for the Web3 community.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}