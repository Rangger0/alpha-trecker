const ecosystems = ['LayerZero', 'Hyperliquid', 'Monad', 'Berachain', 'Movement', 'Initia'];

export function SocialProofSection() {
  return (
    <section className="alpha-rd-section alpha-rd-proof px-4 sm:px-6 lg:px-8">
      <div className="alpha-rd-width">
        <p className="alpha-rd-proof-label">Trusted by Web3 researchers</p>
        <div className="alpha-rd-proof-row">
          {ecosystems.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
