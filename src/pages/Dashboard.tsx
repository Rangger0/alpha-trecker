// ALPHA TRECKER - Dashboard (FIXED)
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
} from "lucide-react";
import { AirdropModal } from "@/components/modals/AirdropModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { Footer } from "@/sections/Footer";
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
    dark: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    light: 'bg-purple-100 text-purple-700 border-purple-300'
  },
  'AI': { 
    dark: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    light: 'bg-cyan-100 text-cyan-700 border-cyan-300'
  },
  'Quest': { 
    dark: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    light: 'bg-orange-100 text-orange-700 border-orange-300'
  },
  'Daily': { 
    dark: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    light: 'bg-pink-100 text-pink-700 border-pink-300'
  },
  'Daily Quest': { 
    dark: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    light: 'bg-pink-100 text-pink-700 border-pink-300'
  },
  'Retro': { 
    dark: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    light: 'bg-amber-100 text-amber-700 border-amber-300'
  },
  'Waitlist': { 
    dark: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    light: 'bg-indigo-100 text-indigo-700 border-indigo-300'
  },
  'Depin': { 
    dark: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    light: 'bg-teal-100 text-teal-700 border-teal-300'
  },
  'NFT': { 
    dark: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    light: 'bg-rose-100 text-rose-700 border-rose-300'
  },
  'Domain Name': { 
    dark: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    light: 'bg-rose-100 text-rose-700 border-rose-300'
  },
  'Deploy SC': { 
    dark: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    light: 'bg-orange-100 text-orange-700 border-orange-300'
  },
  'DeFi': { 
    dark: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    light: 'bg-orange-100 text-orange-700 border-orange-300'
  },
  'Deploy NFT': { 
    dark: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    light: 'bg-rose-100 text-rose-700 border-rose-300'
  },
};

const STATUS_COLORS: Record<string, { dark: string; light: string }> = {
  'Planning': { 
    dark: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    light: 'bg-gray-200 text-gray-700 border-gray-400'
  },
  'Ongoing': { 
    dark: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    light: 'bg-blue-100 text-blue-700 border-blue-300'
  },
  'Done': { 
    dark: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    light: 'bg-emerald-100 text-emerald-700 border-emerald-300'
  },
  'Dropped': { 
    dark: 'bg-red-500/10 text-red-400 border-red-500/20',
    light: 'bg-red-100 text-red-700 border-red-300'
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
      isDark ? 'text-[#00ff00]' : 'text-gray-700'
    }`}>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 animate-pulse" />
        <span className="text-lg font-bold tracking-wider">
          {formatTime(time)}
        </span>
      </div>
      <span className={`text-xs ${
        isDark ? 'text-[#00ff00]/60' : 'text-gray-500'
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
        a.twitterUsername.toLowerCase().includes(query)
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
      isDark ? 'bg-[#0a0a0f] text-[#00ff00]' : 'bg-[#f5f5f0] text-[#1a1a1a]'
    }`}>
      {/* Navbar - Hanya ada NEW PROJECT, TIDAK ADA EDIT */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        isDark 
          ? 'bg-[#0a0a0f]/95 border-[#00ff00]/30' 
          : 'bg-[#f5f5f0]/95 border-gray-300'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Add Button */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded flex items-center justify-center border-2 ${
                  isDark ? 'bg-[#00ff00]/10 border-[#00ff00] text-[#00ff00]' : 'bg-gray-800 border-gray-800 text-white'
                }`}>
                  <Terminal className="w-6 h-6" />
                </div>
                <span className={`text-xl font-bold tracking-tighter hidden sm:block ${
                  isDark ? 'text-white' : 'text-gray-90'
                }`}>
                  <span className={isDark ? 'text-[#00ff00]' : 'text-gray-900'}>ALPHA</span>
                  <span className={isDark ? 'text-white' : 'text-gray-600'}>_TRACKER</span>
                  <span className={isDark ? 'text-[#00ff00] animate-pulse' : 'text-gray-400'}>_</span>
                </span>
              </div>

              <div className={`h-8 w-px hidden md:block ${
                isDark ? 'bg-[#00ff00]/30' : 'bg-gray-300'
              }`} />

              {/* HANYA TOMBOL NEW PROJECT DI NAVBAR */}
              <Button 
                onClick={() => setIsAddModalOpen(true)} 
                className={`font-mono text-sm border-2 transition-all duration-200 ${
                  isDark 
                    ? 'bg-transparent border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,0,0.4)]' 
                    : 'bg-gray-800 border-gray-800 text-white hover:bg-gray-700'
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
                isDark ? 'bg-[#00ff00]/30' : 'bg-gray-300'
              }`} />

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className={`border transition-colors ${
                  isDark 
                    ? 'text-[#00ff00] border-[#00ff00]/30 hover:bg-[#00ff00]/10' 
                    : 'text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <div className={`hidden md:flex items-center gap-3 px-4 py-2 rounded border ${
                isDark 
                  ? 'bg-[#0f0f14] border-[#00ff00]/20 text-[#00ff00]' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}>
                <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
                  isDark ? 'bg-[#00ff00]/20 text-[#00ff00]' : 'bg-gray-200 text-gray-700'
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
                    ? 'text-red-400 border-red-400/30 hover:bg-red-400/10' 
                    : 'text-red-600 border-red-300 hover:bg-red-50'
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
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {isDark ? '> DASHBOARD.exe' : 'DASHBOARD'}
          </h1>
          <p className={`mt-1 font-mono text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-300'
          }`}>
            {isDark ? `root@alpha-tracker:~$ track --airdrops --all [${airdrops.length}]` : `Track and manage your airdrop portfolio • ${airdrops.length} projects`}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'TOTAL_PROJECTS', value: airdrops.length, icon: Layers, color: isDark ? 'text-[#00ff00]' : 'text-gray-700' },
            { label: 'ACTIVE_NODES', value: airdrops.filter(a => a.status === 'Ongoing').length, icon: TrendingUp, color: isDark ? 'text-blue-400' : 'text-blue-600' },
            { label: 'COMPLETED', value: airdrops.filter(a => a.status === 'Done').length, icon: CheckCircle, color: isDark ? 'text-emerald-400' : 'text-emerald-600' },
            { label: 'DROPPED', value: airdrops.filter(a => a.status === 'Dropped').length, icon: XCircle, color: isDark ? 'text-red-400' : 'text-red-600' },
          ].map((stat, idx) => (
            <Card key={idx} className={`border-2 transition-all duration-300 ${
              isDark 
                ? 'bg-[#0f0f14] border-[#00ff00]/20 hover:border-[#00ff00]/50' 
                : 'bg-white border-gray-300 hover:border-gray-400'
            }`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-mono mb-1 ${
                      isDark ? 'text-gray-500' : 'text-gray-500'
                    }`}>{stat.label}</p>
                    <p className={`text-3xl font-bold font-mono ${stat.color}`}>
                      {String(stat.value).padStart(2, '0')}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded flex items-center justify-center ${
                    isDark ? 'bg-[#00ff00]/5 border border-[#00ff00]/20' : 'bg-gray-100 border border-gray-200'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className={`border-2 mb-6 ${
          isDark 
            ? 'bg-[#0f0f14] border-[#00ff00]/20' 
            : 'bg-white border-gray-300'
        }`}>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                  isDark ? 'text-[#00ff00]/50' : 'text-gray-400'
                }`} />
                <Input
                  placeholder={isDark ? "> search --projects..." : "Search projects..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 font-mono border-2 ${
                    isDark 
                      ? 'bg-[#0a0a0f] border-[#00ff00]/30 text-[#00ff00] placeholder:text-[#00ff00]/30 focus:border-[#00ff00]' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-900'
                  }`}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AirdropType | 'all')}>
                  <SelectTrigger className={`w-[140px] font-mono border-2 ${
                    isDark 
                      ? 'bg-[#0a0a0f] border-[#00ff00]/30 text-[#00ff00]' 
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}>
                    <Filter className={`h-4 w-4 mr-2 ${isDark ? 'text-[#00ff00]/50' : 'text-gray-400'}`} />
                    <SelectValue placeholder="TYPE" />
                  </SelectTrigger>
                  <SelectContent className={`font-mono border-2 ${
                    isDark 
                      ? 'bg-[#0f0f14] border-[#00ff00]/30' 
                      : 'bg-white border-gray-300'
                  }`}>
                    <SelectItem value="all" className={isDark ? 'text-[#00ff00]' : 'text-gray-700'}>ALL_TYPES</SelectItem>
                    {AIRDROP_TYPES.map(type => (
                      <SelectItem key={type} value={type} className={isDark ? 'text-[#00ff00]' : 'text-gray-700'}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AirdropStatus | 'all')}>
                  <SelectTrigger className={`w-[140px] font-mono border-2 ${
                    isDark 
                      ? 'bg-[#0a0a0f] border-[#00ff00]/30 text-[#00ff00]' 
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}>
                    <SelectValue placeholder="STATUS" />
                  </SelectTrigger>
                  <SelectContent className={`font-mono border-2 ${
                    isDark 
                      ? 'bg-[#0f0f14] border-[#00ff00]/30' 
                      : 'bg-white border-gray-300'
                  }`}>
                    <SelectItem value="all" className={isDark ? 'text-[#00ff00]' : 'text-gray-700'}>ALL_STATUS</SelectItem>
                    {AIRDROP_STATUSES.map(status => (
                      <SelectItem key={status} value={status} className={isDark ? 'text-[#00ff00]' : 'text-gray-700'}>
                        {status.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className={`flex rounded border-2 p-1 ${
                  isDark 
                    ? 'bg-[#0a0a0f] border-[#00ff00]/30' 
                    : 'bg-gray-100 border-gray-300'
                }`}>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className={`rounded font-mono ${
                      viewMode === 'grid' 
                        ? (isDark ? 'bg-[#00ff00] text-black hover:bg-[#00ff00]/90' : 'bg-gray-800 text-white hover:bg-gray-700')
                        : (isDark ? 'text-[#00ff00] hover:bg-[#00ff00]/10' : 'text-gray-600 hover:bg-gray-200')
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
                        ? (isDark ? 'bg-[#00ff00] text-black hover:bg-[#00ff00]/90' : 'bg-gray-800 text-white hover:bg-gray-700')
                        : (isDark ? 'text-[#00ff00] hover:bg-[#00ff00]/10' : 'text-gray-600 hover:bg-gray-200')
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
          <Card className={`border-2 ${
            isDark 
              ? 'bg-[#0f0f14] border-[#00ff00]/20' 
              : 'bg-white border-gray-300'
          }`}>
            <CardContent className="p-12 text-center">
              <Terminal className={`h-16 w-16 mx-auto mb-4 ${
                isDark ? 'text-[#00ff00]/30' : 'text-gray-300'
              }`} />
              <h3 className={`text-xl font-mono font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {isDark ? '> NO_DATA_FOUND' : 'No airdrops found'}
              </h3>
              <p className={`font-mono text-sm mb-4 ${
                isDark ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {isDark ? 'Initialize new project tracking...' : 'Start tracking your first airdrop campaign'}
              </p>
              <Button 
                onClick={() => setIsAddModalOpen(true)} 
                className={`font-mono border-2 ${
                  isDark 
                    ? 'bg-[#00ff00] text-black border-[#00ff00] hover:bg-[#00ff00]/90' 
                    : 'bg-gray-800 text-white border-gray-800 hover:bg-gray-600'
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

      <Footer />

{isAddModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div 
      className="absolute inset-0 bg-transparent"
      onClick={() => setIsAddModalOpen(false)}
    />
    <div 
      className={`relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg ${
        isDark ? 'bg-[#3a3a3e27] border-0' : 'bg-white border-0'
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
      className="absolute inset-0 bg-transparent"
      onClick={() => setEditingAirdrop(null)}
    />
    <div 
      className={`relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg ${
        isDark ? 'bg-[#0a0a0f] border-0' : 'bg-white border-0'
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
      className={`absolute inset-0 ${isDark ? 'bg-[#0a0a0f]/0' : 'bg-gray-9'}`}
      onClick={() => setDeletingAirdrop(null)}
    />
    <div className={`relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border-2 ${
      isDark ? 'bg-[#09090d00] border-[#90909000]' : 'bg-white border-gray-400'
    }`}>
          <DeleteConfirmModal 
        isOpen={!!deletingAirdrop} 
        onClose={() => setDeletingAirdrop(null)} 
        onConfirm={handleDeleteAirdrop} 
        projectName={deletingAirdrop?.projectName}
      />
    </div>
  </div>
)}
 </div> 
  );
}

// AIRDROP CARD COMPONENT - EDIT ADA DI SINI (DROPDOWN MENU)
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
            ? 'text-[#00ff00] border-[#00ff00]/30 hover:bg-[#00ff00]/10' 
            : 'text-gray-600 border-gray-300 hover:bg-gray-100'
        }`}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
      
      {isMenuOpen && (
        <div 
          className={`absolute right-0 top-full mt-1 w-32 rounded-md border-2 shadow-lg z-50 ${
            isDark 
              ? 'bg-[#0f0f14] border-[#00ff00]/30' 
              : 'bg-white border-gray-300'
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
                ? 'text-[#00ff00] hover:bg-[#00ff00]/10' 
                : 'text-gray-700 hover:bg-gray-100'
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
                ? 'text-red-400 hover:bg-red-400/10' 
                : 'text-red-600 hover:bg-red-50'
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
      <Card className={`border-2 transition-all duration-300 ${
        isDark 
          ? 'bg-[#0f0f14] border-[#00ff00]/20 hover:border-[#00ff00]/50' 
          : 'bg-white border-gray-300 hover:border-gray-500'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className={`w-12 h-12 rounded flex-shrink-0 overflow-hidden border-2 flex items-center justify-center ${
              isDark ? 'bg-[#0a0a0f] border-[#00ff00]/30' : 'bg-gray-100 border-gray-300'
            }`}>
              {hasLogoError ? (
                <PlaceholderLogo className={`w-8 h-8 ${isDark ? 'text-[#00ff00]/50' : 'text-gray-400'}`} />
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
                  isDark ? 'text-[#00ff00]' : 'text-gray-90'
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

              {/* Progress */}
              <div className="mt-2">
                <div className={`flex items-center justify-between text-xs font-mono mb-1 ${
                  isDark ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  <span>PROGRESS</span>
                  <span className={isDark ? 'text-[#00ff00]' : 'text-gray-90'}>
                    {completedTasks}/{airdrop.tasks.length}
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden w-full max-w-[200px] border ${
                  isDark ? 'bg-[#0a0a0f] border-[#00ff00]/20' : 'bg-gray-200 border-gray-300'
                }`}>
                  <div 
                    className={`h-full transition-all duration-500 ${
                      isDark ? 'bg-[#00ff00]' : 'bg-gray-800'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className={`flex items-center gap-4 mt-2 text-sm font-mono ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {airdrop.twitterUsername && (
                  <a
                    href={`https://x.com/${airdrop.twitterUsername.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1 hover:underline ${
                      isDark ? 'hover:text-[#00ff00]' : 'hover:text-gray-90'
                    }`}
                  >
                    <Twitter className="h-3.5 w-3.5" />
                    @{airdrop.twitterUsername.replace('@', '')}
                  </a>
                )}
              </div>
            </div>

            {/* ACTIONS MENU - CUSTOM DROPDOWN */}
            <ActionMenu />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // GRID VIEW
  return (
    <Card className={`border-2 transition-all duration-300 overflow-hidden ${
      isDark 
        ? 'bg-[#0f0f14] border-[#00ff00]/20 hover:border-[#00ff00]/50' 
        : 'bg-white border-gray-300 hover:border-gray-400'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-12 h-12 rounded flex-shrink-0 overflow-hidden border-2 flex items-center justify-center ${
              isDark ? 'bg-[#0a0a0f] border-[#00ff00]/30' : 'bg-gray-100 border-gray-300'
            }`}>
              {hasLogoError ? (
                <PlaceholderLogo className={`w-8 h-8 ${isDark ? 'text-[#00ff00]/50' : 'text-gray-400'}`} />
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
                isDark ? 'text-[#00ff00]' : 'text-gray-90'
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
          
          {/* ACTIONS MENU - CUSTOM DROPDOWN */}
          <ActionMenu />
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {airdrop.platformLink && (
            <a
              href={airdrop.platformLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded border transition-colors ${
                isDark 
                  ? 'text-[#00ff00] bg-[#00ff00]/10 border-[#00ff00]/30 hover:bg-[#00ff00]/20' 
                  : 'text-gray-700 bg-gray-100 border-gray-300 hover:bg-gray-200'
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
                  ? 'text-[#00ff00] bg-[#00ff00]/10 border-[#00ff00]/30 hover:bg-[#00ff00]/20' 
                  : 'text-gray-700 bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
            >
              <Twitter className="h-3.5 w-3.5" />
              @{airdrop.twitterUsername.replace('@', '')}
            </a>
          )}
        </div>

        <div className={`border-t pt-3 ${
          isDark ? 'border-[#00ff00]/20' : 'border-gray-200'
        }`}>
          <div className={`flex items-center justify-between mb-2 font-mono text-sm ${
            isDark ? 'text-[#00ff00]' : 'text-gray-700'
          }`}>
            <span>PROGRESS</span>
            <span>{completedTasks}/{airdrop.tasks.length}</span>
          </div>
          
          <div className={`h-2 rounded-full overflow-hidden mb-3 border ${
            isDark ? 'bg-[#0a0a0f] border-[#00ff00]/20' : 'bg-gray-200 border-gray-300'
          }`}>
            <div 
              className={`h-full transition-all duration-500 ${
                isDark ? 'bg-[#00ff00]' : 'bg-gray-800'
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
                    isDark ? 'hover:bg-[#00ff00]/10' : 'hover:bg-gray-100'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${
                      isDark ? 'text-[#00ff00]' : 'text-gray-800'
                    }`} />
                  ) : (
                    <Circle className={`h-4 w-4 flex-shrink-0 ${
                      isDark ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                  )}
                  <span className={`truncate ${
                    task.completed 
                      ? (isDark ? 'line-through text-gray-600' : 'line-through text-gray-400') 
                      : (isDark ? 'text-gray-300' : 'text-gray-700')
                  }`}>
                    {task.title}
                  </span>
                </button>
              ))}
              {airdrop.tasks.length > 3 && (
                <p className={`text-xs font-mono pl-6 pt-1 ${
                  isDark ? 'text-[#00ff00]/50' : 'text-gray-500'
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