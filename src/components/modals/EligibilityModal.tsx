// components/modals/EligibilityModal.tsx
import React, { useState } from 'react';
import { useWalletContext } from '@/contexts/WalletContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Search, CheckCircle, XCircle, Activity, Wallet, Loader2 } from 'lucide-react';
import type { EligibilityCriteria } from '@/services/eligibility';

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { wallets, checkEligibility, isChecking, results } = useWalletContext();
  
  const [criteria, setCriteria] = useState<EligibilityCriteria>({
    minTokenBalance: 0,
    tokenContract: '',
    requiredNFT: '',
    minTransactions: 0,
    snapshotBlock: undefined
  });

  const [activeTab, setActiveTab] = useState<'criteria' | 'results'>('criteria');

  const isDark = theme === 'dark';

  const handleCheck = async () => {
    if (wallets.length === 0) return;
    await checkEligibility(criteria);
    setActiveTab('results');
  };

  const resetCriteria = () => {
    setCriteria({
      minTokenBalance: 0,
      tokenContract: '',
      requiredNFT: '',
      minTransactions: 0,
      snapshotBlock: undefined
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />
      <div className={`relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg border shadow-2xl flex flex-col ${
        isDark 
          ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] shadow-[0_0_50px_var(--alpha-signal-glow)]' 
          : 'bg-[var(--alpha-panel)] border-[var(--alpha-border)] shadow-[var(--alpha-shadow-strong)]'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b shrink-0 ${
          isDark ? 'border-[var(--alpha-border)]' : 'border-[var(--alpha-border)]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded flex items-center justify-center border ${
              isDark 
                ? 'bg-[var(--alpha-signal-soft)] border-[var(--alpha-signal)] text-[var(--alpha-signal)]' 
                : 'bg-[var(--alpha-signal-soft)] border-[var(--alpha-signal)] text-[var(--alpha-signal)]'
            }`}>
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`font-mono font-bold ${
                isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
              }`}>
                {isDark ? 'CHECK_ELIGIBILITY.exe' : 'Check Eligibility'}
              </h2>
              <p className={`font-mono text-xs ${
                isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
              }`}>
                {isDark 
                  ? `Scanning ${wallets.length} wallet(s) for airdrop criteria...`
                  : `Check ${wallets.length} connected wallet(s) for eligibility`}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded transition-colors ${
              isDark 
                ? 'text-[var(--alpha-text-muted)] hover:bg-[var(--alpha-hover-soft)] hover:text-[var(--alpha-text)]' 
                : 'text-[var(--alpha-text-muted)] hover:bg-[var(--alpha-hover-soft)] hover:text-[var(--alpha-text)]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b shrink-0 ${
          isDark ? 'border-[var(--alpha-border)]' : 'border-[var(--alpha-border)]'
        }`}>
          <button
            onClick={() => setActiveTab('criteria')}
            className={`flex-1 py-3 font-mono text-sm border-b-2 transition-colors ${
              activeTab === 'criteria'
                ? (isDark 
                    ? 'border-[var(--alpha-signal)] text-[var(--alpha-signal)]' 
                    : 'border-[var(--alpha-signal)] text-[var(--alpha-signal)]')
                : (isDark 
                    ? 'border-transparent text-[var(--alpha-text-muted)] hover:text-[var(--alpha-text)]' 
                    : 'border-transparent text-[var(--alpha-text-muted)] hover:text-[var(--alpha-text)]')
            }`}
          >
            {isDark ? 'SET_CRITERIA' : 'Set Criteria'}
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-3 font-mono text-sm border-b-2 transition-colors ${
              activeTab === 'results'
                ? (isDark 
                    ? 'border-[var(--alpha-signal)] text-[var(--alpha-signal)]' 
                    : 'border-[var(--alpha-signal)] text-[var(--alpha-signal)]')
                : (isDark 
                    ? 'border-transparent text-[var(--alpha-text-muted)] hover:text-[var(--alpha-text)]' 
                    : 'border-transparent text-[var(--alpha-text-muted)] hover:text-[var(--alpha-text)]')
            }`}
          >
            {isDark ? `RESULTS[${results.length}]` : `Results (${results.length})`}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'criteria' ? (
            <div className="space-y-4">
              {/* Token Criteria */}
              <div className={`p-4 rounded-lg border ${
                isDark 
                  ? 'bg-[var(--alpha-surface-strong)] border-[var(--alpha-border)]' 
                  : 'bg-[var(--alpha-surface-soft)] border-[var(--alpha-border)]'
              }`}>
                <h3 className={`font-mono text-sm font-bold mb-3 flex items-center gap-2 ${
                  isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-[var(--alpha-signal)]' : 'bg-[var(--alpha-signal)]'}`} />
                  TOKEN REQUIREMENTS
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className={`block font-mono text-xs mb-1.5 ${
                      isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                    }`}>
                      TOKEN CONTRACT ADDRESS
                    </label>
                    <Input
                      type="text"
                      placeholder="0x..."
                      value={criteria.tokenContract}
                      onChange={(e) => setCriteria({...criteria, tokenContract: e.target.value})}
                      className={`font-mono text-sm border ${
                        isDark 
                          ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] text-[var(--alpha-text)] placeholder:text-[var(--alpha-text-muted)] focus:border-[var(--alpha-signal)]' 
                          : 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] text-[var(--alpha-text)] placeholder:text-[var(--alpha-text-muted)] focus:border-[var(--alpha-signal)]'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block font-mono text-xs mb-1.5 ${
                      isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                    }`}>
                      MINIMUM BALANCE REQUIRED
                    </label>
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={criteria.minTokenBalance || ''}
                      onChange={(e) => setCriteria({...criteria, minTokenBalance: parseFloat(e.target.value) || 0})}
                      className={`font-mono text-sm border ${
                        isDark 
                          ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] text-[var(--alpha-text)] placeholder:text-[var(--alpha-text-muted)] focus:border-[var(--alpha-signal)]' 
                          : 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] text-[var(--alpha-text)] placeholder:text-[var(--alpha-text-muted)] focus:border-[var(--alpha-signal)]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* NFT Criteria */}
              <div className={`p-4 rounded-lg border ${
                isDark 
                  ? 'bg-[var(--alpha-surface-strong)] border-[var(--alpha-border)]' 
                  : 'bg-[var(--alpha-surface-soft)] border-[var(--alpha-border)]'
              }`}>
                <h3 className={`font-mono text-sm font-bold mb-3 flex items-center gap-2 ${
                  isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-[var(--alpha-violet)]' : 'bg-[var(--alpha-violet)]'}`} />
                  NFT REQUIREMENTS
                </h3>
                
                <div>
                  <label className={`block font-mono text-xs mb-1.5 ${
                    isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                  }`}>
                    REQUIRED NFT CONTRACT (OPTIONAL)
                  </label>
                  <Input
                    type="text"
                    placeholder="0x..."
                    value={criteria.requiredNFT}
                    onChange={(e) => setCriteria({...criteria, requiredNFT: e.target.value})}
                    className={`font-mono text-sm border ${
                        isDark 
                          ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] text-[var(--alpha-text)] placeholder:text-[var(--alpha-text-muted)] focus:border-[var(--alpha-signal)]' 
                        : 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] text-[var(--alpha-text)] placeholder:text-[var(--alpha-text-muted)] focus:border-[var(--alpha-signal)]'
                    }`}
                  />
                </div>
              </div>

              {/* Activity Criteria */}
              <div className={`p-4 rounded-lg border ${
                isDark 
                  ? 'bg-[var(--alpha-surface-strong)] border-[var(--alpha-border)]' 
                  : 'bg-[var(--alpha-surface-soft)] border-[var(--alpha-border)]'
              }`}>
                <h3 className={`font-mono text-sm font-bold mb-3 flex items-center gap-2 ${
                  isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-[var(--alpha-warning)]' : 'bg-[var(--alpha-warning)]'}`} />
                  ACTIVITY REQUIREMENTS
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block font-mono text-xs mb-1.5 ${
                      isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                    }`}>
                      MIN TRANSACTIONS
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={criteria.minTransactions || ''}
                      onChange={(e) => setCriteria({...criteria, minTransactions: parseInt(e.target.value) || 0})}
                      className={`font-mono text-sm border ${
                        isDark 
                          ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] text-[var(--alpha-text)] placeholder:text-[var(--alpha-text-muted)] focus:border-[var(--alpha-signal)]' 
                          : 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] text-[var(--alpha-text)] placeholder:text-[var(--alpha-text-muted)] focus:border-[var(--alpha-signal)]'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block font-mono text-xs mb-1.5 ${
                      isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                    }`}>
                      SNAPSHOT BLOCK (OPTIONAL)
                    </label>
                    <Input
                      type="number"
                      placeholder="Block number"
                      value={criteria.snapshotBlock || ''}
                      onChange={(e) => setCriteria({...criteria, snapshotBlock: parseInt(e.target.value) || undefined})}
                      className={`font-mono text-sm border ${
                        isDark 
                          ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] text-[var(--alpha-text)] placeholder:text-[var(--alpha-text-muted)] focus:border-[var(--alpha-signal)]' 
                          : 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] text-[var(--alpha-text)] placeholder:text-[var(--alpha-text-muted)] focus:border-[var(--alpha-signal)]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Connected Wallets Summary */}
              <div className={`p-4 rounded-lg border ${
                isDark 
                  ? 'bg-[var(--alpha-signal-softest)] border-[var(--alpha-signal-border)]' 
                  : 'bg-[var(--alpha-signal-softest)] border-[var(--alpha-signal-border)]'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-mono text-sm font-bold ${
                    isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]'
                  }`}>
                    CONNECTED WALLETS
                  </h3>
                  <Badge className={`font-mono text-xs ${
                    isDark 
                      ? 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)]' 
                      : 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)]'
                  }`}>
                    {wallets.length}
                  </Badge>
                </div>
                
                {wallets.length === 0 ? (
                  <p className={`font-mono text-xs ${
                    isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                  }`}>
                    {isDark 
                      ? '> WARNING: No wallets connected. Connect wallet first.'
                      : 'No wallets connected. Please connect a wallet first.'}
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-24 overflow-y-auto">
                    {wallets.map((wallet, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center gap-2 font-mono text-xs ${
                          isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text-muted)]'
                        }`}
                      >
                        <Wallet className="w-3 h-3" />
                        <span className="truncate">
                          {wallet.label || `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          isDark 
                            ? 'bg-[var(--alpha-surface-strong)] text-[var(--alpha-text-muted)]' 
                            : 'bg-[var(--alpha-surface-soft)] text-[var(--alpha-text-muted)]'
                        }`}>
                          {wallet.chain.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.length === 0 ? (
                <div className={`text-center py-12 ${
                  isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                }`}>
                  <Activity className={`w-12 h-12 mx-auto mb-4 ${
                    isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
                  }`} />
                  <p className="font-mono text-sm">
                    {isDark 
                      ? '> NO_RESULTS: Run eligibility check first.'
                      : 'No results yet. Run a check to see results.'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Summary */}
                  <div className={`grid grid-cols-3 gap-3 mb-4`}>
                    <div className={`p-3 rounded-lg border text-center ${
                      isDark 
                        ? 'bg-[var(--alpha-signal-soft)] border-[var(--alpha-signal-border)]' 
                        : 'bg-[var(--alpha-signal-soft)] border-[var(--alpha-signal-border)]'
                    }`}>
                      <p className={`text-2xl font-bold font-mono ${
                        isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]'
                      }`}>
                        {results.filter(r => r.isEligible).length}
                      </p>
                      <p className={`font-mono text-xs ${
                        isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                      }`}>ELIGIBLE</p>
                    </div>
                    <div className={`p-3 rounded-lg border text-center ${
                      isDark 
                        ? 'bg-[var(--alpha-danger-soft)] border-[var(--alpha-danger-border)]' 
                        : 'bg-[var(--alpha-danger-soft)] border-[var(--alpha-danger-border)]'
                    }`}>
                      <p className={`text-2xl font-bold font-mono ${
                        isDark ? 'text-[var(--alpha-danger)]' : 'text-[var(--alpha-danger)]'
                      }`}>
                        {results.filter(r => !r.isEligible).length}
                      </p>
                      <p className={`font-mono text-xs ${
                        isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                      }`}>NOT ELIGIBLE</p>
                    </div>
                    <div className={`p-3 rounded-lg border text-center ${
                      isDark 
                        ? 'bg-[var(--alpha-signal-soft)] border-[var(--alpha-signal-border)]' 
                        : 'bg-[var(--alpha-signal-soft)] border-[var(--alpha-signal-border)]'
                    }`}>
                      <p className={`text-2xl font-bold font-mono ${
                        isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]'
                      }`}>
                        {results.length}
                      </p>
                      <p className={`font-mono text-xs ${
                        isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                      }`}>TOTAL CHECKED</p>
                    </div>
                  </div>

                  {/* Detailed Results */}
                  <div className="space-y-2">
                    {results.map((result, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 rounded-lg border ${
                          result.isEligible
                            ? (isDark 
                                ? 'bg-[var(--alpha-signal-softest)] border-[var(--alpha-signal-border)]' 
                                : 'bg-[var(--alpha-signal-softest)] border-[var(--alpha-signal-border)]')
                            : (isDark 
                                ? 'bg-[var(--alpha-danger-softest)] border-[var(--alpha-danger-border)]' 
                                : 'bg-[var(--alpha-danger-softest)] border-[var(--alpha-danger-border)]')
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded flex items-center justify-center ${
                              result.isEligible
                                ? (isDark 
                                    ? 'bg-[var(--alpha-signal-strong)] text-[var(--alpha-signal)]' 
                                    : 'bg-[var(--alpha-signal-strong)] text-[var(--alpha-signal)]')
                                : (isDark 
                                    ? 'bg-[var(--alpha-danger-strong)] text-[var(--alpha-danger)]' 
                                    : 'bg-[var(--alpha-danger-strong)] text-[var(--alpha-danger)]')
                            }`}>
                              {result.isEligible ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className={`font-mono text-sm font-bold ${
                                isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
                              }`}>
                                {result.wallet.slice(0, 6)}...{result.wallet.slice(-4)}
                              </p>
                              <Badge className={`mt-1 font-mono text-xs ${
                                result.isEligible
                                  ? 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)]'
                                  : 'bg-[var(--alpha-danger)] text-[var(--alpha-accent-contrast)]'
                              }`}>
                                {result.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Check Details */}
                        <div className={`grid grid-cols-2 gap-2 text-xs font-mono ${
                          isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className={result.checks.tokenBalance ? (isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]') : ''}>
                              {result.checks.tokenBalance ? '✓' : '✗'} Token Balance
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={result.checks.nftHoldings ? (isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]') : ''}>
                              {result.checks.nftHoldings ? '✓' : '✗'} NFT Holdings
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={result.checks.transactionCount ? (isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]') : ''}>
                              {result.checks.transactionCount ? '✓' : '✗'} Transactions
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={result.checks.protocolInteractions ? (isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]') : ''}>
                              {result.checks.protocolInteractions ? '✓' : '✗'} Protocol Activity
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className={`mt-3 pt-3 border-t grid grid-cols-3 gap-2 text-center ${
                          isDark ? 'border-[var(--alpha-border)]' : 'border-[var(--alpha-border)]'
                        }`}>
                          <div>
                            <p className={`font-mono text-xs ${
                              isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                            }`}>BALANCE</p>
                            <p className={`font-mono text-sm font-bold ${
                              isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
                            }`}>
                              {parseFloat(result.details.balance).toFixed(4)}
                            </p>
                          </div>
                          <div>
                            <p className={`font-mono text-xs ${
                              isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                            }`}>NFTs</p>
                            <p className={`font-mono text-sm font-bold ${
                              isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
                            }`}>
                              {result.details.nftCount}
                            </p>
                          </div>
                          <div>
                            <p className={`font-mono text-xs ${
                              isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                            }`}>TX COUNT</p>
                            <p className={`font-mono text-sm font-bold ${
                              isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
                            }`}>
                              {result.details.txCount}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t shrink-0 ${
          isDark ? 'border-[var(--alpha-border)]' : 'border-[var(--alpha-border)]'
        }`}>
          {activeTab === 'criteria' ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetCriteria}
                className={`flex-1 font-mono border-2 ${
                  isDark 
                    ? 'border-[var(--alpha-border)] text-[var(--alpha-text-muted)] hover:bg-[var(--alpha-hover-soft)] hover:text-[var(--alpha-text)]' 
                    : 'border-[var(--alpha-border)] text-[var(--alpha-text-muted)] hover:bg-[var(--alpha-hover-soft)] hover:text-[var(--alpha-text)]'
                }`}
              >
                RESET
              </Button>
              <Button
                onClick={handleCheck}
                disabled={wallets.length === 0 || isChecking}
                className={`flex-1 font-mono border-2 ${
                  wallets.length === 0 || isChecking
                    ? 'opacity-50 cursor-not-allowed'
                    : (isDark 
                        ? 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] border-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-press)] hover:shadow-[0_0_20px_var(--alpha-signal-glow)]' 
                        : 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] border-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-press)]')
                }`}
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isDark ? 'SCANNING...' : 'Scanning...'}
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    {isDark ? 'RUN_CHECK()' : 'Run Check'}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setActiveTab('criteria')}
              variant="outline"
              className={`w-full font-mono border-2 ${
                isDark 
                  ? 'border-[var(--alpha-signal)] text-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-soft)]' 
                  : 'border-[var(--alpha-signal)] text-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-soft)]'
              }`}
            >
              ← BACK TO CRITERIA
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
