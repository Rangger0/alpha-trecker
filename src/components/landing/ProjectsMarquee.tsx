import type { CSSProperties } from 'react';
import { PREDEFINED_ECOSYSTEMS } from '@/lib/ecosystems';

const ecosystemItems = PREDEFINED_ECOSYSTEMS.slice(0, 12);
const firstRow = ecosystemItems.slice(0, 6);
const secondRow = ecosystemItems.slice(6, 12);

const coverageStats = [
  {
    label: 'Tracked ecosystems',
    value: `${PREDEFINED_ECOSYSTEMS.length}+`,
  },
  {
    label: 'Workspace model',
    value: 'Research + execution',
  },
  {
    label: 'Signal style',
    value: 'Fast, calm, and focused',
  },
];

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
      <div className="macos-landing-width alpha-premium-ecosystem-board">
        <div className="space-y-6">
          <div className="space-y-4" data-stagger>
            <p className="macos-section-label">Ecosystem coverage</p>
            <h2 className="alpha-landing-section-title">
              Major ecosystems and emerging lanes stay visible inside the same operating layer.
            </h2>
            <p className="alpha-landing-section-copy">
              Coverage is treated like part of the product workflow, so scanning new chains never feels detached from execution.
            </p>
          </div>

          <div className="alpha-premium-coverage-grid">
            {coverageStats.map((item, index) => (
              <article
                key={item.label}
                className="alpha-premium-coverage-card"
                data-stagger
                style={{ '--stagger-delay': `${index * 80}ms` } as CSSProperties}
              >
                <p className="alpha-premium-coverage-label">{item.label}</p>
                <p className="alpha-premium-coverage-value">{item.value}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="alpha-premium-ecosystem-stage" data-stagger style={{ '--stagger-delay': '120ms' } as CSSProperties}>
          <div className="alpha-premium-ecosystem-stage-head">
            <div>
              <p className="alpha-premium-preview-eyebrow">Coverage board</p>
              <h3 className="alpha-premium-preview-title">Ecosystem view built for real scanning sessions</h3>
            </div>
            <p className="alpha-premium-preview-frame-copy">
              From Ethereum to Sui, the product keeps ecosystem context close to routes, tools, and follow-up.
            </p>
          </div>

          <div className="space-y-3">
            {renderTrack(firstRow)}
            {renderTrack(secondRow, true)}
          </div>
        </div>
      </div>
    </section>
  );
}
