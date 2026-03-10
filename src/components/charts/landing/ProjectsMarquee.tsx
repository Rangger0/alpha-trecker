import { useTheme } from '@/contexts/ThemeContext';
const projects = [
  { 
    name: 'Plume', 
    logo: '/logos/plume.png', 
    fallback: 'https://alpha-terminal-eta.vercel.app/media/plume-logo.png'
  },
  { 
    name: 'Elixir', 
    logo: '/logos/elixir.png',
    fallback: 'https://alpha-terminal-eta.vercel.app/media/elixir-logo.png'
  },
  { 
    name: 'ether.fi', 
    logo: '/logos/ether.fi.png',
    fallback: 'https://alpha-terminal-eta.vercel.app/media/etherfi-logo.png'
  },
  { 
    name: 'Polygon', 
    logo: '/logos/polygon.png',
    fallback: 'https://alpha-terminal-eta.vercel.app/media/polygon-logo.png'
  },
  { 
    name: 'Ethereum', 
    logo: '/logos/ethereum.png',
    fallback: 'https://alpha-terminal-eta.vercel.app/media/ethereum-logo.png'
  },
  { 
    name: 'Solana', 
    logo: '/logos/solana.png',
    fallback: 'https://alpha-terminal-eta.vercel.app/media/solana-logo.png'
  },
  { 
    name: 'LayerZero', 
    logo: '/logos/layerzero.png',
    fallback: 'https://alpha-terminal-eta.vercel.app/media/layerzero-logo.png'
  },
  { 
    name: 'Celestia', 
    logo: '/logos/celestia.png',
    fallback: 'https://alpha-terminal-eta.vercel.app/media/celestia-logo.png'
  },
];

export function ProjectsMarquee() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const duplicatedProjects = [...projects, ...projects, ...projects];
  return (
    <section id="projects" className="py-12 overflow-hidden relative">
      <div className={`absolute left-0 top-0 bottom-0 w-32 z-10 ${
        isDark 
          ? 'bg-gradient-to-r from-[var(--alpha-bg)] to-transparent' 
          : 'bg-gradient-to-r from-[var(--alpha-bg)] to-transparent'
      }`} />
      <div className={`absolute right-0 top-0 bottom-0 w-32 z-10 ${
        isDark 
          ? 'bg-gradient-to-l from-[var(--alpha-bg)] to-transparent' 
          : 'bg-gradient-to-l from-[var(--alpha-bg)] to-transparent'
      }`} />
      <div className="flex animate-marquee hover:pause">
        {duplicatedProjects.map((project, index) => (
          <div
            key={index}
            className={`flex-shrink-0 mx-4 w-48 h-24 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              isDark 
                ? 'bg-[var(--alpha-surface)] border border-[var(--alpha-border)] hover:border-[var(--alpha-signal)]' 
                : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-3 px-4">
              <img 
                src={project.logo} 
                alt={project.name}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = project.fallback;
                }}
              />
              <span className={`font-mono font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {project.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
