import { Gift, Rocket, Users, Wallet } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';
import { useLandingWorkspaceStats } from '@/hooks/use-landing-workspace-stats';

export function StatsSection() {
  const { ref, isInView } = useInView();
  const workspace = useLandingWorkspaceStats();
  const guestValue = workspace.loading ? '--' : 'Connect';
  const stats = [
    {
      label: 'Workspace Projects',
      value: workspace.isAuthenticated ? workspace.projects.toLocaleString('en-US') : guestValue,
      icon: Users,
    },
    {
      label: 'Priority Projects',
      value: workspace.isAuthenticated ? workspace.priorityProjects.toLocaleString('en-US') : guestValue,
      icon: Rocket,
    },
    {
      label: 'Funding Tracked',
      value: workspace.isAuthenticated ? workspace.fundingLabel : guestValue,
      icon: Wallet,
    },
    {
      label: 'Active Airdrops',
      value: workspace.isAuthenticated ? workspace.activeAirdrops.toLocaleString('en-US') : guestValue,
      icon: Gift,
    },
  ];

  return (
    <section id="leaderboard" ref={ref} className="alpha-v2-section px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="macos-landing-width">
        <div className="alpha-v2-stats-grid">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`alpha-v2-stat-card scroll-stagger-item ${isInView ? 'in-view' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="alpha-v2-stat-icon">
                <stat.icon className="h-5 w-5" />
              </div>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
