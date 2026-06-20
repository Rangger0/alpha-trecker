export function ProductShowcaseSection() {
  return (
    <section id="preview" className="alpha-rd-section px-4 sm:px-6 lg:px-8">
      <div className="alpha-rd-glow" aria-hidden="true" />
      <div className="alpha-rd-width">
        <div className="alpha-rd-section-head alpha-rd-center">
          <span className="alpha-rd-eyebrow">Product</span>
          <h2 className="alpha-rd-heading">See the workspace in action.</h2>
          <p className="alpha-rd-subcopy">Built for research, execution and tracking.</p>
        </div>

        <div className="alpha-rd-showcase-frame">
          <div className="alpha-rd-showcase-bar">
            <i />
            <i />
            <i />
            <span>Alpha Tracker Dashboard</span>
          </div>
          <img src="/3.webp" alt="Alpha Tracker dashboard" loading="lazy" decoding="async" />
        </div>
      </div>
    </section>
  );
}
