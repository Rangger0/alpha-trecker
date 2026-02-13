// ALPHA TRECKER - Dashboard

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Wallet,
  Sun,
  Moon,
  LogOut,
  Target,
  LayoutGrid,
  List
} from 'lucide-react';
import { AirdropModal } from '@/components/modals/AirdropModal';
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';
import { Footer } from '@/sections/Footer';
import type { Airdrop, AirdropType, AirdropStatus } from '@/types';
import { 
  getAirdropsByUserId, 
  createAirdrop, 
  updateAirdrop, 
  deleteAirdrop,
  toggleTask 
} from '@/services/database';

const AIRDROP_TYPES: AirdropType[] = [
  'Testnet', 'AI', 'Quest', 'Daily', 'Daily Quest', 
  'Retro', 'Waitlist', 'Depin', 'NFT', 'Domain Name', 
  'Deploy SC', 'DeFi', 'Deploy NFT'
];

const AIRDROP_STATUSES: AirdropStatus[] = ['Planning', 'Ongoing', 'Done', 'Dropped'];

const TYPE_BADGE_MAP: Record<AirdropType, string> = {
  'Testnet': 'badge-testnet',
  'AI': 'badge-ai',
  'Quest': 'badge-quest',
  'Daily': 'badge-daily',
  'Daily Quest': 'badge-daily',
  'Retro': 'badge-retro',
  'Waitlist': 'badge-waitlist',
  'Depin': 'badge-depin',
  'NFT': 'badge-nft',
  'Domain Name': 'badge-nft',
  'Deploy SC': 'badge-defi',
  'DeFi': 'badge-defi',
  'Deploy NFT': 'badge-nft',
};

const STATUS_BADGE_MAP: Record<AirdropStatus, string> = {
  'Planning': 'badge-planning',
  'Ongoing': 'badge-ongoing',
  'Done': 'badge-done',
  'Dropped': 'badge-dropped',
};

export function Dashboard() {
  const { session, logout } = useAuth();
  const user = session?.user;
  const { theme, toggleTheme } = useTheme();
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<AirdropType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AirdropStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'progress'>('newest');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAirdrop, setEditingAirdrop] = useState<Airdrop | null>(null);
  const [deletingAirdrop, setDeletingAirdrop] = useState<Airdrop | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);

      if (!user) {
        setAirdrops([]);
        return;
      }

      const data = getAirdropsByUserId(user.id);
      setAirdrops(data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [user]);

  const filteredAirdrops = useMemo(() => {
    let result = [...airdrops];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.projectName.toLowerCase().includes(query) ||
        a.twitterUsername.toLowerCase().includes(query)
      );
    }
    
    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(a => a.type === typeFilter);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(a => a.status === statusFilter);
    }
    
    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'progress') {
      result.sort((a, b) => {
        const progressA = a.tasks.length > 0 
          ? (a.tasks.filter(t => t.completed).length / a.tasks.length) 
          : 0;
        const progressB = b.tasks.length > 0 
          ? (b.tasks.filter(t => t.completed).length / b.tasks.length) 
          : 0;
        return progressB - progressA;
      });
    }
    
    return result;
  }, [airdrops, searchQuery, typeFilter, statusFilter, sortBy]);

  const handleAddAirdrop = (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    const newAirdrop = createAirdrop({
      ...data,
      userId: user.id,
    });
  
    console.log("NEW AIRDROP", newAirdrop);
    console.log("SUBMIT CLICKED");

    setAirdrops(prev => [newAirdrop, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleEditAirdrop = (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!editingAirdrop) return;
    
    const updated = updateAirdrop(editingAirdrop.id, data);
    if (updated) {
      setAirdrops(prev => prev.map(a => a.id === updated.id ? updated : a));
    }
    setEditingAirdrop(null);
  };

  const handleDeleteAirdrop = () => {
    if (!deletingAirdrop) return;
    
    const success = deleteAirdrop(deletingAirdrop.id);
    if (success) {
      setAirdrops(prev => prev.filter(a => a.id !== deletingAirdrop.id));
    }
    setDeletingAirdrop(null);
  };

  const handleToggleTask = (airdropId: string, taskId: string) => {
    const updatedTask = toggleTask(airdropId, taskId);
    if (updatedTask) {
      setAirdrops(prev => prev.map(a => {
        if (a.id === airdropId) {
          return {
            ...a,
            tasks: a.tasks.map(t => t.id === taskId ? updatedTask : t)
          };
        }
        return a;
      }));
    }
  };

  const getProgress = (airdrop: Airdrop) => {
    if (airdrop.tasks.length === 0) return 0;
    return Math.round((airdrop.tasks.filter(t => t.completed).length / airdrop.tasks.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image - Yakuza Oni Mask */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: 'url(/bg-yakuza.jpg)' }}
      />
      
      {/* Simple Overlay - No blur for performance */}
      <div className={`fixed inset-0 -z-10 transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-black/80' 
          : 'bg-white/70'
      }`} />
      
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 border-b border-red-500/20 ${
        theme === 'dark'
          ? 'bg-black/70'
          : 'bg-white/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo-flat.png" 
                alt="ALPHA TRECKER" 
                className="w-10 h-10"
              />
              <span className="font-bold text-xl tracking-wider hidden sm:block">
                ALPHA TRECKER
              </span>
            </div>
            
            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              
              {/* User Info */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
              
              {/* Logout */}
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your airdrop campaigns
            </p>
          </div>
          
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Airdrop
          </Button>
        </div>

        {/* Filters */}
        <Card className="glass-card mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AirdropType | 'all')}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {AIRDROP_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AirdropStatus | 'all')}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {AIRDROP_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'newest' | 'progress')}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* View Mode Toggle */}
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{airdrops.length}</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Ongoing</p>
              <p className="text-2xl font-bold text-blue-500">
                {airdrops.filter(a => a.status === 'Ongoing').length}
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Done</p>
              <p className="text-2xl font-bold text-green-500">
                {airdrops.filter(a => a.status === 'Done').length}
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Dropped</p>
              <p className="text-2xl font-bold text-red-500">
                {airdrops.filter(a => a.status === 'Dropped').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Airdrops Grid/List */}
        {filteredAirdrops.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No airdrops found</h3>
              <p className="text-muted-foreground mb-4">
                {airdrops.length === 0 
                  ? "Start tracking your first airdrop campaign"
                  : "No airdrops match your filters"
                }
              </p>
              {airdrops.length === 0 && (
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Airdrop
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "flex flex-col gap-3"
          }>
            {filteredAirdrops.map((airdrop) => (
              <AirdropCard
                key={airdrop.id}
                airdrop={airdrop}
                viewMode={viewMode}
                onEdit={() => setEditingAirdrop(airdrop)}
                onDelete={() => setDeletingAirdrop(airdrop)}
                onToggleTask={handleToggleTask}
                getProgress={getProgress}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AirdropModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAirdrop}
        mode="add"
      />
      
      <AirdropModal
        isOpen={!!editingAirdrop}
        onClose={() => setEditingAirdrop(null)}
        onSubmit={handleEditAirdrop}
        mode="edit"
        airdrop={editingAirdrop}
      />
      
      <DeleteConfirmModal
        isOpen={!!deletingAirdrop}
        onClose={() => setDeletingAirdrop(null)}
        onConfirm={handleDeleteAirdrop}
        projectName={deletingAirdrop?.projectName}
      />
    </div>
  );
}

// Airdrop Card Component
interface AirdropCardProps {
  airdrop: Airdrop;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
  onDelete: () => void;
  onToggleTask: (airdropId: string, taskId: string) => void;
  getProgress: (airdrop: Airdrop) => number;
}

function AirdropCard({ airdrop, viewMode, onEdit, onDelete, onToggleTask, getProgress }: AirdropCardProps) {
  const progress = getProgress(airdrop);
  const completedTasks = airdrop.tasks.filter(t => t.completed).length;
  
  if (viewMode === 'list') {
    return (
      <Card className="glass-card hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <img 
              src={airdrop.projectLogo || '/logo-flat.png'} 
              alt={airdrop.projectName}
              className="w-12 h-12 rounded-lg object-cover"
            />
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold truncate">{airdrop.projectName}</h3>
                <Badge variant="outline" className={TYPE_BADGE_MAP[airdrop.type]}>
                  {airdrop.type}
                </Badge>
                <Badge variant="outline" className={STATUS_BADGE_MAP[airdrop.status]}>
                  {airdrop.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                {airdrop.twitterUsername && (
                  <a 
                    href={`https://x.com/${airdrop.twitterUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    <Twitter className="h-3 w-3" />
                    @{airdrop.twitterUsername}
                  </a>
                )}
                {airdrop.walletAddress && (
                  <span className="flex items-center gap-1">
                    <Wallet className="h-3 w-3" />
                    {airdrop.walletAddress.slice(0, 6)}...{airdrop.walletAddress.slice(-4)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Progress */}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{progress}%</p>
              <p className="text-xs text-muted-foreground">
                {completedTasks}/{airdrop.tasks.length} tasks
              </p>
            </div>
            
            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onDelete}
                  className="text-red-500 focus:text-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass-card hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={airdrop.projectLogo || '/logo-flat.png'} 
              alt={airdrop.projectName}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold">{airdrop.projectName}</h3>
              <div className="flex gap-1 mt-1">
                <Badge variant="outline" className={`text-xs ${TYPE_BADGE_MAP[airdrop.type]}`}>
                  {airdrop.type}
                </Badge>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-red-500 focus:text-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Status */}
        <div className="mb-4">
          <Badge variant="outline" className={STATUS_BADGE_MAP[airdrop.status]}>
            {airdrop.status}
          </Badge>
        </div>
        
        {/* Links */}
        <div className="flex flex-wrap gap-2 mb-4">
          {airdrop.platformLink && (
            <a 
              href={airdrop.platformLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Platform
            </a>
          )}
          {airdrop.twitterUsername && (
            <a 
              href={`https://x.com/${airdrop.twitterUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Twitter className="h-3 w-3" />
              @{airdrop.twitterUsername}
            </a>
          )}
        </div>
        
        {/* Progress */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedTasks}/{airdrop.tasks.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Tasks */}
          {airdrop.tasks.length > 0 && (
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {airdrop.tasks.slice(0, 3).map(task => (
                <button
                  key={task.id}
                  onClick={() => onToggleTask(airdrop.id, task.id)}
                  className="flex items-center gap-2 w-full text-left text-sm hover:bg-muted/50 rounded px-1 py-0.5 transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={task.completed ? 'line-through text-muted-foreground' : 'truncate'}>
                    {task.title}
                  </span>
                </button>
              ))}
              {airdrop.tasks.length > 3 && (
                <p className="text-xs text-muted-foreground pl-6">
                  +{airdrop.tasks.length - 3} more tasks
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
