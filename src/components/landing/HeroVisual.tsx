import { useState } from 'react';
import { BrainCircuit, CircleDollarSign, Crosshair, ScanLine, ShieldCheck, Sparkles } from 'lucide-react';
import { useLandingWorkspaceStats } from '@/hooks/use-landing-workspace-stats';

const panelItems = ['Ethereum', 'Solana', 'Base', 'Arbitrum'];
const mascotSources = ['/alpha-mascot-transparent.png', '/alpha-mascot.webp', '/alpha-working.webp', '/alpha-default.webp', '/alpha-character-pack.webp', '/alpha-character-pack.png', '/mascot.webp', '/mascot.png'];

export function HeroVisual() {
  const [mascotIndex, setMascotIndex] = useState(0);
  const mascotSrc = mascotSources[mascotIndex];
  const workspace = useLandingWorkspaceStats();
  const guestValue = workspace.loading ? '--' : 'Connect';
  const displayScore = workspace.isAuthenticated && workspace.opportunityScore != null
    ? workspace.opportunityScore
    : null;
  const researchCards = [
    {
      label: 'Funding Tracked',
      value: workspace.isAuthenticated ? workspace.fundingLabel : guestValue,
      icon: CircleDollarSign,
    },
    {
      label: 'Wallet Scanner',
      value: workspace.isAuthenticated ? workspace.trackedWallets.toLocaleString('en-US') : guestValue,
      icon: ScanLine,
    },
    {
      label: 'Projects Synced',
      value: workspace.isAuthenticated ? workspace.projects.toLocaleString('en-US') : guestValue,
      icon: BrainCircuit,
    },
    {
      label: 'Opportunity Score',
      value: displayScore == null ? guestValue : displayScore.toString(),
      icon: Sparkles,
    },
  ];

  return (
    <div className="alpha-v2-visual" aria-label="Alpha Tracker AI command center mascot">
      <div className="alpha-v2-holo-orbit" aria-hidden="true" />
      <div className="alpha-v2-holo-core" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="alpha-v2-floating-panel alpha-v2-floating-panel--chains">
        <p className="alpha-v2-panel-title">Multi-chain Support</p>
        <div className="space-y-3">
          {panelItems.map((item) => (
            <div key={item} className="alpha-v2-chain-row">
              <img src={`/logos/${item.toLowerCase()}.png`} alt="" className="h-6 w-6 rounded-full object-contain" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="alpha-v2-floating-panel alpha-v2-floating-panel--score">
        <p className="alpha-v2-panel-title">Workspace Opportunity Score</p>
        <div className="alpha-v2-score-ring">
          <span>{displayScore ?? '--'}</span>
          <small>{workspace.isAuthenticated ? '/100' : 'sync'}</small>
        </div>
        <strong>{workspace.isAuthenticated ? 'Synced from dashboard' : 'Connect dashboard'}</strong>
      </div>

      <div className="alpha-v2-floating-panel alpha-v2-floating-panel--market">
        <p className="alpha-v2-panel-title">Dashboard Sync</p>
        <div className="alpha-v2-market-lines">
          <span style={{ width: workspace.isAuthenticated ? `${Math.min(95, 24 + workspace.projects * 8)}%` : '34%' }} />
          <span style={{ width: workspace.isAuthenticated ? `${Math.min(95, 24 + workspace.priorityProjects * 12)}%` : '34%' }} />
          <span style={{ width: workspace.isAuthenticated ? `${Math.min(95, 24 + workspace.activeAirdrops * 10)}%` : '34%' }} />
          <span style={{ width: workspace.isAuthenticated ? `${Math.min(95, 24 + workspace.weeklyDeadlines * 14)}%` : '34%' }} />
        </div>
      </div>

      <div className="alpha-v2-mascot-frame">
        {mascotSrc ? (
          <img
            src={mascotSrc}
            alt="Alpha Tracker official mascot"
            className="alpha-v2-mascot"
            onError={() => setMascotIndex((current) => current + 1)}
          />
        ) : (
          <div className="alpha-v2-mascot-placeholder">
            <img src="/logo/logo.png" alt="" className="h-16 w-16 object-contain" />
            <p>Official mascot file missing</p>
            <span>Upload the provided character as alpha-mascot.webp or alpha-character-pack.png in public.</span>
          </div>
        )}
      </div>

      <div className="alpha-v2-hero-card-grid">
        {researchCards.map((card) => (
          <article key={card.label} className="alpha-v2-mini-card">
            <div className="alpha-v2-mini-icon">
              <card.icon className="h-4 w-4" />
            </div>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <div className="alpha-v2-security-pill">
        <ShieldCheck className="h-4 w-4" />
        Sybil Detection Live
      </div>
      <div className="alpha-v2-target-reticle" aria-hidden="true">
        <Crosshair className="h-5 w-5" />
      </div>
    </div>
  );
}
