// components/modals/WalletConnectModal.tsx
import React, { useState } from 'react';
import { useWalletContext } from '@/contexts/WalletContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Wallet, Trash2 } from 'lucide-react';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { wallets, addWallet, removeWallet } = useWalletContext();
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');
  const [chain, setChain] = useState('eth');
  const [error, setError] = useState('');

  const isDark = theme === 'dark';

  const validateAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateAddress(address)) {
      setError(isDark ? '> ERROR: Invalid wallet address format' : 'Invalid wallet address format');
      return;
    }

    if (wallets.find(w => w.address.toLowerCase() === address.toLowerCase())) {
      setError(isDark ? '> ERROR: Wallet already connected' : 'Wallet already connected');
      return;
    }

    addWallet({
      address,
      chain,
      label: label || undefined
    });
    
    setAddress('');
    setLabel('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative z-10 w-full max-w-md rounded-lg border shadow-2xl ${
        isDark 
          ? 'bg-[#161B22] border-[#1F2937] shadow-[0_0_50px_rgba(0,255,136,0.1)]' 
          : 'bg-white border-[#E5E7EB] shadow-2xl'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? 'border-[#1F2937]' : 'border-[#E5E7EB]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded flex items-center justify-center border ${
              isDark 
                ? 'bg-[#00FF88]/10 border-[#00FF88] text-[#00FF88]' 
                : 'bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]'
            }`}>
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`font-mono font-bold ${
                isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
              }`}>
                {isDark ? 'CONNECT_WALLET.exe' : 'Connect Wallet'}
              </h2>
              <p className={`font-mono text-xs ${
                isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
              }`}>
                {isDark ? 'Initialize wallet connection...' : 'Add a new wallet to track'}
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

        <div className="p-4 space-y-4">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className={`block font-mono text-xs mb-1.5 ${
                isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
              }`}>
                WALLET ADDRESS *
              </label>
              <Input
                type="text"
                placeholder="0x..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`font-mono text-sm border ${
                  isDark 
                    ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#374151] focus:border-[#00FF88]' 
                    : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block font-mono text-xs mb-1.5 ${
                  isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                }`}>
                  LABEL (OPTIONAL)
                </label>
                <Input
                  type="text"
                  placeholder="Main Wallet"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className={`font-mono text-sm border ${
                    isDark 
                      ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#374151] focus:border-[#00FF88]' 
                      : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-mono text-xs mb-1.5 ${
                  isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                }`}>
                  CHAIN *
                </label>
                <select 
                  value={chain} 
                  onChange={(e) => setChain(e.target.value)}
                  className={`w-full h-10 px-3 rounded-md font-mono text-sm border ${
                    isDark 
                      ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                      : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                  }`}
                >
                  <option value="eth">Ethereum</option>
                  <option value="bsc">BSC</option>
                  <option value="polygon">Polygon</option>
                  <option value="arbitrum">Arbitrum</option>
                  <option value="optimism">Optimism</option>
                </select>
              </div>
            </div>

            {error && (
              <p className={`font-mono text-xs ${
                isDark ? 'text-[#EF4444]' : 'text-[#DC2626]'
              }`}>
                {error}
              </p>
            )}

            <Button 
              type="submit"
              className={`w-full font-mono border-2 ${
                isDark 
                  ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]' 
                  : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90'
              }`}
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isDark ? 'ADD_WALLET()' : 'Add Wallet'}
            </Button>
          </form>

          {/* Connected Wallets List */}
          {wallets.length > 0 && (
            <div className={`border-t pt-4 ${
              isDark ? 'border-[#1F2937]' : 'border-[#E5E7EB]'
            }`}>
              <h3 className={`font-mono text-xs mb-3 ${
                isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
              }`}>
                CONNECTED_WALLETS ({wallets.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {wallets.map((wallet) => (
                  <div 
                    key={wallet.address}
                    className={`flex items-center justify-between p-2 rounded border ${
                      isDark 
                        ? 'bg-[#0B0F14] border-[#1F2937]' 
                        : 'bg-[#F3F4F6] border-[#E5E7EB]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        wallet.chain === 'eth' ? 'bg-[#627eea]' :
                        wallet.chain === 'bsc' ? 'bg-[#f3ba2f]' :
                        wallet.chain === 'polygon' ? 'bg-[#8247e5]' :
                        'bg-[#00FF88]'
                      }`} />
                      <span className={`font-mono text-sm truncate ${
                        isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                      }`}>
                        {wallet.label || `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                      </span>
                      <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                        isDark 
                          ? 'bg-[#1F2937] text-[#6B7280]' 
                          : 'bg-white text-[#6B7280]'
                      }`}>
                        {wallet.chain.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => removeWallet(wallet.address)}
                      className={`p-1.5 rounded transition-colors ${
                        isDark 
                          ? 'text-[#EF4444] hover:bg-[#EF4444]/10' 
                          : 'text-[#DC2626] hover:bg-[#DC2626]/10'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};