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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg border shadow-2xl flex flex-col ${
        isDark 
          ? 'bg-[#161B22] border-[#1F2937] shadow-[0_0_50px_rgba(0,255,136,0.1)]' 
          : 'bg-white border-[#E5E7EB] shadow-2xl'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b shrink-0 ${
          isDark ? 'border-[#1F2937]' : 'border-[#E5E7EB]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded flex items-center justify-center border ${
              isDark 
                ? 'bg-[#00FF88]/10 border-[#00FF88] text-[#00FF88]' 
                : 'bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]'
            }`}>
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`font-mono font-bold ${
                isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
              }`}>
                {isDark ? 'CHECK_ELIGIBILITY.exe' : 'Check Eligibility'}
              </h2>
              <p className={`font-mono text-xs ${
                isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
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
                ? 'text-[#6B7280] hover:bg-[#1F2937] hover:text-[#E5E7EB]' 
                : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b shrink-0 ${
          isDark ? 'border-[#1F2937]' : 'border-[#E5E7EB]'
        }`}>
          <button
            onClick={() => setActiveTab('criteria')}
            className={`flex-1 py-3 font-mono text-sm border-b-2 transition-colors ${
              activeTab === 'criteria'
                ? (isDark 
                    ? 'border-[#00FF88] text-[#00FF88]' 
                    : 'border-[#2563EB] text-[#2563EB]')
                : (isDark 
                    ? 'border-transparent text-[#6B7280] hover:text-[#E5E7EB]' 
                    : 'border-transparent text-[#6B7280] hover:text-[#111827]')
            }`}
          >
            {isDark ? 'SET_CRITERIA' : 'Set Criteria'}
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-3 font-mono text-sm border-b-2 transition-colors ${
              activeTab === 'results'
                ? (isDark 
                    ? 'border-[#00FF88] text-[#00FF88]' 
                    : 'border-[#2563EB] text-[#2563EB]')
                : (isDark 
                    ? 'border-transparent text-[#6B7280] hover:text-[#E5E7EB]' 
                    : 'border-transparent text-[#6B7280] hover:text-[#111827]')
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
                  ? 'bg-[#0B0F14] border-[#1F2937]' 
                  : 'bg-[#F3F4F6] border-[#E5E7EB]'
              }`}>
                <h3 className={`font-mono text-sm font-bold mb-3 flex items-center gap-2 ${
                  isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#00FF88]' : 'bg-[#2563EB]'}`} />
                  TOKEN REQUIREMENTS
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className={`block font-mono text-xs mb-1.5 ${
                      isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
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
                          ? 'bg-[#161B22] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#374151] focus:border-[#00FF88]' 
                          : 'bg-white border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block font-mono text-xs mb-1.5 ${
                      isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
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
                          ? 'bg-[#161B22] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#374151] focus:border-[#00FF88]' 
                          : 'bg-white border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* NFT Criteria */}
              <div className={`p-4 rounded-lg border ${
                isDark 
                  ? 'bg-[#0B0F14] border-[#1F2937]' 
                  : 'bg-[#F3F4F6] border-[#E5E7EB]'
              }`}>
                <h3 className={`font-mono text-sm font-bold mb-3 flex items-center gap-2 ${
                  isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#8B5CF6]' : 'bg-[#4F46E5]'}`} />
                  NFT REQUIREMENTS
                </h3>
                
                <div>
                  <label className={`block font-mono text-xs mb-1.5 ${
                    isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
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
                        ? 'bg-[#161B22] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#374151] focus:border-[#00FF88]' 
                        : 'bg-white border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                    }`}
                  />
                </div>
              </div>

              {/* Activity Criteria */}
              <div className={`p-4 rounded-lg border ${
                isDark 
                  ? 'bg-[#0B0F14] border-[#1F2937]' 
                  : 'bg-[#F3F4F6] border-[#E5E7EB]'
              }`}>
                <h3 className={`font-mono text-sm font-bold mb-3 flex items-center gap-2 ${
                  isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#F59E0B]' : 'bg-[#EA580C]'}`} />
                  ACTIVITY REQUIREMENTS
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block font-mono text-xs mb-1.5 ${
                      isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
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
                          ? 'bg-[#161B22] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#374151] focus:border-[#00FF88]' 
                          : 'bg-white border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block font-mono text-xs mb-1.5 ${
                      isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
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
                          ? 'bg-[#161B22] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#374151] focus:border-[#00FF88]' 
                          : 'bg-white border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Connected Wallets Summary */}
              <div className={`p-4 rounded-lg border ${
                isDark 
                  ? 'bg-[#00FF88]/5 border-[#00FF88]/20' 
                  : 'bg-[#2563EB]/5 border-[#2563EB]/20'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-mono text-sm font-bold ${
                    isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'
                  }`}>
                    CONNECTED WALLETS
                  </h3>
                  <Badge className={`font-mono text-xs ${
                    isDark 
                      ? 'bg-[#00FF88] text-[#0B0F14]' 
                      : 'bg-[#2563EB] text-white'
                  }`}>
                    {wallets.length}
                  </Badge>
                </div>
                
                {wallets.length === 0 ? (
                  <p className={`font-mono text-xs ${
                    isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
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
                          isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'
                        }`}
                      >
                        <Wallet className="w-3 h-3" />
                        <span className="truncate">
                          {wallet.label || `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          isDark 
                            ? 'bg-[#1F2937] text-[#6B7280]' 
                            : 'bg-white text-[#6B7280]'
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
                  isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                }`}>
                  <Activity className={`w-12 h-12 mx-auto mb-4 ${
                    isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'
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
                        ? 'bg-[#00FF88]/10 border-[#00FF88]/20' 
                        : 'bg-[#10B981]/10 border-[#10B981]/20'
                    }`}>
                      <p className={`text-2xl font-bold font-mono ${
                        isDark ? 'text-[#00FF88]' : 'text-[#10B981]'
                      }`}>
                        {results.filter(r => r.isEligible).length}
                      </p>
                      <p className={`font-mono text-xs ${
                        isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                      }`}>ELIGIBLE</p>
                    </div>
                    <div className={`p-3 rounded-lg border text-center ${
                      isDark 
                        ? 'bg-[#EF4444]/10 border-[#EF4444]/20' 
                        : 'bg-[#DC2626]/10 border-[#DC2626]/20'
                    }`}>
                      <p className={`text-2xl font-bold font-mono ${
                        isDark ? 'text-[#EF4444]' : 'text-[#DC2626]'
                      }`}>
                        {results.filter(r => !r.isEligible).length}
                      </p>
                      <p className={`font-mono text-xs ${
                        isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                      }`}>NOT ELIGIBLE</p>
                    </div>
                    <div className={`p-3 rounded-lg border text-center ${
                      isDark 
                        ? 'bg-[#3B82F6]/10 border-[#3B82F6]/20' 
                        : 'bg-[#2563EB]/10 border-[#2563EB]/20'
                    }`}>
                      <p className={`text-2xl font-bold font-mono ${
                        isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'
                      }`}>
                        {results.length}
                      </p>
                      <p className={`font-mono text-xs ${
                        isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
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
                                ? 'bg-[#00FF88]/5 border-[#00FF88]/30' 
                                : 'bg-[#10B981]/5 border-[#10B981]/30')
                            : (isDark 
                                ? 'bg-[#EF4444]/5 border-[#EF4444]/30' 
                                : 'bg-[#DC2626]/5 border-[#DC2626]/30')
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded flex items-center justify-center ${
                              result.isEligible
                                ? (isDark 
                                    ? 'bg-[#00FF88]/20 text-[#00FF88]' 
                                    : 'bg-[#10B981]/20 text-[#10B981]')
                                : (isDark 
                                    ? 'bg-[#EF4444]/20 text-[#EF4444]' 
                                    : 'bg-[#DC2626]/20 text-[#DC2626]')
                            }`}>
                              {result.isEligible ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className={`font-mono text-sm font-bold ${
                                isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                              }`}>
                                {result.wallet.slice(0, 6)}...{result.wallet.slice(-4)}
                              </p>
                              <Badge className={`mt-1 font-mono text-xs ${
                                result.isEligible
                                  ? (isDark ? 'bg-[#00FF88] text-[#0B0F14]' : 'bg-[#10B981] text-white')
                                  : (isDark ? 'bg-[#EF4444] text-white' : 'bg-[#DC2626] text-white')
                              }`}>
                                {result.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Check Details */}
                        <div className={`grid grid-cols-2 gap-2 text-xs font-mono ${
                          isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className={result.checks.tokenBalance ? (isDark ? 'text-[#00FF88]' : 'text-[#10B981]') : ''}>
                              {result.checks.tokenBalance ? '✓' : '✗'} Token Balance
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={result.checks.nftHoldings ? (isDark ? 'text-[#00FF88]' : 'text-[#10B981]') : ''}>
                              {result.checks.nftHoldings ? '✓' : '✗'} NFT Holdings
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={result.checks.transactionCount ? (isDark ? 'text-[#00FF88]' : 'text-[#10B981]') : ''}>
                              {result.checks.transactionCount ? '✓' : '✗'} Transactions
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={result.checks.protocolInteractions ? (isDark ? 'text-[#00FF88]' : 'text-[#10B981]') : ''}>
                              {result.checks.protocolInteractions ? '✓' : '✗'} Protocol Activity
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className={`mt-3 pt-3 border-t grid grid-cols-3 gap-2 text-center ${
                          isDark ? 'border-[#1F2937]' : 'border-[#E5E7EB]'
                        }`}>
                          <div>
                            <p className={`font-mono text-xs ${
                              isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                            }`}>BALANCE</p>
                            <p className={`font-mono text-sm font-bold ${
                              isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                            }`}>
                              {parseFloat(result.details.balance).toFixed(4)}
                            </p>
                          </div>
                          <div>
                            <p className={`font-mono text-xs ${
                              isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                            }`}>NFTs</p>
                            <p className={`font-mono text-sm font-bold ${
                              isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                            }`}>
                              {result.details.nftCount}
                            </p>
                          </div>
                          <div>
                            <p className={`font-mono text-xs ${
                              isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                            }`}>TX COUNT</p>
                            <p className={`font-mono text-sm font-bold ${
                              isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
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
          isDark ? 'border-[#1F2937]' : 'border-[#E5E7EB]'
        }`}>
          {activeTab === 'criteria' ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetCriteria}
                className={`flex-1 font-mono border-2 ${
                  isDark 
                    ? 'border-[#1F2937] text-[#6B7280] hover:bg-[#1F2937] hover:text-[#E5E7EB]' 
                    : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
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
                        ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]' 
                        : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90')
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
                  ? 'border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/10' 
                  : 'border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/10'
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