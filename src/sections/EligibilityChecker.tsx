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
  TrendingUp,
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
            isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
          }`}>
            {isDark ? '> ELIGIBILITY_CHECKER.exe' : 'ELIGIBILITY CHECKER'}
          </h2>
          <p className={`mt-1 font-mono text-sm ${
            isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
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
                ? 'bg-transparent border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-[#0B0F14]' 
                : 'bg-transparent border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white'
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
                    ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]' 
                    : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90')
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
            color: isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]',
            bg: isDark ? 'bg-[#3B82F6]/5 border-[#3B82F6]/20' : 'bg-[#2563EB]/5 border-[#2563EB]/20'
          },
          { 
            label: isDark ? 'TOTAL_CHECKED' : 'Total Checked', 
            value: totalChecked, 
            icon: Activity, 
            color: isDark ? 'text-[#8B5CF6]' : 'text-[#4F46E5]',
            bg: isDark ? 'bg-[#8B5CF6]/5 border-[#8B5CF6]/20' : 'bg-[#4F46E5]/5 border-[#4F46E5]/20'
          },
          { 
            label: isDark ? 'ELIGIBLE' : 'Eligible', 
            value: eligibleCount, 
            icon: CheckCircle, 
            color: isDark ? 'text-[#00FF88]' : 'text-[#10B981]',
            bg: isDark ? 'bg-[#00FF88]/5 border-[#00FF88]/20' : 'bg-[#10B981]/5 border-[#10B981]/20'
          },
          { 
            label: isDark ? 'NOT_ELIGIBLE' : 'Not Eligible', 
            value: totalChecked - eligibleCount, 
            icon: XCircle, 
            color: isDark ? 'text-[#EF4444]' : 'text-[#DC2626]',
            bg: isDark ? 'bg-[#EF4444]/5 border-[#EF4444]/20' : 'bg-[#DC2626]/5 border-[#DC2626]/20'
          },
        ].map((stat, idx) => (
          <Card key={idx} className={`border transition-all duration-300 ${
            isDark 
              ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/30' 
              : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/30'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-mono mb-1 ${
                    isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
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
            ? 'bg-[#161B22] border-[#1F2937]' 
            : 'bg-white border-[#E5E7EB]'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-mono font-bold ${
                isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
              }`}>
                {isDark ? '> RECENT_CHECKS' : 'Recent Checks'}
              </h3>
              <Badge variant="outline" className={`font-mono text-xs ${
                isDark 
                  ? 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/20' 
                  : 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20'
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
                          ? 'bg-[#00FF88]/5 border-[#00FF88]/20' 
                          : 'bg-[#10B981]/5 border-[#10B981]/20')
                      : (isDark 
                          ? 'bg-[#EF4444]/5 border-[#EF4444]/20' 
                          : 'bg-[#DC2626]/5 border-[#DC2626]/20')
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${
                      result.isEligible
                        ? (isDark ? 'bg-[#00FF88]/20 text-[#00FF88]' : 'bg-[#10B981]/20 text-[#10B981]')
                        : (isDark ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#DC2626]/20 text-[#DC2626]')
                    }`}>
                      {result.isEligible ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className={`font-mono text-sm font-bold ${
                        isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                      }`}>
                        {result.wallet.slice(0, 6)}...{result.wallet.slice(-4)}
                      </p>
                      <p className={`font-mono text-xs ${
                        isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                      }`}>
                        Balance: {parseFloat(result.details.balance).toFixed(4)} | 
                        NFTs: {result.details.nftCount} | 
                        TXs: {result.details.txCount}
                      </p>
                    </div>
                  </div>
                  <Badge className={`font-mono text-xs ${
                    result.isEligible
                      ? (isDark ? 'bg-[#00FF88] text-[#0B0F14]' : 'bg-[#10B981] text-white')
                      : (isDark ? 'bg-[#EF4444] text-white' : 'bg-[#DC2626] text-white')
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
            ? 'bg-[#161B22] border-[#1F2937]' 
            : 'bg-white border-[#E5E7EB]'
        }`}>
          <CardContent className="p-8 text-center">
            <Shield className={`h-12 w-12 mx-auto mb-4 ${
              isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'
            }`} />
            <h3 className={`text-lg font-mono font-bold mb-2 ${
              isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
            }`}>
              {isDark ? '> NO_WALLETS_CONNECTED' : 'No Wallets Connected'}
            </h3>
            <p className={`font-mono text-sm mb-4 ${
              isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
            }`}>
              {isDark 
                ? 'Initialize wallet connection to check eligibility...'
                : 'Connect your wallet to start checking airdrop eligibility'}
            </p>
            <Button 
              onClick={() => setShowWalletModal(true)}
              className={`font-mono border-2 ${
                isDark 
                  ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90' 
                  : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90'
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