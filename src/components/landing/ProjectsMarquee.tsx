// src/components/landing/ProjectsMarquee.tsx
const projects = [
  { name: 'Plume', logo: '/logos/plume.png', fallback: 'https://alpha-terminal-eta.vercel.app/media/plume-logo.png' },
  { name: 'Elixir', logo: '/logos/elixir.png', fallback: 'https://alpha-terminal-eta.vercel.app/media/elixir-logo.png' },
  { name: 'ether.fi', logo: '/logos/ether.fi.png', fallback: 'https://alpha-terminal-eta.vercel.app/media/etherfi-logo.png' },
  { name: 'Polygon', logo: '/logos/polygon.png', fallback: 'https://alpha-terminal-eta.vercel.app/media/polygon-logo.png' },
  { name: 'Ethereum', logo: '/logos/ethereum.png', fallback: 'https://alpha-terminal-eta.vercel.app/media/ethereum-logo.png' },
  { name: 'Solana', logo: '/logos/solana.png', fallback: 'https://alpha-terminal-eta.vercel.app/media/solana-logo.png' },
  { name: 'LayerZero', logo: '/logos/layerzero.png', fallback: 'https://alpha-terminal-eta.vercel.app/media/layerzero-logo.png' },
  { name: 'Celestia', logo: '/logos/celestia.png', fallback: 'https://alpha-terminal-eta.vercel.app/media/celestia-logo.png' },
];

export function ProjectsMarquee() {
  return (
    <section id="projects" className="relative overflow-hidden py-12">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 sm:w-32"
        style={{ background: 'linear-gradient(90deg, var(--alpha-bg), transparent)' }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 sm:w-32"
        style={{ background: 'linear-gradient(270deg, var(--alpha-bg), transparent)' }}
      />

      <div className="projects-marquee">
        <div className="projects-marquee__track">
          {[0, 1].map((groupIndex) => (
            <div key={groupIndex} className="projects-marquee__group" aria-hidden={groupIndex === 1}>
              {projects.map((project) => (
                <div
                  key={`${groupIndex}-${project.name}`}
                  className="flex h-24 w-48 flex-shrink-0 items-center justify-center rounded-[1.4rem] transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background:
                      'linear-gradient(180deg, color-mix(in srgb, var(--alpha-surface) 94%, transparent), color-mix(in srgb, var(--alpha-panel) 88%, transparent))',
                    border: '1px solid color-mix(in srgb, var(--alpha-border) 86%, transparent)',
                    boxShadow: '0 14px 26px rgba(18, 20, 31, 0.08)',
                  }}
                >
                  <div className="flex items-center gap-3 px-4">
                    <img
                      src={project.logo}
                      alt={project.name}
                      className="h-10 w-10 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = project.fallback;
                      }}
                    />
                    <span className="text-base font-semibold tracking-[-0.01em]" style={{ color: 'var(--alpha-text)' }}>
                      {project.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
