import { PREDEFINED_ECOSYSTEMS } from '@/lib/ecosystems';

const ecosystemItems = PREDEFINED_ECOSYSTEMS.slice(0, 12);
const firstRow = ecosystemItems.slice(0, 6);
const secondRow = ecosystemItems.slice(6, 12);

const renderTrack = (items: typeof firstRow, reverse = false) => (
  <div className="alpha-landing-ecosystem-marquee">
    <div className={`alpha-landing-ecosystem-track ${reverse ? 'alpha-landing-ecosystem-track--reverse' : ''}`}>
      {[0, 1].map((copy) => (
        <div key={copy} className="alpha-landing-ecosystem-group">
          {items.map((ecosystem) => (
            <article key={`${copy}-${ecosystem.id}`} className="alpha-landing-ecosystem-card">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] border"
                style={{
                  borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
                  background:
                    'linear-gradient(180deg, color-mix(in srgb, white 12%, transparent), color-mix(in srgb, var(--alpha-surface) 88%, transparent))',
                  boxShadow: 'inset 0 1px 0 color-mix(in srgb, white 14%, transparent)',
                }}
              >
                <img
                  src={ecosystem.logo}
                  alt={ecosystem.name}
                  className="h-5 w-5 object-contain grayscale"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-[-0.02em] text-[var(--alpha-text)]">
                  {ecosystem.name}
                </p>
                <p className="mt-1 text-xs text-[var(--alpha-text-muted)]">
                  @{ecosystem.twitterHandle}
                </p>
              </div>
            </article>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export function ProjectsMarquee() {
  return (
    <section id="ecosystems" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="macos-landing-width grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
        <div className="space-y-4">
          <p className="macos-section-label">Ecosystem tracking</p>
          <h2 className="alpha-landing-section-title">
            Track major and emerging ecosystems in the same workspace.
          </h2>
          <p className="alpha-landing-section-copy">
            Ecosystem coverage stays close to research and execution instead of becoming a separate tool.
          </p>
        </div>

        <div className="space-y-3" data-stagger>
          {renderTrack(firstRow)}
          {renderTrack(secondRow, true)}
        </div>
      </div>
    </section>
  );
}
