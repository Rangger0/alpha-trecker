const stats = [
  { value: '$1.2B+', label: 'Tracked Funding' },
  { value: '8,000+', label: 'Projects' },
  { value: '120+', label: 'Ecosystems' },
  { value: '95%', label: 'Research Accuracy' },
];

export function StatsSection() {
  return (
    <section className="alpha-rd-section px-4 sm:px-6 lg:px-8" style={{ paddingTop: 0 }}>
      <div className="alpha-rd-width">
        <div className="alpha-rd-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="alpha-rd-stat-card">
              <div className="alpha-rd-stat-value">{stat.value}</div>
              <div className="alpha-rd-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
