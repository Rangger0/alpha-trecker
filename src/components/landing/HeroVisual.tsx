export function HeroVisual() {
  return (
    <div className="relative h-full min-h-[500px] flex items-center justify-center animate-fade-in-left">
      {/* Background gradient orbs */}
      <div
        className="absolute inset-0 rounded-3xl opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 30% 50%, var(--alpha-accent), transparent)',
        }}
      />

      {/* Main visual container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border animate-float-medium"
          style={{
            borderColor: 'var(--alpha-border)',
            backgroundColor: 'var(--alpha-panel)',
          }}
        >
          {/* Window chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ borderColor: 'var(--alpha-border)' }}
          >
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs font-medium flex-1 ml-4" style={{ color: 'var(--alpha-text-muted)' }}>
              Alpha Tracker
            </span>
          </div>

          {/* Dashboard content */}
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--alpha-accent) 10%, transparent)' }}>
                <p className="text-xs" style={{ color: 'var(--alpha-text-muted)' }}>Tracking</p>
                <p className="text-lg font-bold" style={{ color: 'var(--alpha-accent)' }}>127</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--alpha-accent) 10%, transparent)' }}>
                <p className="text-xs" style={{ color: 'var(--alpha-text-muted)' }}>Wallets</p>
                <p className="text-lg font-bold" style={{ color: 'var(--alpha-accent)' }}>8</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium" style={{ color: 'var(--alpha-text-muted)' }}>Active Projects</p>
              <div className="space-y-1.5">
                {[
                  { name: 'LayerZero', progress: 85 },
                  { name: 'Monad', progress: 72 },
                  { name: 'Movement', progress: 60 },
                ].map((project) => (
                  <div key={project.name}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs" style={{ color: 'var(--alpha-text)' }}>{project.name}</p>
                      <p className="text-xs" style={{ color: 'var(--alpha-text-muted)' }}>{project.progress}%</p>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--alpha-border)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: 'var(--alpha-accent)',
                          width: `${project.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, rgb(239, 68, 68) 8%, transparent)' }}>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--alpha-text-muted)' }}>Sybil Risk</p>
              <p className="text-sm font-bold" style={{ color: 'rgb(239, 68, 68)' }}>2 Wallets</p>
            </div>

            <div className="p-3 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--alpha-accent) 10%, transparent)' }}>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--alpha-text-muted)' }}>Rewards</p>
              <p className="text-sm font-bold" style={{ color: 'var(--alpha-accent)' }}>$12,450</p>
            </div>
          </div>
        </div>

        <div
          className="absolute top-12 -left-8 p-3 rounded-lg shadow-lg border animate-float"
          style={{
            borderColor: 'var(--alpha-border)',
            backgroundColor: 'var(--alpha-panel)',
            width: '140px',
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          <p className="text-xs font-bold" style={{ color: 'var(--alpha-text-muted)' }}>Funding</p>
          <p className="text-base font-bold" style={{ color: 'var(--alpha-accent)' }}>$1.2B+</p>
        </div>

        <div
          className="absolute bottom-20 -right-8 p-3 rounded-lg shadow-lg border animate-float"
          style={{
            borderColor: 'var(--alpha-border)',
            backgroundColor: 'var(--alpha-panel)',
            width: '140px',
            animation: 'float 4s ease-in-out infinite 0.5s',
          }}
        >
          <p className="text-xs font-bold" style={{ color: 'var(--alpha-text-muted)' }}>Ecosystems</p>
          <p className="text-base font-bold" style={{ color: 'var(--alpha-accent)' }}>120+</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}
