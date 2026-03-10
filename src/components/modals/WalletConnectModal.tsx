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
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />
      <div className={`relative z-10 w-full max-w-md rounded-lg border shadow-2xl ${
        isDark 
          ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] shadow-[0_0_50px_var(--alpha-signal-glow)]' 
          : 'bg-[var(--alpha-panel)] border-[var(--alpha-border)] shadow-[var(--alpha-shadow-strong)]'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? 'border-[var(--alpha-border)]' : 'border-[var(--alpha-border)]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded flex items-center justify-center border ${
              isDark 
                ? 'bg-[var(--alpha-signal-soft)] border-[var(--alpha-signal)] text-[var(--alpha-signal)]' 
                : 'bg-[var(--alpha-signal-soft)] border-[var(--alpha-signal)] text-[var(--alpha-signal)]'
            }`}>
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`font-mono font-bold ${
                isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
              }`}>
                {isDark ? 'CONNECT_WALLET.exe' : 'Connect Wallet'}
              </h2>
              <p className={`font-mono text-xs ${
                isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
              }`}>
                {isDark ? 'Initialize wallet connection...' : 'Add a new wallet to track'}
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

        <div className="p-4 space-y-4">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className={`block font-mono text-xs mb-1.5 ${
                isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
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
                    ? 'bg-[var(--alpha-surface-strong)] border-[var(--alpha-border)] text-[var(--alpha-text)] placeholder:text-[var(--alpha-text-muted)] focus:border-[var(--alpha-signal)]' 
                    : 'bg-[var(--alpha-surface-soft)] border-[var(--alpha-border)] text-[var(--alpha-text)] focus:border-[var(--alpha-signal)]'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block font-mono text-xs mb-1.5 ${
                  isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
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
                      ? 'bg-[var(--alpha-surface-strong)] border-[var(--alpha-border)] text-[var(--alpha-text)] placeholder:text-[var(--alpha-text-muted)] focus:border-[var(--alpha-signal)]' 
                      : 'bg-[var(--alpha-surface-soft)] border-[var(--alpha-border)] text-[var(--alpha-text)] focus:border-[var(--alpha-signal)]'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-mono text-xs mb-1.5 ${
                  isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                }`}>
                  CHAIN *
                </label>
                <select 
                  value={chain} 
                  onChange={(e) => setChain(e.target.value)}
                  className={`w-full h-10 px-3 rounded-md font-mono text-sm border ${
                    isDark 
                      ? 'bg-[var(--alpha-surface-strong)] border-[var(--alpha-border)] text-[var(--alpha-text)] focus:border-[var(--alpha-signal)]' 
                      : 'bg-[var(--alpha-surface-soft)] border-[var(--alpha-border)] text-[var(--alpha-text)] focus:border-[var(--alpha-signal)]'
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
                isDark ? 'text-[var(--alpha-danger)]' : 'text-[var(--alpha-danger)]'
              }`}>
                {error}
              </p>
            )}

            <Button 
              type="submit"
              className={`w-full font-mono border-2 ${
                isDark 
                  ? 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] border-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-press)] hover:shadow-[0_0_20px_var(--alpha-signal-glow)]' 
                  : 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] border-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-press)]'
              }`}
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isDark ? 'ADD_WALLET()' : 'Add Wallet'}
            </Button>
          </form>

          {/* Connected Wallets List */}
          {wallets.length > 0 && (
            <div className={`border-t pt-4 ${
              isDark ? 'border-[var(--alpha-border)]' : 'border-[var(--alpha-border)]'
            }`}>
              <h3 className={`font-mono text-xs mb-3 ${
                isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
              }`}>
                CONNECTED_WALLETS ({wallets.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {wallets.map((wallet) => (
                  <div 
                    key={wallet.address}
                    className={`flex items-center justify-between p-2 rounded border ${
                      isDark 
                        ? 'bg-[var(--alpha-surface-strong)] border-[var(--alpha-border)]' 
                        : 'bg-[var(--alpha-surface-soft)] border-[var(--alpha-border)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        wallet.chain === 'eth' ? 'bg-[#627eea]' :
                        wallet.chain === 'bsc' ? 'bg-[#f3ba2f]' :
                        wallet.chain === 'polygon' ? 'bg-[#8247e5]' :
                        'bg-[var(--alpha-signal)]'
                      }`} />
                      <span className={`font-mono text-sm truncate ${
                        isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
                      }`}>
                        {wallet.label || `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                      </span>
                      <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                        isDark 
                          ? 'bg-[var(--alpha-surface-strong)] text-[var(--alpha-text-muted)]' 
                          : 'bg-[var(--alpha-surface-soft)] text-[var(--alpha-text-muted)]'
                      }`}>
                        {wallet.chain.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => removeWallet(wallet.address)}
                      className={`p-1.5 rounded transition-colors ${
                        isDark 
                          ? 'text-[var(--alpha-danger)] hover:bg-[var(--alpha-danger-soft)]' 
                          : 'text-[var(--alpha-danger)] hover:bg-[var(--alpha-danger-soft)]'
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
