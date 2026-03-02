// MultipleAccountPage.tsx
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Users, 
  Plus, 
  Trash2, 
  X,
  ChevronDown,
  Wallet,
  Loader2
} from 'lucide-react';
import { useAirdrops } from '@/hooks/use-airdrops';
import { supabase } from '@/lib/supabase';
import type { Airdrop } from '@/types';

// Placeholder logo component
const PlaceholderLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="8" fill="currentColor" fillOpacity="0.1"/>
    <path d="M24 14L32 34H16L24 14Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="24" cy="28" r="3" fill="currentColor"/>
  </svg>
);

const formatWallet = (address: string) => {
  if (!address) return '';
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

interface WalletEntry {
  id: string;
  address: string;
  label?: string;
}

interface AccountEntry {
  id: string;
  projectId: string;
  projectName: string;
  projectLogo?: string;
  type: string;
  status: string;
  wallets: WalletEntry[];
  createdAt: string;
}

export function MultipleAccountPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { airdrops } = useAirdrops();
  const [searchQuery, setSearchQuery] = useState('');
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Accounts state from Supabase
  const [accounts, setAccounts] = useState<AccountEntry[]>([]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Airdrop | null>(null);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  
  // Multiple wallets in one form
  const [walletEntries, setWalletEntries] = useState<{ address: string; label: string }[]>([
    { address: '', label: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user and fetch accounts
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchAccounts();
    }
  }, [currentUserId]);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('multi_accounts')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by project_id
      const grouped = (data || []).reduce((acc: Record<string, AccountEntry>, item: any) => {
        if (!acc[item.project_id]) {
          acc[item.project_id] = {
            id: item.project_id,
            projectId: item.project_id,
            projectName: item.project_name,
            projectLogo: item.project_logo,
            type: item.type,
            status: item.status,
            wallets: [],
            createdAt: item.created_at,
          };
        }
        acc[item.project_id].wallets.push({
          id: item.id,
          address: item.wallet_address,
          label: item.wallet_label,
        });
        return acc;
      }, {});

      setAccounts(Object.values(grouped));
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoError = (id: string) => {
    setLogoError(prev => ({ ...prev, [id]: true }));
  };

  // Get available projects
  const availableProjects = airdrops;

  // Filter accounts based on search
  const filteredAccounts = accounts.filter((account) =>
    account.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.wallets.some(w => 
      w.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.label?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const addWalletField = () => {
    setWalletEntries([...walletEntries, { address: '', label: '' }]);
  };

  const removeWalletField = (index: number) => {
    if (walletEntries.length > 1) {
      setWalletEntries(walletEntries.filter((_, i) => i !== index));
    }
  };

  const updateWalletField = (index: number, field: 'address' | 'label', value: string) => {
    const newEntries = [...walletEntries];
    newEntries[index][field] = value;
    setWalletEntries(newEntries);
  };

  const handleAdd = async () => {
    if (!selectedProject || !currentUserId) return;
    
    // Filter out empty addresses
    const validWallets = walletEntries.filter(w => w.address.trim() !== '');
    if (validWallets.length === 0) return;

    setIsSubmitting(true);

    try {
      // Insert all wallets for this project
      const inserts = validWallets.map(wallet => ({
        user_id: currentUserId,
        project_id: selectedProject.id,
        project_name: selectedProject.projectName,
        project_logo: selectedProject.projectLogo,
        type: selectedProject.type,
        status: selectedProject.status,
        wallet_address: wallet.address.trim(),
        wallet_label: wallet.label.trim() || null,
      }));

      const { error } = await supabase
        .from('multi_accounts')
        .insert(inserts);

      if (error) throw error;

      // Refresh accounts
      await fetchAccounts();
      
      // Reset form
      setIsAddModalOpen(false);
      setSelectedProject(null);
      setWalletEntries([{ address: '', label: '' }]);
    } catch (error) {
      console.error('Error adding accounts:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (walletId: string) => {
    if (!confirm('Delete this wallet?')) return;

    try {
      const { error } = await supabase
        .from('multi_accounts')
        .delete()
        .eq('id', walletId)
        .eq('user_id', currentUserId);

      if (error) throw error;

      // Refresh accounts
      await fetchAccounts();
    } catch (error) {
      console.error('Error deleting wallet:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Delete all wallets for this project?')) return;

    try {
      const { error } = await supabase
        .from('multi_accounts')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', currentUserId);

      if (error) throw error;

      await fetchAccounts();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return isDark ? 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/20' : 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20';
      case 'Ongoing':
        return isDark ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20' : 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20';
      case 'Dropped':
        return isDark ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' : 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20';
      default:
        return isDark ? 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20' : 'bg-[#374151]/10 text-[#374151] border-[#374151]/20';
    }
  };

  const getTypeColor = (type: string) => {
    return isDark ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20' : 'bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/20';
  };

  // Card styling seperti AboutPage
  const cardBaseClasses = `relative p-6 rounded-xl border transition-all duration-300 ease-out overflow-hidden group`;
  
  const cardThemeClasses = isDark 
    ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]' 
    : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]';

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-[#00FF88]/10' : 'bg-[#2563EB]/10'}`}>
                <Users className={`w-5 h-5 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`} />
              </div>
              <h1 className={`text-2xl font-bold font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                Multiple Account Management
              </h1>
            </div>
            <p className={`font-mono text-sm ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
              {accounts.reduce((acc, a) => acc + a.wallets.length, 0)} wallets across {accounts.length} projects
            </p>
          </div>
          
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className={`font-mono border-2 transition-all duration-200 ${
              isDark 
                ? 'bg-transparent border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88] hover:text-[#0B0F14]' 
                : 'bg-transparent border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white'
            }`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md group">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-[#6B7280] group-focus-within:text-[#00FF88]' : 'text-[#6B7280] group-focus-within:text-[#2563EB]'}`} />
            <Input 
              placeholder="Search projects or accounts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 font-mono border transition-all duration-200 ${
                isDark 
                  ? 'bg-[#161B22] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88]/20' 
                  : 'bg-white border-[#E5E7EB] text-[#111827] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20'
              }`}
            />
          </div>
        </div>

        {/* Accounts Grid - Grouped by Project */}
        {filteredAccounts.length === 0 ? (
          <Card className={`${cardBaseClasses} ${cardThemeClasses}`}>
            <CardContent className="p-12 text-center relative">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-[#0B0F14]' : 'bg-[#F3F4F6]'}`}>
                <Users className={`w-8 h-8 ${isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'}`} />
              </div>
              <h3 className={`font-mono font-bold mb-2 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                No accounts found
              </h3>
              <p className={`font-mono text-sm mb-4 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                {searchQuery ? 'No accounts match your search.' : 'Add your first account to track multiple entries.'}
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
                Add Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredAccounts.map((account) => {
              const isHovered = hoveredCard === account.projectId;
              
              return (
                <div 
                  key={account.projectId} 
                  className={`${cardBaseClasses} ${cardThemeClasses}`}
                  onMouseEnter={() => setHoveredCard(account.projectId)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Animated gradient seperti AboutPage */}
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${isDark ? 'from-[#00FF88]/20 via-transparent to-[#00FF88]/20' : 'from-[#2563EB]/20 via-transparent to-[#2563EB]/20'}`} />
                  
                  {/* Project Header */}
                  <div className="flex items-start gap-4 mb-6 relative">
                    <div className={`w-14 h-14 rounded-xl overflow-hidden border flex-shrink-0 transition-transform duration-300 ${isHovered ? 'scale-110' : ''} ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'}`}>
                      {account.projectLogo && !logoError[account.projectId] ? (
                        <img 
                          src={account.projectLogo} 
                          alt={account.projectName}
                          className="w-full h-full object-cover"
                          onError={() => handleLogoError(account.projectId)}
                        />
                      ) : (
                        <PlaceholderLogo className={`w-full h-full p-3 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className={`font-mono font-bold text-lg transition-colors ${isDark ? 'text-[#E5E7EB] group-hover:text-[#00FF88]' : 'text-[#111827] group-hover:text-[#2563EB]'}`}>
                          {account.projectName}
                        </h3>
                        <Badge variant="outline" className={`text-xs font-mono ${getTypeColor(account.type)}`}>
                          {account.type}
                        </Badge>
                        <Badge variant="outline" className={`text-xs font-mono ${getStatusColor(account.status)}`}>
                          {account.status}
                        </Badge>
                        <span className={`text-xs font-mono px-2 py-1 rounded-full ${isDark ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'bg-[#2563EB]/10 text-[#2563EB]'}`}>
                          {account.wallets.length} wallets
                        </span>
                      </div>
                    </div>

                    {/* Delete Project Button */}
                    <button
                      onClick={() => handleDeleteProject(account.projectId)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10' 
                          : 'text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#DC2626]/10'
                      }`}
                      title="Delete all wallets"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Wallets List */}
                  <div className="space-y-3 relative">
                    {account.wallets.map((wallet, idx) => (
                      <div 
                        key={wallet.id}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                          isDark 
                            ? 'bg-[#0B0F14] border-[#1F2937] hover:border-[#00FF88]/30' 
                            : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#2563EB]/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-mono font-bold ${isDark ? 'bg-[#161B22] text-[#00FF88]' : 'bg-white text-[#2563EB]'}`}>
                            #{idx + 1}
                          </div>
                          <div>
                            {wallet.label && (
                              <p className={`font-mono text-xs mb-1 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>
                                {wallet.label}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <Wallet className={`w-4 h-4 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`} />
                              <p className={`font-mono text-sm ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                                {formatWallet(wallet.address)}
                              </p>
                              <span className={`font-mono text-xs ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                                {wallet.address}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(wallet.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark 
                              ? 'text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10' 
                              : 'text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#DC2626]/10'
                          }`}
                          title="Delete wallet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}>
          <div 
            className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border-2 p-6 ${isDark ? 'bg-[#0a0a0f] border-[#00FF88]' : 'bg-white border-gray-400'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-mono font-bold ${isDark ? 'text-[#00FF88]' : 'text-gray-900'}`}>
                Add Account
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className={`p-1 rounded ${isDark ? 'text-[#6B7280] hover:text-[#00FF88]' : 'text-gray-500 hover:text-gray-700'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Project Selector */}
              <div className="space-y-2">
                <label className={`font-mono text-sm ${isDark ? 'text-[#00FF88]' : 'text-gray-700'}`}>
                  Select Project *
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                    className={`w-full flex items-center justify-between p-3 rounded border-2 font-mono ${
                      isDark 
                        ? 'bg-[#0f0f14] border-[#00FF88]/30 text-[#00FF88]' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedProject ? (
                        <>
                          {selectedProject.projectLogo ? (
                            <img src={selectedProject.projectLogo} alt="" className="w-6 h-6 rounded object-cover" />
                          ) : (
                            <PlaceholderLogo className={`w-6 h-6 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`} />
                          )}
                          <span>{selectedProject.projectName}</span>
                        </>
                      ) : (
                        <span className={isDark ? 'text-gray-600' : 'text-gray-500'}>Choose a project...</span>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showProjectDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showProjectDropdown && (
                    <div className={`absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded border-2 z-50 ${
                      isDark ? 'bg-[#0f0f14] border-[#00FF88]/30' : 'bg-white border-gray-300'
                    }`}>
                      {availableProjects.length === 0 ? (
                        <div className={`p-3 text-center font-mono text-sm ${isDark ? 'text-[#6B7280]' : 'text-gray-500'}`}>
                          No projects available
                        </div>
                      ) : (
                        availableProjects.map(project => (
                          <button
                            key={project.id}
                            onClick={() => {
                              setSelectedProject(project);
                              setShowProjectDropdown(false);
                            }}
                            className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                              isDark 
                                ? 'hover:bg-[#00FF88]/10 text-[#00FF88]' 
                                : 'hover:bg-gray-100 text-gray-900'
                            }`}
                          >
                            {project.projectLogo ? (
                              <img src={project.projectLogo} alt="" className="w-8 h-8 rounded object-cover" />
                            ) : (
                              <PlaceholderLogo className={`w-8 h-8 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`} />
                            )}
                            <div>
                              <p className="font-mono font-bold text-sm">{project.projectName}</p>
                              <p className={`font-mono text-xs ${isDark ? 'text-[#6B7280]' : 'text-gray-500'}`}>{project.type}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Multiple Wallet Entries */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={`font-mono text-sm ${isDark ? 'text-[#00FF88]' : 'text-gray-700'}`}>
                    Wallet Addresses *
                  </label>
                  <span className={`text-xs font-mono ${isDark ? 'text-[#6B7280]' : 'text-gray-500'}`}>
                    {walletEntries.length} wallet(s)
                  </span>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {walletEntries.map((entry, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border-2 space-y-3 relative ${
                        isDark 
                          ? 'bg-[#0f0f14] border-[#1F2937]' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {/* Wallet Number Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-mono font-bold ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`}>
                          Wallet #{index + 1}
                        </span>
                        {walletEntries.length > 1 && (
                          <button
                            onClick={() => removeWalletField(index)}
                            className={`p-1 rounded transition-colors ${
                              isDark 
                                ? 'text-[#6B7280] hover:text-[#EF4444]' 
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Label Input */}
                      <div>
                        <label className={`block text-xs font-mono mb-1 ${isDark ? 'text-[#6B7280]' : 'text-gray-500'}`}>
                          Label (Optional)
                        </label>
                        <Input
                          placeholder="e.g., Main Account, Backup, etc."
                          value={entry.label}
                          onChange={(e) => updateWalletField(index, 'label', e.target.value)}
                          className={`font-mono text-sm border-2 ${
                            isDark 
                              ? 'bg-[#161B22] border-[#00FF88]/30 text-[#00FF88] placeholder:text-gray-600' 
                              : 'bg-white border-gray-300'
                          }`}
                        />
                      </div>

                      {/* Address Input */}
                      <div>
                        <label className={`block text-xs font-mono mb-1 ${isDark ? 'text-[#6B7280]' : 'text-gray-500'}`}>
                          Address *
                        </label>
                        <Input
                          placeholder="0x..."
                          value={entry.address}
                          onChange={(e) => updateWalletField(index, 'address', e.target.value)}
                          className={`font-mono text-sm border-2 ${
                            isDark 
                              ? 'bg-[#161B22] border-[#00FF88]/30 text-[#00FF88] placeholder:text-gray-600' 
                              : 'bg-white border-gray-300'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add More Wallet Button */}
                <Button
                  type="button"
                  onClick={addWalletField}
                  variant="outline"
                  className={`w-full font-mono border-2 border-dashed ${
                    isDark 
                      ? 'border-[#00FF88]/30 text-[#00FF88] hover:bg-[#00FF88]/10 hover:border-[#00FF88]' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Wallet
                </Button>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-dashed mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className={`font-mono border-2 ${
                    isDark 
                      ? 'border-[#00FF88]/50 text-[#00FF88] hover:bg-[#00FF88]/10' 
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAdd}
                  disabled={!selectedProject || walletEntries.every(w => !w.address.trim()) || isSubmitting}
                  className={`font-mono border-2 ${
                    isDark 
                      ? 'bg-[#00FF88] text-black border-[#00FF88] hover:bg-[#00FF88]/90' 
                      : 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Add {walletEntries.filter(w => w.address.trim()).length} Account(s)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}