import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useWalletContext } from "@/contexts/WalletContext";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  ExternalLink,
  Twitter,
  LayoutGrid,
  List,
  Layers,
  TrendingUp,
  CheckCircle,
  XCircle,
  Wallet,
  
  TrendingUp as TrendingUpIcon,
  DollarSign,
} from "lucide-react";
import { AirdropModal } from "@/components/modals/AirdropModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { WalletConnectModal } from "@/components/modals/WalletConnectModal";
import { EligibilityModal } from "@/components/modals/EligibilityModal";
import { usePrices } from "@/hooks/use-prices";
import type { Airdrop, AirdropType, AirdropStatus } from "@/types";
import {
  createAirdrop,
  getAirdropsByUserId,
} from "@/services/database";

const AIRDROP_TYPES: AirdropType[] = [
  'Testnet', 'AI', 'Quest', 'Daily', 'Daily Quest', 
  'Retro', 'Waitlist', 'Depin', 'NFT', 'Domain Name', 
  'Deploy SC', 'DeFi', 'Deploy NFT'
];

const AIRDROP_STATUSES: AirdropStatus[] = ['Planning', 'Ongoing', 'Done', 'Dropped'];

const TYPE_COLORS: Record<string, { dark: string; light: string }> = {
  'Testnet': { 
    dark: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20',
    light: 'bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/30'
  },
  'AI': { 
    dark: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
    light: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30'
  },
  'Quest': { 
    dark: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    light: 'bg-[#EA580C]/10 text-[#EA580C] border-[#EA580C]/30'
  },
  'Daily': { 
    dark: 'bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]/20',
    light: 'bg-[#DB2777]/10 text-[#DB2777] border-[#DB2777]/30'
  },
  'Daily Quest': { 
    dark: 'bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]/20',
    light: 'bg-[#DB2777]/10 text-[#DB2777] border-[#DB2777]/30'
  },
  'Retro': { 
    dark: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20',
    light: 'bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/30'
  },
  'Waitlist': { 
    dark: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
    light: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30'
  },
  'Depin': { 
    dark: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
    light: 'bg-[#059669]/10 text-[#059669] border-[#059669]/30'
  },
  'NFT': { 
    dark: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    light: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30'
  },
  'Domain Name': { 
    dark: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    light: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30'
  },
  'Deploy SC': { 
    dark: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    light: 'bg-[#EA580C]/10 text-[#EA580C] border-[#EA580C]/30'
  },
  'DeFi': { 
    dark: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    light: 'bg-[#EA580C]/10 text-[#EA580C] border-[#EA580C]/30'
  },
  'Deploy NFT': { 
    dark: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    light: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30'
  },
};

const STATUS_COLORS: Record<string, { dark: string; light: string }> = {
  'Planning': { 
    dark: 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20',
    light: 'bg-[#374151]/10 text-[#374151] border-[#374151]/30'
  },
  'Ongoing': { 
    dark: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
    light: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30'
  },
  'Done': { 
    dark: 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/20',
    light: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
  },
  'Dropped': { 
    dark: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    light: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30'
  },
};

// Digital Clock Component

const formatWallet = (address: string) => {
  if (!address) return '';
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// PRICE TRACKER COMPONENT
function PriceTracker({ isDark }: { isDark: boolean }) {
  const [showPrices, setShowPrices] = useState(false);
  const { prices, loading } = usePrices(['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot']);
  
  const coins = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { id: 'solana', symbol: 'SOL', name: 'Solana' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' }
  ];

  if (!showPrices) {
    return (
      <Button
        onClick={() => setShowPrices(true)}
        className={`font-mono text-xs border transition-all duration-300 hover:scale-105 ${
          isDark 
            ? 'bg-[#161B22] border-[#1F2937] text-[#00FF88] hover:bg-[#00FF88]/10 hover:border-[#00FF88]/50' 
            : 'bg-white border-[#E5E7EB] text-[#2563EB] hover:bg-[#2563EB]/10 hover:border-[#2563EB]/50'
        }`}
      >
        <DollarSign className="w-4 h-4 mr-2" />
        SHOW_PRICES
      </Button>
    );
  }

  return (
    <Card className={`border transition-all duration-300 ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-mono text-sm font-bold flex items-center gap-2 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
            <TrendingUpIcon className="w-4 h-4 text-[#00FF88]" />
            LIVE_PRICES
          </h3>
          <button 
            onClick={() => setShowPrices(false)} 
            className={`text-xs font-mono transition-colors ${isDark ? 'text-[#6B7280] hover:text-[#E5E7EB]' : 'text-[#6B7280] hover:text-[#111827]'}`}
          >
            [HIDE]
          </button>
        </div>
        
        {loading ? (
          <div className={`text-center py-4 font-mono text-xs ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>LOADING...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {coins.map((coin) => {
              const price = prices[coin.id];
              return (
                <div 
                  key={coin.id} 
                  className={`p-2 rounded border text-center transition-all duration-300 hover:scale-105 ${
                    isDark 
                      ? 'bg-[#0B0F14] border-[#1F2937] hover:border-[#00FF88]/30' 
                      : 'bg-[#F3F4F6] border-[#E5E7EB] hover:border-[#2563EB]/30'
                  }`}
                >
                  <p className={`font-mono text-xs font-bold ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>{coin.symbol}</p>
                  <p className={`font-mono text-sm ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>
                    ${price?.usd ? price.usd.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '-'}
                  </p>
                  {price?.usd_24h_change && (
                    <p className={`font-mono text-xs ${price.usd_24h_change >= 0 ? (isDark ? 'text-[#00FF88]' : 'text-[#10B981]') : (isDark ? 'text-[#EF4444]' : 'text-[#DC2626]')}`}>
                      {price.usd_24h_change >= 0 ? '+' : ''}{price.usd_24h_change.toFixed(2)}%
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// MODAL WRAPPER COMPONENT
interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  isDark: boolean;
}

let openModalCount = 0;

function ModalWrapper({ isOpen, onClose, children, maxWidth = 'max-w-2xl', isDark }: ModalWrapperProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    openModalCount++;
    if (openModalCount === 1) {
      document.body.style.overflow = 'hidden';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      openModalCount--;
      if (openModalCount <= 0) {
        openModalCount = 0;
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-black/40'}`} />
      <div 
        className={`relative w-full ${maxWidth} my-auto transform transition-transform duration-200 ${
          isClosing ? 'scale-95' : 'scale-100'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

// TABLE ROW COMPONENT - With Logo
interface TableRowProps {
  airdrop: Airdrop;
  index: number;
  isDark: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAddPriority: () => void;
  logoError: Record<string, boolean>;
  setLogoError: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

function TableRow({ airdrop, index, isDark, onEdit, onDelete, onAddPriority, logoError, setLogoError }: TableRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  const getTypeColor = (type: string) => isDark 
    ? TYPE_COLORS[type]?.dark || TYPE_COLORS['Quest'].dark 
    : TYPE_COLORS[type]?.light || TYPE_COLORS['Quest'].light;
    
  const getStatusColor = (status: string) => isDark 
    ? STATUS_COLORS[status]?.dark || STATUS_COLORS['Planning'].dark 
    : STATUS_COLORS[status]?.light || STATUS_COLORS['Planning'].light;

  const handleLogoError = () => setLogoError(prev => ({ ...prev, [airdrop.id]: true }));
  const hasLogoError = logoError[airdrop.id] || !airdrop.projectLogo;

  return (
    <tr className={`border-b transition-all duration-200 group ${
      isDark 
        ? 'border-[#1F2937] hover:bg-[#161B22]' 
        : 'border-[#E5E7EB] hover:bg-[#F9FAFB]'
    }`}>
      {/* No */}
      <td className="px-4 py-4">
        <span className={`font-mono text-sm ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
          {index + 1}
        </span>
      </td>
      
      {/* Name with Logo */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Logo Container */}
          <div className={`w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden border flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
            isDark 
              ? 'bg-[#0B0F14] border-[#1F2937]' 
              : 'bg-[#F3F4F6] border-[#E5E7EB]'
          }`}>
            {hasLogoError ? (
              <span className={`text-lg font-bold ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>
                {airdrop.projectName[0].toUpperCase()}
              </span>
            ) : (
              <img 
                src={airdrop.projectLogo} 
                alt={airdrop.projectName} 
                className="w-full h-full object-cover"
                onError={handleLogoError}
              />
            )}
          </div>
          <div>
            <p className={`font-mono font-medium ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
              {airdrop.projectName}
            </p>
            {airdrop.twitterUsername && (
              <p className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                @{airdrop.twitterUsername}
              </p>
            )}
          </div>
        </div>
      </td>
      
      {/* Type */}
      <td className="px-4 py-4">
        <Badge 
          variant="outline" 
          className={`font-mono text-xs transition-all duration-200 ${getTypeColor(airdrop.type)}`}
        >
          {airdrop.type}
        </Badge>
      </td>
      
      {/* Wallet Address */}
      <td className="px-4 py-4">
        {airdrop.walletAddress ? (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border w-fit transition-all duration-200 group-hover:border-opacity-50 ${
            isDark 
              ? 'bg-[#00FF88]/5 border-[#00FF88]/20 text-[#00FF88]' 
              : 'bg-[#2563EB]/5 border-[#2563EB]/20 text-[#2563EB]'
          }`}>
            <Wallet className="w-3.5 h-3.5" />
            <span className="font-mono text-xs">{formatWallet(airdrop.walletAddress)}</span>
          </div>
        ) : (
          <span className={`font-mono text-xs px-3 py-1.5 rounded-lg border ${
            isDark 
              ? 'bg-[#1F2937]/30 border-[#1F2937] text-[#6B7280]' 
              : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#9CA3AF]'
          }`}>
            No address
          </span>
        )}
      </td>
      
      {/* Official Link */}
      <td className="px-4 py-4">
        {airdrop.platformLink ? (
          <a 
            href={airdrop.platformLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 font-mono text-xs transition-all duration-200 hover:underline ${
              isDark 
                ? 'text-[#3B82F6] hover:text-[#00FF88]' 
                : 'text-[#2563EB] hover:text-[#10B981]'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {airdrop.platformLink.slice(0, 25)}...
          </a>
        ) : (
          <span className={`font-mono text-xs ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
            -
          </span>
        )}
      </td>
      
      {/* Status */}
      <td className="px-4 py-4">
        <Badge 
          variant="outline" 
          className={`font-mono text-xs ${getStatusColor(airdrop.status)}`}
        >
          {airdrop.status}
        </Badge>
      </td>
      
      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddPriority}
            className={`font-mono text-xs border transition-all duration-200 hover:scale-105 ${
              isDark 
                ? 'border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10 hover:text-[#00FF88] hover:border-[#00FF88]/50' 
                : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10 hover:text-[#2563EB] hover:border-[#2563EB]/50'
            }`}
          >
            Add Priority
          </Button>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className={`w-8 h-8 transition-all duration-200 ${
                isDark 
                  ? 'text-[#6B7280] hover:text-[#00FF88] hover:bg-[#00FF88]/10' 
                  : 'text-[#6B7280] hover:text-[#2563EB] hover:bg-[#2563EB]/10'
              }`}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
            
            {showMenu && (
              <div 
                className={`absolute right-0 top-full mt-1 w-32 rounded-lg border shadow-lg z-50 overflow-hidden ${
                  isDark 
                    ? 'bg-[#161B22] border-[#1F2937]' 
                    : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <button
                  onClick={() => { onEdit(); setShowMenu(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-mono text-left transition-colors ${
                    isDark 
                      ? 'text-[#00FF88] hover:bg-[#00FF88]/10' 
                      : 'text-[#2563EB] hover:bg-[#2563EB]/10'
                  }`}
                >
                  <Edit2 className="h-4 w-4" />
                  EDIT
                </button>
                <button
                  onClick={() => { onDelete(); setShowMenu(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-mono text-left transition-colors ${
                    isDark 
                      ? 'text-[#EF4444] hover:bg-[#EF4444]/10' 
                      : 'text-[#DC2626] hover:bg-[#DC2626]/10'
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                  DELETE
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

function DashboardContent() {
  const { session } = useAuth();
  const { wallets: _wallets } = useWalletContext();
  const user = session?.user;
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<AirdropType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AirdropStatus | 'all'>('all');
  const [sortBy,] = useState<'newest' | 'progress'>('newest');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAirdrop, setEditingAirdrop] = useState<Airdrop | null>(null);
  const [deletingAirdrop, setDeletingAirdrop] = useState<Airdrop | null>(null);
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(false);
  
  const isDark = theme === 'dark';

  const filteredAirdrops = useMemo(() => {
    let result = [...airdrops];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.projectName.toLowerCase().includes(query) ||
        a.twitterUsername.toLowerCase().includes(query) ||
        a.walletAddress?.toLowerCase().includes(query)
      );
    }
    if (typeFilter !== "all") result = result.filter(a => a.type === typeFilter);
    if (statusFilter !== "all") result = result.filter(a => a.status === statusFilter);
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  }, [airdrops, searchQuery, typeFilter, statusFilter, sortBy]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const data = await getAirdropsByUserId(user.id);
      setAirdrops(data);
    };
    load();
  }, [user]);

  async function handleAddAirdrop(data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    if (!user) return;
    await createAirdrop(data, user.id);
    const freshData = await getAirdropsByUserId(user.id);
    setAirdrops(freshData);
    setIsAddModalOpen(false);
  }

  const handleEditAirdrop = async (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!editingAirdrop || !user) return;
    
    const { error } = await supabase.from("airdrops").update({
      project_name: data.projectName,
      project_logo: data.projectLogo,
      type: data.type,
      status: data.status,
      platform_link: data.platformLink,
      twitter_username: data.twitterUsername,
      wallet_address: data.walletAddress,
      notes: data.notes,
      tasks: data.tasks || [],
      priority: data.priority,
      deadline: data.deadline,
      is_priority: data.isPriority,
      updated_at: new Date().toISOString(),
    }).eq("id", editingAirdrop.id);
    
    if (error) {
      console.error('Update error:', error);
      return;
    }
    
    const freshData = await getAirdropsByUserId(user.id);
    setAirdrops(freshData);
    setEditingAirdrop(null);
  };

  const handleDeleteAirdrop = async () => {
    if (!deletingAirdrop) return;
    const { error } = await supabase.from("airdrops").delete().eq("id", deletingAirdrop.id);
    if (error) return console.error(error);
    setAirdrops(prev => prev.filter(a => a.id !== deletingAirdrop.id));
    setDeletingAirdrop(null);
  };

  const handleToggleTask = async (airdropId: string, taskId: string) => {
    const airdrop = airdrops.find(a => a.id === airdropId);
    if (!airdrop) return;
    const updatedTasks = airdrop.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    const { error } = await supabase.from("airdrops").update({ tasks: updatedTasks }).eq("id", airdropId);
    if (error) return console.error(error);
    setAirdrops(prev => prev.map(a => a.id === airdropId ? { ...a, tasks: updatedTasks } : a));
  };

  const getProgress = (airdrop: Airdrop) => {
    if (airdrop.tasks.length === 0) return 0;
    return Math.round((airdrop.tasks.filter(t => t.completed).length / airdrop.tasks.length) * 100);
  };

  const cardBaseClasses = `relative p-6 rounded-xl border transition-all duration-300 ease-out overflow-hidden group`;
  const cardThemeClasses = isDark 
    ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]' 
    : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]';

  return (
    <div className={`min-h-screen flex flex-col font-mono transition-colors duration-300 ${isDark ? 'bg-[#0B0F14] text-[#E5E7EB]' : 'bg-[#F3F4F6] text-[#111827]'}`}>
      {/* HAPUS NAVBAR - sekarang di TopBar */}

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Tanpa background putih */}
        <div className="mb-8">
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
            <div>
              <h1 className={`text-3xl font-bold tracking-tighter ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                {isDark ? '> DASHBOARD.exe' : 'DASHBOARD'}
              </h1>
              <p className={`mt-1 font-mono text-sm ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                {isDark ? `root@alpha-tracker:~$ track --airdrops --all [${airdrops.length}]` : `Track and manage your airdrop portfolio • ${airdrops.length} projects`}
              </p>
            </div>
            <div className="xl:w-auto w-full">
              <PriceTracker isDark={isDark} />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'TOTAL_PROJECTS', value: airdrops.length, icon: Layers, color: isDark ? 'text-[#00FF88]' : 'text-[#2563EB]' },
            { label: 'ACTIVE_NODES', value: airdrops.filter(a => a.status === 'Ongoing').length, icon: TrendingUp, color: isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]' },
            { label: 'COMPLETED', value: airdrops.filter(a => a.status === 'Done').length, icon: CheckCircle, color: isDark ? 'text-[#00FF88]' : 'text-[#10B981]' },
            { label: 'DROPPED', value: airdrops.filter(a => a.status === 'Dropped').length, icon: XCircle, color: isDark ? 'text-[#EF4444]' : 'text-[#DC2626]' },
          ].map((stat, idx) => (
            <div key={idx} className={`${cardBaseClasses} ${cardThemeClasses}`}>
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${isDark ? 'from-[#00FF88]/20 via-transparent to-[#00FF88]/20' : 'from-[#2563EB]/20 via-transparent to-[#2563EB]/20'}`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className={`text-xs font-mono mb-1 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>{stat.label}</p>
                  <p className={`text-3xl font-bold font-mono ${stat.color}`}>{String(stat.value).padStart(2, '0')}</p>
                </div>
                <div className={`w-12 h-12 rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${isDark ? 'bg-[#00FF88]/5 border border-[#00FF88]/20' : 'bg-[#2563EB]/5 border border-[#2563EB]/20'}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <Card className={`border mb-6 ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}`}>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`} />
                <Input 
                  placeholder={isDark ? "> search --projects..." : "Search projects..."} 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className={`pl-10 font-mono border transition-all duration-200 ${isDark ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#00FF88]' : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'}`} 
                />
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AirdropType | 'all')}>
                  <SelectTrigger className={`w-[130px] font-mono border transition-all duration-200 ${isDark ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB]' : 'bg-white border-[#E5E7EB] text-[#374151]'}`}>
                    <Filter className={`h-4 w-4 mr-2 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`} />
                    <SelectValue placeholder="ALL_TYPES" />
                  </SelectTrigger>
                  <SelectContent className={`font-mono border ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}`}>
                    <SelectItem value="all" className={isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'}>ALL_TYPES</SelectItem>
                    {AIRDROP_TYPES.map(type => <SelectItem key={type} value={type} className={isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'}>{type.toUpperCase()}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AirdropStatus | 'all')}>
                  <SelectTrigger className={`w-[130px] font-mono border transition-all duration-200 ${isDark ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB]' : 'bg-white border-[#E5E7EB] text-[#374151]'}`}>
                    <SelectValue placeholder="ALL_STATUS" />
                  </SelectTrigger>
                  <SelectContent className={`font-mono border ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}`}>
                    <SelectItem value="all" className={isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'}>ALL_STATUS</SelectItem>
                    {AIRDROP_STATUSES.map(status => <SelectItem key={status} value={status} className={isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'}>{status.toUpperCase()}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className={`flex rounded border p-1 ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'}`}>
                  <Button 
                    variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                    size="icon" 
                    onClick={() => setViewMode('grid')} 
                    className={`rounded font-mono transition-all duration-200 ${viewMode === 'grid' ? (isDark ? 'bg-[#00FF88] text-[#0B0F14] hover:bg-[#00FF88]/90' : 'bg-[#2563EB] text-white hover:bg-[#2563EB]/90') : (isDark ? 'text-[#6B7280] hover:bg-[#00FF88]/10' : 'text-[#6B7280] hover:bg-[#2563EB]/10')}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'ghost'} 
                    size="icon" 
                    onClick={() => setViewMode('list')} 
                    className={`rounded font-mono transition-all duration-200 ${viewMode === 'list' ? (isDark ? 'bg-[#00FF88] text-[#0B0F14] hover:bg-[#00FF88]/90' : 'bg-[#2563EB] text-white hover:bg-[#2563EB]/90') : (isDark ? 'text-[#6B7280] hover:bg-[#00FF88]/10' : 'text-[#6B7280] hover:bg-[#2563EB]/10')}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Airdrops List/Grid */}
        {filteredAirdrops.length === 0 ? (
          <div className={`${cardBaseClasses} ${cardThemeClasses} p-12 text-center`}>
            <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${isDark ? 'from-[#00FF88]/20 via-transparent to-[#00FF88]/20' : 'from-[#2563EB]/20 via-transparent to-[#2563EB]/20'}`} />
            <div className="relative">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-105 ${isDark ? 'bg-[#161B22] border border-[#1F2937]' : 'bg-white border border-[#E5E7EB]'}`}>
                <Search className={`h-10 w-10 ${isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'}`} />
              </div>
              <h3 className={`text-xl font-mono font-bold mb-2 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>{isDark ? '> NO_DATA_FOUND' : 'No airdrops found'}</h3>
              <p className={`font-mono text-sm mb-4 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>{isDark ? 'Initialize new project tracking...' : 'Start tracking your first airdrop campaign'}</p>
              <Button 
                onClick={() => setIsAddModalOpen(true)} 
                className={`font-mono border-2 transition-all duration-300 hover:scale-105 ${isDark ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90' : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90'}`}
              >
                <Plus className="h-4 w-4 mr-2" />{isDark ? 'INIT_PROJECT()' : 'Add Your First Airdrop'}
              </Button>
            </div>
          </div>
        ) : viewMode === 'list' ? (
          // TABLE VIEW - Like TheDropsData with Logo
          <div className={`border rounded-xl overflow-hidden ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                    <th className={`px-4 py-3 text-left text-xs font-mono font-medium ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>NO</th>
                    <th className={`px-4 py-3 text-left text-xs font-mono font-medium ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>NAME</th>
                    <th className={`px-4 py-3 text-left text-xs font-mono font-medium ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>TYPE</th>
                    <th className={`px-4 py-3 text-left text-xs font-mono font-medium ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>WALLET ADDRESS</th>
                    <th className={`px-4 py-3 text-left text-xs font-mono font-medium ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>OFFICIAL LINK</th>
                    <th className={`px-4 py-3 text-left text-xs font-mono font-medium ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>STATUS</th>
                    <th className={`px-4 py-3 text-left text-xs font-mono font-medium ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAirdrops.map((airdrop, index) => (
                    <TableRow 
                      key={airdrop.id} 
                      airdrop={airdrop} 
                      index={index} 
                      isDark={isDark}
                      logoError={logoError}
                      setLogoError={setLogoError}
                      onEdit={() => setEditingAirdrop(airdrop)}
                      onDelete={() => setDeletingAirdrop(airdrop)}
                      onAddPriority={() => {/* TODO: Implement add priority */}}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // GRID VIEW
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredAirdrops.map((airdrop: Airdrop) => (
              <AirdropCard 
              viewMode={viewMode}
                key={airdrop.id} 
                airdrop={airdrop} 
                 
                onEdit={() => { setEditingAirdrop(airdrop); setOpenMenuId(null); }} 
                onDelete={() => { setDeletingAirdrop(airdrop); setOpenMenuId(null); }} 
                onToggleTask={handleToggleTask} 
                getProgress={getProgress} 
                isDark={isDark} 
                logoError={logoError} 
                setLogoError={setLogoError} 
                isMenuOpen={openMenuId === airdrop.id} 
                onMenuToggle={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === airdrop.id ? null : airdrop.id); }} 
              />
            ))}
          </div>
        )}
      </main>

      {/* MODALS */}
      <ModalWrapper isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} isDark={isDark}>
        <AirdropModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddAirdrop} mode="add" isDark={isDark} />
      </ModalWrapper>

      <ModalWrapper isOpen={!!editingAirdrop} onClose={() => setEditingAirdrop(null)} isDark={isDark}>
        <AirdropModal isOpen={!!editingAirdrop} onClose={() => setEditingAirdrop(null)} onSubmit={handleEditAirdrop} mode="edit" airdrop={editingAirdrop} isDark={isDark} />
      </ModalWrapper>

      <ModalWrapper isOpen={!!deletingAirdrop} onClose={() => setDeletingAirdrop(null)} maxWidth="max-w-md" isDark={isDark}>
        <DeleteConfirmModal isOpen={!!deletingAirdrop} onClose={() => setDeletingAirdrop(null)} onConfirm={handleDeleteAirdrop} projectName={deletingAirdrop?.projectName} isDark={isDark} />
      </ModalWrapper>

      <WalletConnectModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
      <EligibilityModal isOpen={isEligibilityModalOpen} onClose={() => setIsEligibilityModalOpen(false)} />
    </div>
  );
}

// AIRDROP CARD COMPONENT - For Grid View
interface AirdropCardProps {
  airdrop: Airdrop;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
  onDelete: () => void;
  onToggleTask: (airdropId: string, taskId: string) => void;
  getProgress: (airdrop: Airdrop) => number;
  isDark: boolean;
  logoError: Record<string, boolean>;
  setLogoError: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isMenuOpen: boolean;
  onMenuToggle: (e: React.MouseEvent) => void;
}

function AirdropCard({ airdrop, onEdit, onDelete, onToggleTask, getProgress, isDark, logoError, setLogoError, isMenuOpen, onMenuToggle }: AirdropCardProps) {
  const progress = getProgress(airdrop);
  const completedTasks = airdrop.tasks.filter(t => t.completed).length;
  const getTypeColor = (type: string) => isDark ? TYPE_COLORS[type]?.dark || TYPE_COLORS['Quest'].dark : TYPE_COLORS[type]?.light || TYPE_COLORS['Quest'].light;
  const getStatusColor = (status: string) => isDark ? STATUS_COLORS[status]?.dark || STATUS_COLORS['Planning'].dark : STATUS_COLORS[status]?.light || STATUS_COLORS['Planning'].light;
  const handleLogoError = () => setLogoError(prev => ({ ...prev, [airdrop.id]: true }));
  const hasLogoError = logoError[airdrop.id] || !airdrop.projectLogo;

  const cardBaseClasses = `relative p-6 rounded-xl border transition-all duration-300 ease-out overflow-hidden group`;
  const cardThemeClasses = isDark 
    ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]' 
    : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]';

  return (
    <div className={`${cardBaseClasses} ${cardThemeClasses}`}>
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${isDark ? 'from-[#00FF88]/20 via-transparent to-[#00FF88]/20' : 'from-[#2563EB]/20 via-transparent to-[#2563EB]/20'}`} />
      
      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden border flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'}`}>
              {hasLogoError ? (
                <span className={`text-xl font-bold ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>
                  {airdrop.projectName[0].toUpperCase()}
                </span>
              ) : (
                <img src={airdrop.projectLogo} alt={airdrop.projectName} className="w-full h-full object-cover" onError={handleLogoError} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-mono font-bold text-base truncate ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>{airdrop.projectName}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className={`font-mono text-xs ${getTypeColor(airdrop.type)}`}>{airdrop.type}</Badge>
                <Badge variant="outline" className={`font-mono text-xs ${getStatusColor(airdrop.status)}`}>{airdrop.status}</Badge>
              </div>
            </div>
          </div>
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={onMenuToggle} className={`flex-shrink-0 border transition-all duration-200 ${isDark ? 'text-[#6B7280] border-[#1F2937] hover:bg-[#00FF88]/10 hover:text-[#00FF88]' : 'text-[#6B7280] border-[#E5E7EB] hover:bg-[#2563EB]/10 hover:text-[#2563EB]'}`}>
              <MoreVertical className="h-4 w-4" />
            </Button>
            {isMenuOpen && (
              <div className={`absolute right-0 top-full mt-1 w-32 rounded-lg border shadow-lg z-50 overflow-hidden ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-mono text-left transition-colors ${isDark ? 'text-[#00FF88] hover:bg-[#00FF88]/10' : 'text-[#2563EB] hover:bg-[#2563EB]/10'}`}><Edit2 className="h-4 w-4" />EDIT</button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-mono text-left transition-colors ${isDark ? 'text-[#EF4444] hover:bg-[#EF4444]/10' : 'text-[#DC2626] hover:bg-[#DC2626]/10'}`}><Trash2 className="h-4 w-4" />DELETE</button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className={`flex items-center justify-between text-xs font-mono mb-2 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
            <span>PROGRESS_{progress}%</span>
            <span className={isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}>[{completedTasks}/{airdrop.tasks.length}]</span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden border ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'}`}>
            <div className={`h-full transition-all duration-500 ${isDark ? 'bg-[#00FF88]' : 'bg-[#2563EB]'}`} style={{ width: `${progress}%` }} />
          </div>
        </div>

        {airdrop.walletAddress && (
          <div className={`flex items-center gap-2 p-2 rounded-lg border mb-3 transition-all duration-200 ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'}`}>
            <Wallet className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-[#8B5CF6]' : 'text-[#4F46E5]'}`} />
            <span className={`text-xs font-mono truncate ${isDark ? 'text-[#8B5CF6]' : 'text-[#4F46E5]'}`}>{formatWallet(airdrop.walletAddress)}</span>
          </div>
        )}

        {airdrop.tasks.length > 0 && (
          <div className="flex-1 space-y-2 mb-4">
            {airdrop.tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center gap-2 group cursor-pointer" onClick={() => onToggleTask(airdrop.id, task.id)}>
                {task.completed ? (
                  <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-[#00FF88]' : 'text-[#10B981]'}`} />
                ) : (
                  <Circle className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-[#6B7280] group-hover:text-[#00FF88]' : 'text-[#9CA3AF] group-hover:text-[#2563EB]'}`} />
                )}
                <span className={`text-xs font-mono truncate ${task.completed ? (isDark ? 'text-[#6B7280] line-through' : 'text-[#9CA3AF] line-through') : (isDark ? 'text-[#E5E7EB]' : 'text-[#374151]')}`}>
                  {task.title}
                </span>
              </div>
            ))}
            {airdrop.tasks.length > 3 && (
              <p className={`text-xs font-mono pl-6 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>+{airdrop.tasks.length - 3} more tasks...</p>
            )}
          </div>
        )}

        <div className={`flex items-center gap-2 mt-auto pt-3 border-t border-dashed ${isDark ? 'border-[#1F2937]' : 'border-[#E5E7EB]'}`}>
          {airdrop.platformLink && (
            <a href={airdrop.platformLink} target="_blank" rel="noopener noreferrer" className={`p-2 rounded border transition-all duration-200 hover:scale-110 ${isDark ? 'bg-[#0B0F14] border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10 hover:border-[#00FF88] hover:text-[#00FF88]' : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10 hover:border-[#2563EB] hover:text-[#2563EB]'}`}>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {airdrop.twitterUsername && (
            <a href={`https://twitter.com/${airdrop.twitterUsername.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className={`p-2 rounded border transition-all duration-200 hover:scale-110 ${isDark ? 'bg-[#0B0F14] border-[#1F2937] text-[#6B7280] hover:bg-[#3B82F6]/10 hover:border-[#3B82F6] hover:text-[#3B82F6]' : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280] hover:bg-[#3B82F6]/10 hover:border-[#3B82F6] hover:text-[#3B82F6]'}`}>
              <Twitter className="h-4 w-4" />
            </a>
          )}
          <div className="flex-1"></div>
          <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
            {new Date(airdrop.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}