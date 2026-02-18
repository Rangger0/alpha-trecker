// ALPHA TRECKER - Dashboard (FIXED)
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
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
  Sun,
  Moon,
  LogOut,
  Terminal,
  LayoutGrid,
  List,
  Layers,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Wallet,
} from "lucide-react";
import { AirdropModal } from "@/components/modals/AirdropModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
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

// UPDATED COLORS - Dark Web3 & Light Tactical
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
function DigitalClock({ isDark }: { isDark: boolean }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).toUpperCase();
  };

  return (
    <div className={`flex flex-col items-end font-mono ${
      isDark ? 'text-[#00FF88]' : 'text-[#111827]'
    }`}>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 animate-pulse" />
        <span className="text-lg font-bold tracking-wider">
          {formatTime(time)}
        </span>
      </div>
      <span className={`text-xs ${
        isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
      }`}>
        {formatDate(time)}
      </span>
    </div>
  );
}

// Placeholder SVG untuk logo yang hilang
const PlaceholderLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="8" fill="currentColor" fillOpacity="0.1"/>
    <path d="M24 14L32 34H16L24 14Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="24" cy="28" r="3" fill="currentColor"/>
  </svg>
);

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Format wallet address untuk tampilan singkat
const formatWallet = (address: string) => {
  if (!address) return '';
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Footer Component dengan TikTok dan Logo Fix
function Footer({ isDark }: { isDark: boolean }) {
  return (
    <footer className={`border-t py-8 mt-auto ${
      isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
        {/* Logo Alpha Tracker - FIX: Menggunakan Terminal icon */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded flex items-center justify-center border-2 ${
            isDark ? 'bg-[#00FF88]/10 border-[#00FF88] text-[#00FF88]' : 'bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]'
          }`}>
            <Terminal className="w-6 h-6" />
          </div>
          <span className={`text-xl font-bold tracking-tighter font-mono ${
            isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
          }`}>
            <span className={isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}>ALPHA</span>
            <span className={isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'}>_TRACKER</span>
          </span>
        </div>

        {/* Social Icons - X, Telegram, GitHub, TikTok (SEMUA DI BAWAH) */}
        <div className="flex items-center gap-4">
          <a 
            href="https://x.com/rinzx_" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`p-3 rounded border transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'bg-[#0B0F14] border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10 hover:border-[#00FF88] hover:text-[#00FF88]' 
                : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10 hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
            aria-label="X (Twitter)"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a 
            href="https://t.me/+MGzRobr9cp4yMTk1" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`p-3 rounded border transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'bg-[#0B0F14] border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10 hover:border-[#00FF88] hover:text-[#00FF88]' 
                : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10 hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
            aria-label="Telegram"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </a>
          <a 
            href="https://github.com/Rangger0" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`p-3 rounded border transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'bg-[#0B0F14] border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10 hover:border-[#00FF88] hover:text-[#00FF88]' 
                : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10 hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
            aria-label="GitHub"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          {/* TIKTOK DI BAWAH BERSAMA ICON LAINNYA */}
          <a 
            href="https://www.tiktok.com/@rinzzx0" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`p-3 rounded border transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'bg-[#0B0F14] border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10 hover:border-[#00FF88] hover:text-[#00FF88]' 
                : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10 hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
            aria-label="TikTok"
            title="TikTok @rinzzx0"
          >
            <TikTokIcon className="w-5 h-5" />
          </a>
        </div>

        {/* Credit */}
        <div className={`text-center font-mono text-sm ${
          isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
        }`}>
          <p>Created with <span className="text-red-500">♥</span> by</p>
          <p className={isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}>Rose Alpha</p>
        </div>

        {/* Copyright */}
        <p className={`text-xs font-mono ${
          isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'
        }`}>
          © 2026 ALPHA TRACKER. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export function Dashboard() {
  const { session, logout } = useAuth();
  const user = session?.user;
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<AirdropType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AirdropStatus | 'all'>('all');
  const [sortBy,] = useState<'newest' | 'progress'>('newest');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAirdrop, setEditingAirdrop] = useState<Airdrop | null>(null);
  const [deletingAirdrop, setDeletingAirdrop] = useState<Airdrop | null>(null);
  const { theme, toggleTheme } = useTheme();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
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

  // Click outside handler untuk nutup menu
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
      updated_at: new Date().toISOString(),
    }).eq("id", editingAirdrop.id);
    if (error) return console.error(error);
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

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-mono transition-colors duration-300 ${
      isDark ? 'bg-[#0B0F14] text-[#E5E7EB]' : 'bg-[#F3F4F6] text-[#111827]'
    }`}>
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        isDark 
          ? 'bg-[#0B0F14]/95 border-[#1F2937]' 
          : 'bg-[#FFFFFF]/95 border-[#E5E7EB]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Add Button */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded flex items-center justify-center border-2 ${
                  isDark ? 'bg-[#00FF88]/10 border-[#00FF88] text-[#00FF88]' : 'bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]'
                }`}>
                  <Terminal className="w-6 h-6" />
                </div>
                <span className={`text-xl font-bold tracking-tighter hidden sm:block ${
                  isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                }`}>
                  <span className={isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}>ALPHA</span>
                  <span className={isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'}>_TRACKER</span>
                  <span className={isDark ? 'text-[#00FF88] animate-pulse' : 'text-[#10B981] animate-pulse'}>_</span>
                </span>
              </div>

              <div className={`h-8 w-px hidden md:block ${
                isDark ? 'bg-[#1F2937]' : 'bg-[#E5E7EB]'
              }`} />

              <Button 
                onClick={() => setIsAddModalOpen(true)} 
                className={`font-mono text-sm border-2 transition-all duration-200 ${
                  isDark 
                    ? 'bg-transparent border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88] hover:text-[#0B0F14] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]' 
                    : 'bg-transparent border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white'
                }`}
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">[NEW_PROJECT]</span>
                <span className="sm:hidden">[NEW]</span>
              </Button>
            </div>
            
            {/* Right: Clock + Theme + User + Logout */}
            <div className="flex items-center gap-4">
              <DigitalClock isDark={isDark} />

              <div className={`h-8 w-px hidden md:block ${
                isDark ? 'bg-[#1F2937]' : 'bg-[#E5E7EB]'
              }`} />

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className={`border transition-colors ${
                  isDark 
                    ? 'text-[#00FF88] border-[#1F2937] hover:bg-[#00FF88]/10' 
                    : 'text-[#2563EB] border-[#E5E7EB] hover:bg-[#2563EB]/10'
                }`}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <div className={`hidden md:flex items-center gap-3 px-4 py-2 rounded border ${
                isDark 
                  ? 'bg-[#161B22] border-[#1F2937] text-[#E5E7EB]' 
                  : 'bg-white border-[#E5E7EB] text-[#374151]'
              }`}>
                <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
                  isDark ? 'bg-[#00FF88]/20 text-[#00FF88]' : 'bg-[#2563EB]/10 text-[#2563EB]'
                }`}>
                  {user?.email?.[0].toUpperCase()}
                </div>
                <span className="text-sm truncate max-w-[150px]">{user?.email}</span>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout} 
                className={`border transition-colors ${
                  isDark 
                    ? 'text-[#EF4444] border-[#1F2937] hover:bg-[#EF4444]/10' 
                    : 'text-[#DC2626] border-[#E5E7EB] hover:bg-[#DC2626]/10'
                }`}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold tracking-tighter ${
            isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
          }`}>
            {isDark ? '> DASHBOARD.exe' : 'DASHBOARD'}
          </h1>
          <p className={`mt-1 font-mono text-sm ${
            isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
          }`}>
            {isDark ? `root@alpha-tracker:~$ track --airdrops --all [${airdrops.length}]` : `Track and manage your airdrop portfolio • ${airdrops.length} projects`}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'TOTAL_PROJECTS', value: airdrops.length, icon: Layers, color: isDark ? 'text-[#00FF88]' : 'text-[#2563EB]' },
            { label: 'ACTIVE_NODES', value: airdrops.filter(a => a.status === 'Ongoing').length, icon: TrendingUp, color: isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]' },
            { label: 'COMPLETED', value: airdrops.filter(a => a.status === 'Done').length, icon: CheckCircle, color: isDark ? 'text-[#00FF88]' : 'text-[#10B981]' },
            { label: 'DROPPED', value: airdrops.filter(a => a.status === 'Dropped').length, icon: XCircle, color: isDark ? 'text-[#EF4444]' : 'text-[#DC2626]' },
          ].map((stat, idx) => (
            <Card key={idx} className={`border transition-all duration-300 ${
              isDark 
                ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50' 
                : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/50'
            }`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-mono mb-1 ${
                      isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                    }`}>{stat.label}</p>
                    <p className={`text-3xl font-bold font-mono ${stat.color}`}>
                      {String(stat.value).padStart(2, '0')}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded flex items-center justify-center ${
                    isDark ? 'bg-[#00FF88]/5 border border-[#00FF88]/20' : 'bg-[#2563EB]/5 border border-[#2563EB]/20'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters - RAPI & SIMETRIS */}
        <Card className={`border mb-6 ${
          isDark 
            ? 'bg-[#161B22] border-[#1F2937]' 
            : 'bg-white border-[#E5E7EB]'
        }`}>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              {/* Search - Full width on mobile, flex-1 on desktop */}
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                  isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                }`} />
                <Input
                  placeholder={isDark ? "> search --projects..." : "Search projects..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 font-mono border ${
                    isDark 
                      ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#00FF88]' 
                      : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                  }`}
                />
              </div>
              
              {/* Filter Container - Simetris */}
              <div className="flex flex-wrap gap-2 items-center">
                {/* Type Filter */}
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AirdropType | 'all')}>
                  <SelectTrigger className={`w-[130px] font-mono border ${
                    isDark 
                      ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB]' 
                      : 'bg-white border-[#E5E7EB] text-[#374151]'
                  }`}>
                    <Filter className={`h-4 w-4 mr-2 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`} />
                    <SelectValue placeholder="ALL_TYPES" />
                  </SelectTrigger>
                  <SelectContent className={`font-mono border ${
                    isDark 
                      ? 'bg-[#161B22] border-[#1F2937]' 
                      : 'bg-white border-[#E5E7EB]'
                  }`}>
                    <SelectItem value="all" className={isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'}>ALL_TYPES</SelectItem>
                    {AIRDROP_TYPES.map(type => (
                      <SelectItem key={type} value={type} className={isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Status Filter - Sama ukurannya */}
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AirdropStatus | 'all')}>
                  <SelectTrigger className={`w-[130px] font-mono border ${
                    isDark 
                      ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB]' 
                      : 'bg-white border-[#E5E7EB] text-[#374151]'
                  }`}>
                    <SelectValue placeholder="ALL_STATUS" />
                  </SelectTrigger>
                  <SelectContent className={`font-mono border ${
                    isDark 
                      ? 'bg-[#161B22] border-[#1F2937]' 
                      : 'bg-white border-[#E5E7EB]'
                  }`}>
                    <SelectItem value="all" className={isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'}>ALL_STATUS</SelectItem>
                    {AIRDROP_STATUSES.map(status => (
                      <SelectItem key={status} value={status} className={isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'}>
                        {status.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className={`flex rounded border p-1 ${
                  isDark 
                    ? 'bg-[#0B0F14] border-[#1F2937]' 
                    : 'bg-[#F3F4F6] border-[#E5E7EB]'
                }`}>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className={`rounded font-mono ${
                      viewMode === 'grid' 
                        ? (isDark ? 'bg-[#00FF88] text-[#0B0F14] hover:bg-[#00FF88]/90' : 'bg-[#2563EB] text-white hover:bg-[#2563EB]/90')
                        : (isDark ? 'text-[#6B7280] hover:bg-[#00FF88]/10' : 'text-[#6B7280] hover:bg-[#2563EB]/10')
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className={`rounded font-mono ${
                      viewMode === 'list' 
                        ? (isDark ? 'bg-[#00FF88] text-[#0B0F14] hover:bg-[#00FF88]/90' : 'bg-[#2563EB] text-white hover:bg-[#2563EB]/90')
                        : (isDark ? 'text-[#6B7280] hover:bg-[#00FF88]/10' : 'text-[#6B7280] hover:bg-[#2563EB]/10')
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Airdrops Grid/List */}
        {filteredAirdrops.length === 0 ? (
          <Card className={`border ${
            isDark 
              ? 'bg-[#161B22] border-[#1F2937]' 
              : 'bg-white border-[#E5E7EB]'
          }`}>
            <CardContent className="p-12 text-center">
              <Terminal className={`h-16 w-16 mx-auto mb-4 ${
                isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'
              }`} />
              <h3 className={`text-xl font-mono font-bold mb-2 ${
                isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
              }`}>
                {isDark ? '> NO_DATA_FOUND' : 'No airdrops found'}
              </h3>
              <p className={`font-mono text-sm mb-4 ${
                isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
              }`}>
                {isDark ? 'Initialize new project tracking...' : 'Start tracking your first airdrop campaign'}
              </p>
              <Button 
                onClick={() => setIsAddModalOpen(true)} 
                className={`font-mono border-2 ${
                  isDark 
                    ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90' 
                    : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90'
                }`}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isDark ? 'INIT_PROJECT()' : 'Add Your First Airdrop'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
            {filteredAirdrops.map((airdrop: Airdrop) => (
              <AirdropCard
                key={airdrop.id}
                airdrop={airdrop}
                viewMode={viewMode}
                onEdit={() => {
                  setEditingAirdrop(airdrop);
                  setOpenMenuId(null);
                }}
                onDelete={() => {
                  setDeletingAirdrop(airdrop);
                  setOpenMenuId(null);
                }}
                onToggleTask={handleToggleTask}
                getProgress={getProgress}
                isDark={isDark}
                logoError={logoError}
                setLogoError={setLogoError}
                isMenuOpen={openMenuId === airdrop.id}
                onMenuToggle={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === airdrop.id ? null : airdrop.id);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <Footer isDark={isDark} />

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/5"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div 
            className={`relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg ${
              isDark ? 'bg-[#161b2208]' : 'bg-white'
            }`}
          >
            <AirdropModal 
              isOpen={isAddModalOpen} 
              onClose={() => setIsAddModalOpen(false)} 
              onSubmit={handleAddAirdrop} 
              mode="add"
              isDark={isDark}
            />
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {editingAirdrop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/5"
            onClick={() => setEditingAirdrop(null)}
          />
          <div 
            className={`relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg ${
              isDark ? 'bg-[#161b2200]' : 'bg-white'
            }`}
          >
            <AirdropModal 
              isOpen={!!editingAirdrop} 
              onClose={() => setEditingAirdrop(null)} 
              onSubmit={handleEditAirdrop} 
              mode="edit" 
              airdrop={editingAirdrop}
              isDark={isDark}
            />
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {deletingAirdrop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className={`absolute inset-0 ${isDark ? 'bg-black/5' : 'bg-black/5'}`}
            onClick={() => setDeletingAirdrop(null)}
          />
          <div className={`relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border ${
            isDark ? 'bg-[#272d340d] border-[#9f9f9f0f]' : 'bg-white border-[#e5e7eb00]'
          }`}>
            <DeleteConfirmModal 
              isOpen={!!deletingAirdrop} 
              onClose={() => setDeletingAirdrop(null)} 
              onConfirm={handleDeleteAirdrop} 
              projectName={deletingAirdrop?.projectName}
              isDark={isDark}
            />
          </div>
        </div>
      )}
    </div> 
  );
}

// AIRDROP CARD COMPONENT
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

function AirdropCard({ 
  airdrop, 
  viewMode, 
  onEdit, 
  onDelete, 
  onToggleTask, 
  getProgress, 
  isDark,
  logoError,
  setLogoError,
  isMenuOpen,
  onMenuToggle
}: AirdropCardProps) {
  const progress = getProgress(airdrop);
  const completedTasks = airdrop.tasks.filter(t => t.completed).length;
  
  const getTypeColor = (type: string) => {
    return isDark ? TYPE_COLORS[type]?.dark || TYPE_COLORS['Quest'].dark : TYPE_COLORS[type]?.light || TYPE_COLORS['Quest'].light;
  };

  const getStatusColor = (status: string) => {
    return isDark ? STATUS_COLORS[status]?.dark || STATUS_COLORS['Planning'].dark : STATUS_COLORS[status]?.light || STATUS_COLORS['Planning'].light;
  };

  const handleLogoError = () => {
    setLogoError(prev => ({ ...prev, [airdrop.id]: true }));
  };

  const hasLogoError = logoError[airdrop.id] || !airdrop.projectLogo;
  
  // CUSTOM MENU COMPONENT
  const ActionMenu = () => (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onMenuToggle}
        className={`flex-shrink-0 border ${
          isDark 
            ? 'text-[#6B7280] border-[#1F2937] hover:bg-[#00FF88]/10 hover:text-[#00FF88]' 
            : 'text-[#6B7280] border-[#E5E7EB] hover:bg-[#2563EB]/10 hover:text-[#2563EB]'
        }`}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
      
      {isMenuOpen && (
        <div 
          className={`absolute right-0 top-full mt-1 w-32 rounded-md border shadow-lg z-50 ${
            isDark 
              ? 'bg-[#161B22] border-[#1F2937]' 
              : 'bg-white border-[#E5E7EB]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
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
  );
  
  if (viewMode === "list") {
    return (
      <Card className={`border transition-all duration-300 ${
        isDark 
          ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50' 
          : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/50'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className={`w-12 h-12 rounded flex-shrink-0 overflow-hidden border flex items-center justify-center ${
              isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'
            }`}>
              {hasLogoError ? (
                <PlaceholderLogo className={`w-8 h-8 ${isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'}`} />
              ) : (
                <img
                  src={airdrop.projectLogo}
                  alt={airdrop.projectName}
                  className="w-full h-full object-cover"
                  onError={handleLogoError}
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`font-mono font-bold text-base ${
                  isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                }`}>
                  {airdrop.projectName}
                </h3>
                <Badge variant="outline" className={`font-mono text-xs ${getTypeColor(airdrop.type)}`}>
                  {airdrop.type}
                </Badge>
                <Badge variant="outline" className={`font-mono text-xs ${getStatusColor(airdrop.status)}`}>
                  {airdrop.status}
                </Badge>
              </div>

              {/* Wallet Address - NEW */}
              {airdrop.walletAddress && (
                <div className={`flex items-center gap-1 mt-1 text-xs font-mono ${
                  isDark ? 'text-[#8B5CF6]' : 'text-[#4F46E5]'
                }`}>
                  <Wallet className="h-3 w-3" />
                  <span>{formatWallet(airdrop.walletAddress)}</span>
                </div>
              )}

              {/* Progress */}
              <div className="mt-2">
                <div className={`flex items-center justify-between text-xs font-mono mb-1 ${
                  isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                }`}>
                  <span>PROGRESS</span>
                  <span className={isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}>
                    {completedTasks}/{airdrop.tasks.length}
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden w-full max-w-[200px] border ${
                  isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'
                }`}>
                  <div 
                    className={`h-full transition-all duration-500 ${
                      isDark ? 'bg-[#00FF88]' : 'bg-[#2563EB]'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className={`flex items-center gap-4 mt-2 text-sm font-mono ${
                isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
              }`}>
                {airdrop.twitterUsername && (
                  <a
                    href={`https://x.com/${airdrop.twitterUsername.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1 hover:underline ${
                      isDark ? 'hover:text-[#00FF88]' : 'hover:text-[#2563EB]'
                    }`}
                  >
                    <Twitter className="h-3.5 w-3.5" />
                    @{airdrop.twitterUsername.replace('@', '')}
                  </a>
                )}
              </div>
            </div>

            {/* ACTIONS MENU */}
            <ActionMenu />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // GRID VIEW
  return (
    <Card className={`border transition-all duration-300 overflow-hidden ${
      isDark 
        ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50' 
        : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/50'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-12 h-12 rounded flex-shrink-0 overflow-hidden border flex items-center justify-center ${
              isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'
            }`}>
              {hasLogoError ? (
                <PlaceholderLogo className={`w-8 h-8 ${isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'}`} />
              ) : (
                <img 
                  src={airdrop.projectLogo} 
                  alt={airdrop.projectName}
                  className="w-full h-full object-cover"
                  onError={handleLogoError}
                />
              )}
            </div>
            
            <div className="flex-1 min-w-0 overflow-hidden">
              <h3 className={`font-mono text-lg font-bold truncate ${
                isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
              }`}>
                {airdrop.projectName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`font-mono text-xs ${getTypeColor(airdrop.type)}`}>
                  {airdrop.type}
                </Badge>
                <Badge variant="outline" className={`font-mono text-xs ${getStatusColor(airdrop.status)}`}>
                  {airdrop.status}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* ACTIONS MENU */}
          <ActionMenu />
        </div>

        {/* Wallet Address - NEW */}
        {airdrop.walletAddress && (
          <div className={`flex items-center gap-2 mb-3 px-2 py-1.5 rounded border ${
            isDark ? 'bg-[#8B5CF6]/5 border-[#8B5CF6]/20' : 'bg-[#4F46E5]/5 border-[#4F46E5]/20'
          }`}>
            <Wallet className={`h-3.5 w-3.5 ${isDark ? 'text-[#8B5CF6]' : 'text-[#4F46E5]'}`} />
            <span className={`font-mono text-xs truncate ${isDark ? 'text-[#8B5CF6]' : 'text-[#4F46E5]'}`}>
              {formatWallet(airdrop.walletAddress)}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {airdrop.platformLink && (
            <a
              href={airdrop.platformLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded border transition-colors ${
                isDark 
                  ? 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20 hover:bg-[#3B82F6]/20' 
                  : 'text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20 hover:bg-[#2563EB]/20'
              }`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              PLATFORM
            </a>
          )}
          {airdrop.twitterUsername && (
            <a
              href={`https://x.com/${airdrop.twitterUsername.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded border transition-colors ${
                isDark 
                  ? 'text-[#00FF88] bg-[#00FF88]/10 border-[#00FF88]/20 hover:bg-[#00FF88]/20' 
                  : 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20 hover:bg-[#10B981]/20'
              }`}
            >
              <Twitter className="h-3.5 w-3.5" />
              @{airdrop.twitterUsername.replace('@', '')}
            </a>
          )}
        </div>

        <div className={`border-t pt-3 ${
          isDark ? 'border-[#1F2937]' : 'border-[#E5E7EB]'
        }`}>
          <div className={`flex items-center justify-between mb-2 font-mono text-sm ${
            isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'
          }`}>
            <span>PROGRESS</span>
            <span className={isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}>{completedTasks}/{airdrop.tasks.length}</span>
          </div>
          
          <div className={`h-2 rounded-full overflow-hidden mb-3 border ${
            isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'
          }`}>
            <div 
              className={`h-full transition-all duration-500 ${
                isDark ? 'bg-[#00FF88]' : 'bg-[#2563EB]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {airdrop.tasks.length > 0 && (
            <div className="space-y-1.5 max-h-28 overflow-y-auto">
              {airdrop.tasks.slice(0, 3).map(task => (
                <button
                  key={task.id}
                  onClick={() => onToggleTask(airdrop.id, task.id)}
                  className={`flex items-center gap-2 w-full text-left text-sm font-mono rounded px-1.5 py-1 transition-colors ${
                    isDark ? 'hover:bg-[#00FF88]/10' : 'hover:bg-[#2563EB]/10'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${
                      isDark ? 'text-[#00FF88]' : 'text-[#10B981]'
                    }`} />
                  ) : (
                    <Circle className={`h-4 w-4 flex-shrink-0 ${
                      isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'
                    }`} />
                  )}
                  <span className={`truncate ${
                    task.completed 
                      ? (isDark ? 'line-through text-[#6B7280]' : 'line-through text-[#9CA3AF]') 
                      : (isDark ? 'text-[#E5E7EB]' : 'text-[#374151]')
                  }`}>
                    {task.title}
                  </span>
                </button>
              ))}
              {airdrop.tasks.length > 3 && (
                <p className={`text-xs font-mono pl-6 pt-1 ${
                  isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'
                }`}>
                  +{airdrop.tasks.length - 3} MORE_TASKS
                </p>
              )}
            </div>
          )}
        </div> 
      </CardContent>
    </Card>
  );
}