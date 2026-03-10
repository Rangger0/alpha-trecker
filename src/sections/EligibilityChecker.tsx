// sections/EligibilityChecker.tsx
import React, { useState } from 'react';
import { useWalletContext } from '@/contexts/WalletContext';
import { WalletConnectModal } from '@/components/modals/WalletConnectModal';
import { EligibilityModal } from '@/components/modals/EligibilityModal';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  CheckCircle, 
  XCircle, 
  Search, 
  Plus, 
  Activity,
  Shield
} from 'lucide-react';

export const EligibilityChecker: React.FC = () => {
  const { theme } = useTheme();
  const { wallets, results, isChecking } = useWalletContext();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  
  const isDark = theme === 'dark';
  const eligibleCount = results.filter(r => r.isEligible).length;
  const totalChecked = results.length;

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className={`text-xl font-bold tracking-tighter font-mono ${
            isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
          }`}>
            {isDark ? '> ELIGIBILITY_CHECKER.exe' : 'ELIGIBILITY CHECKER'}
          </h2>
          <p className={`mt-1 font-mono text-sm ${
            isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
          }`}>
            {isDark 
              ? `root@alpha-tracker:~$ check --wallets [${wallets.length}] --eligible [${eligibleCount}]`
              : `Check airdrop eligibility across ${wallets.length} connected wallets`
            }
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowWalletModal(true)}
            className={`font-mono text-sm border-2 transition-all duration-200 ${
              isDark 
                ? 'bg-transparent border-[var(--alpha-signal)] text-[var(--alpha-signal)] hover:bg-[var(--alpha-signal)] hover:text-[var(--alpha-accent-contrast)]' 
                : 'bg-transparent border-[var(--alpha-signal)] text-[var(--alpha-signal)] hover:bg-[var(--alpha-signal)] hover:text-white'
            }`}
          >
            <Wallet className="h-4 w-4 mr-2" />
            {isDark ? '[CONNECT_WALLET]' : 'Connect Wallet'}
          </Button>
          
          <Button 
            onClick={() => setShowEligibilityModal(true)}
            disabled={wallets.length === 0 || isChecking}
            className={`font-mono text-sm border-2 transition-all duration-200 ${
              wallets.length === 0
                ? (isDark ? 'opacity-50 cursor-not-allowed' : 'opacity-50 cursor-not-allowed')
                : (isDark 
                    ? 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] border-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-press)] hover:shadow-[0_0_20px_var(--alpha-signal-glow)]' 
                    : 'bg-[var(--alpha-signal)] text-white border-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-press)]')
            }`}
          >
            {isChecking ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                {isDark ? 'CHECKING...' : 'Checking...'}
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                {isDark ? '[CHECK_ELIGIBLE]' : 'Check Eligible'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { 
            label: isDark ? 'CONNECTED_WALLETS' : 'Connected Wallets', 
            value: wallets.length, 
            icon: Wallet, 
            color: isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]',
            bg: isDark ? 'bg-[var(--alpha-signal-softest)] border-[var(--alpha-signal-border)]' : 'bg-[var(--alpha-signal-softest)] border-[var(--alpha-signal-border)]'
          },
          { 
            label: isDark ? 'TOTAL_CHECKED' : 'Total Checked', 
            value: totalChecked, 
            icon: Activity, 
            color: isDark ? 'text-[var(--alpha-violet)]' : 'text-[var(--alpha-violet)]',
            bg: isDark ? 'bg-[var(--alpha-violet-softest)] border-[var(--alpha-violet-border)]' : 'bg-[var(--alpha-violet-softest)] border-[var(--alpha-violet-border)]'
          },
          { 
            label: isDark ? 'ELIGIBLE' : 'Eligible', 
            value: eligibleCount, 
            icon: CheckCircle, 
            color: isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]',
            bg: isDark ? 'bg-[var(--alpha-signal-softest)] border-[var(--alpha-signal-border)]' : 'bg-[var(--alpha-signal-softest)] border-[var(--alpha-signal-border)]'
          },
          { 
            label: isDark ? 'NOT_ELIGIBLE' : 'Not Eligible', 
            value: totalChecked - eligibleCount, 
            icon: XCircle, 
            color: isDark ? 'text-[var(--alpha-danger)]' : 'text-[var(--alpha-danger)]',
            bg: isDark ? 'bg-[var(--alpha-danger-softest)] border-[var(--alpha-danger-border)]' : 'bg-[var(--alpha-danger-softest)] border-[var(--alpha-danger-border)]'
          },
        ].map((stat, idx) => (
          <Card key={idx} className={`border transition-all duration-300 ${
            isDark 
              ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] hover:border-[var(--alpha-signal-border)]' 
              : 'bg-white border-[var(--alpha-border)] hover:border-[var(--alpha-signal-border)]'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-mono mb-1 ${
                    isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                  }`}>{stat.label}</p>
                  <p className={`text-2xl font-bold font-mono ${stat.color}`}>
                    {String(stat.value).padStart(2, '0')}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded flex items-center justify-center border ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Results */}
      {results.length > 0 && (
        <Card className={`border ${
          isDark 
            ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)]' 
            : 'bg-white border-[var(--alpha-border)]'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-mono font-bold ${
                isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
              }`}>
                {isDark ? '> RECENT_CHECKS' : 'Recent Checks'}
              </h3>
              <Badge variant="outline" className={`font-mono text-xs ${
                isDark 
                  ? 'bg-[var(--alpha-signal-soft)] text-[var(--alpha-signal)] border-[var(--alpha-signal-border)]' 
                  : 'bg-[var(--alpha-signal-soft)] text-[var(--alpha-signal)] border-[var(--alpha-signal-border)]'
              }`}>
                {results.length} RESULTS
              </Badge>
            </div>
            
            <div className="space-y-2">
              {results.slice(0, 5).map((result, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-3 rounded border ${
                    result.isEligible
                      ? (isDark 
                          ? 'bg-[var(--alpha-signal-softest)] border-[var(--alpha-signal-border)]' 
                          : 'bg-[var(--alpha-signal-softest)] border-[var(--alpha-signal-border)]')
                      : (isDark 
                          ? 'bg-[var(--alpha-danger-softest)] border-[var(--alpha-danger-border)]' 
                          : 'bg-[var(--alpha-danger-softest)] border-[var(--alpha-danger-border)]')
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${
                      result.isEligible
                        ? (isDark ? 'bg-[var(--alpha-signal-strong)] text-[var(--alpha-signal)]' : 'bg-[var(--alpha-signal-strong)] text-[var(--alpha-signal)]')
                        : (isDark ? 'bg-[var(--alpha-danger-strong)] text-[var(--alpha-danger)]' : 'bg-[var(--alpha-danger-strong)] text-[var(--alpha-danger)]')
                    }`}>
                      {result.isEligible ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className={`font-mono text-sm font-bold ${
                        isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
                      }`}>
                        {result.wallet.slice(0, 6)}...{result.wallet.slice(-4)}
                      </p>
                      <p className={`font-mono text-xs ${
                        isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                      }`}>
                        Balance: {parseFloat(result.details.balance).toFixed(4)} | 
                        NFTs: {result.details.nftCount} | 
                        TXs: {result.details.txCount}
                      </p>
                    </div>
                  </div>
                  <Badge className={`font-mono text-xs ${
                    result.isEligible
                      ? (isDark ? 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)]' : 'bg-[var(--alpha-signal)] text-white')
                      : (isDark ? 'bg-[var(--alpha-danger)] text-white' : 'bg-[var(--alpha-danger)] text-white')
                  }`}>
                    {result.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {wallets.length === 0 && (
        <Card className={`border ${
          isDark 
            ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)]' 
            : 'bg-white border-[var(--alpha-border)]'
        }`}>
          <CardContent className="p-8 text-center">
            <Shield className={`h-12 w-12 mx-auto mb-4 ${
              isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
            }`} />
            <h3 className={`text-lg font-mono font-bold mb-2 ${
              isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
            }`}>
              {isDark ? '> NO_WALLETS_CONNECTED' : 'No Wallets Connected'}
            </h3>
            <p className={`font-mono text-sm mb-4 ${
              isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
            }`}>
              {isDark 
                ? 'Initialize wallet connection to check eligibility...'
                : 'Connect your wallet to start checking airdrop eligibility'}
            </p>
            <Button 
              onClick={() => setShowWalletModal(true)}
              className={`font-mono border-2 ${
                isDark 
                  ? 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] border-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-press)]' 
                  : 'bg-[var(--alpha-signal)] text-white border-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-press)]'
              }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isDark ? 'CONNECT_WALLET()' : 'Connect Wallet'}
            </Button>
          </CardContent>
        </Card>
      )}

      <WalletConnectModal 
        isOpen={showWalletModal} 
        onClose={() => setShowWalletModal(false)} 
      />
      <EligibilityModal 
        isOpen={showEligibilityModal} 
        onClose={() => setShowEligibilityModal(false)} 
      />
    </section>
  );
};