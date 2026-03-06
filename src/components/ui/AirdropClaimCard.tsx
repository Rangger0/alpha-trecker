import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AirdropClaimCardProps {
  airdrop: {
    id: string;
    name: string;
    logo?: string | null;
    type: 'Airdrop' | 'Points';
    value: string;
    claimable: boolean;
  };
  onClaim: () => void;
}

export function AirdropClaimCard({ airdrop, onClaim }: AirdropClaimCardProps) {
  return (
    <article
      className={`p-4 macos-card transition-all duration-300 flex items-center gap-4`}
      style={{ borderColor: 'var(--alpha-border)', background: 'var(--alpha-surface)' }}
    >
      {/* Logo */}
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ background: 'var(--alpha-panel)', border: '1px solid var(--alpha-border)' }}
      >
        {airdrop.logo ? (
          <img src={airdrop.logo} alt={airdrop.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl font-bold alpha-text">{airdrop.name[0].toUpperCase()}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-mono font-bold truncate alpha-text`}>{airdrop.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="font-mono text-xs">
            {airdrop.type}
          </Badge>
          <span className="font-mono text-xs alpha-muted">{airdrop.value}</span>
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center gap-3">
        <Button
          onClick={onClaim}
          disabled={!airdrop.claimable}
          className={`macos-btn ${airdrop.claimable ? 'macos-btn--primary' : 'macos-btn--ghost'}`}
          style={airdrop.claimable ? undefined : { opacity: 0.6, cursor: 'not-allowed' }}
        >
          {airdrop.claimable ? 'Claim Now' : 'Claim Unavailable'}
        </Button>
      </div>
    </article>
  );
}
