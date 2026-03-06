// FaucetPage.tsx
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Droplets, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  X,
  Check,
  Image as ImageIcon,
  ArrowUpRight
} from 'lucide-react';
import { useFaucets } from '@/hooks/use-faucets';
import type { Faucet } from '@/types';
import { motion } from 'framer-motion';

interface EditingFaucet {
  id: string;
  projectName: string;
  url: string;
  logo: string;
}

export function FaucetPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { faucets, addFaucet, updateFaucet, removeFaucet, refetch } = useFaucets();
  
  const [projectName, setProjectName] = useState('');
  const [faucetUrl, setFaucetUrl] = useState('');
  const [faucetLogo, setFaucetLogo] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditingFaucet | null>(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleAddFaucet = async () => {
    if (!projectName.trim() || !faucetUrl.trim()) return;
    
    await addFaucet({
      projectName: projectName.trim(),
      url: faucetUrl.trim(),
      logo: faucetLogo.trim() || undefined });
    
    setProjectName('');
    setFaucetUrl('');
    setFaucetLogo('');
  };

  const handleDeleteFaucet = async (id: string) => {
    if (confirm('Are you sure you want to delete this faucet?')) {
      await removeFaucet(id);
    }
  };

  const startEdit = (faucet: Faucet) => {
    setEditingId(faucet.id);
    setEditForm({
      id: faucet.id,
      projectName: faucet.projectName,
      url: faucet.url,
      logo: faucet.logo || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = async () => {
    if (!editForm) return;
    await updateFaucet(editForm.id, {
      projectName: editForm.projectName,
      url: editForm.url,
      logo: editForm.logo || undefined });
    setEditingId(null);
    setEditForm(null);
  };

  const handleLogoError = (id: string) => {
    setLogoError(prev => ({ ...prev, [id]: true }));
  };

  const filteredFaucets = faucets.filter(f => 
    f.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAccentColor = (index: number) => {
    const colors = ['#00D4AA', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#EC4899', '#6366F1'];
    return colors[index % colors.length];
  };

  const renderFaucetCard = (faucet: Faucet, index: number) => {
    const accent = getAccentColor(index);
    
    if (editingId === faucet.id && editForm) {
      return (
        <motion.div
          key={faucet.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`
            relative p-4 rounded-xl border-2 overflow-hidden macos-card
            ${isDark ? 'bg-[#161B22] border-[#00FF88]/50' : 'bg-white border-[#E5E7EB]'}
          `}
        >
          <div className="space-y-3">
            <Input
              placeholder="Project name..."
              value={editForm.projectName}
              onChange={(e) => setEditForm({...editForm, projectName: e.target.value})}
              className={`font-mono macos-input border-2 ${
                isDark 
                  ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                  : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
              }`}
            />
            <Input
              placeholder="URL..."
              value={editForm.url}
              onChange={(e) => setEditForm({...editForm, url: e.target.value})}
              className={`font-mono macos-input border-2 ${
                isDark 
                  ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                  : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
              }`}
            />
            <Input
              placeholder="Logo URL (optional)..."
              value={editForm.logo}
              onChange={(e) => setEditForm({...editForm, logo: e.target.value})}
              className={`font-mono macos-input border-2 ${
                isDark 
                  ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                  : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
              }`}
            />
            <div className="flex gap-2">
              <Button
                onClick={saveEdit}
                className={`flex-1 font-mono macos-btn macos-btn--primary border ${
                  isDark 
                    ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90' 
                    : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90'
                }`}
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button
                onClick={cancelEdit}
                variant="outline"
                className={`font-mono macos-btn macos-btn--ghost border-2 ${
                  isDark 
                    ? 'border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10' 
                    : 'border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626]/10'
                }`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={faucet.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`
          relative p-4 rounded-xl border overflow-hidden group cursor-pointer
          transition-all duration-300 ease-out
          transform hover:-translate-y-1 hover:shadow-xl macos-card
          ${isDark
            ? "bg-[#161B22] border-[#1F2937] hover:border-[#1F2937]"
            : "bg-white border-[#E5E7EB] hover:border-[#E5E7EB]"}
        `}
        style={{ borderLeft: `3px solid ${accent}` }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${accent}08 0%, transparent 50%)`
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          {/* Icon/Logo */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
              isDark ? "bg-[#0B0F14]" : "bg-[#F3F4F6]"
            }`}
          >
            {faucet.logo && !logoError[faucet.id] ? (
              <img
                src={faucet.logo}
                alt={faucet.projectName}
                className="w-7 h-7 object-contain rounded-lg"
                onError={() => handleLogoError(faucet.id)}
              />
            ) : (
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{ background: accent, color: '#fff' }}
              >
                {faucet.projectName[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h3
                className={`font-bold text-sm truncate ${
                  isDark ? "text-[#E5E7EB]" : "text-[#111827]"
                }`}
              >
                {faucet.projectName}
              </h3>
              <ArrowUpRight 
                className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 ml-2"
                style={{ color: accent }}
              />
            </div>
            
            <p className={`text-xs truncate ${isDark ? "text-[#6B7280]" : "text-[#6B7280]"}`}>
              {faucet.url}
            </p>
          </div>
        </div>

        {/* Actions - appear on hover */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); startEdit(faucet); }}
            className={`p-1.5 rounded-lg transition-colors macos-btn macos-btn--ghost ${
              isDark ? 'text-[#6B7280] hover:text-[#00FF88] hover:bg-[#00FF88]/10' : 'text-[#6B7280] hover:text-[#2563EB] hover:bg-[#2563EB]/10'
            }`}
            aria-label={`Edit ${faucet.projectName}`}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDeleteFaucet(faucet.id); }}
            className={`p-1.5 rounded-lg transition-colors macos-btn macos-btn--ghost ${
              isDark ? 'text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10' : 'text-[#6B7280] hover:text-[#DC2626] hover:bg-[#DC2626]/10'
            }`}
            aria-label={`Delete ${faucet.projectName}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom accent line */}
        <div 
          className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
          style={{ background: accent }}
        />
      </motion.div>
    );
  };

  return (
    <DashboardLayout>
      <div className="w-full px-6 py-6 macos-root faucet-page">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg accent-surface" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Droplets className={`w-6 h-6`} style={{ color: 'var(--alpha-accent)' }} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold font-mono ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                Faucet Management
              </h1>
              <p className={`font-mono text-sm ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                Add, search, and manage your project faucets easily
              </p>
            </div>
          </div>
        </div>

        {/* Add New Faucet - Compact Form */}
        <Card className={`mb-6 border macos-card faucet-panel`} style={{ background: 'var(--alpha-panel)' }}>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div className="md:col-span-1">
                <label className={`block text-xs font-mono mb-1.5 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                  Project Name *
                </label>
                <Input
                  placeholder="Enter project name..."
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className={`font-mono text-sm macos-input border-2 ${
                    isDark 
                      ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                      : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                  }`}
                />
              </div>
              
              <div className="md:col-span-1">
                <label className={`block text-xs font-mono mb-1.5 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                  Faucet URL *
                </label>
                <Input
                  placeholder="https://..."
                  value={faucetUrl}
                  onChange={(e) => setFaucetUrl(e.target.value)}
                  className={`font-mono text-sm macos-input border-2 ${
                    isDark 
                      ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                      : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                  }`}
                />
              </div>

              <div className="md:col-span-1">
                <label className={`block text-xs font-mono mb-1.5 flex items-center gap-1 ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                  <ImageIcon className="w-3 h-3" />
                  Logo URL (optional)
                </label>
                <Input
                  placeholder="https://..."
                  value={faucetLogo}
                  onChange={(e) => setFaucetLogo(e.target.value)}
                  className={`font-mono text-sm macos-input border-2 ${
                    isDark 
                      ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                      : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                  }`}
                />
              </div>
              
              <Button
                onClick={handleAddFaucet}
                disabled={!projectName.trim() || !faucetUrl.trim()}
                className={`font-mono macos-btn macos-btn--primary border-2 transition-all duration-200 h-10 ${
                  isDark 
                    ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90 disabled:opacity-50' 
                    : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90 disabled:opacity-50'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Faucet
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Faucets */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className={`w-4 h-4`} style={{ color: 'var(--alpha-accent)' }} />
            <h3 className={`font-mono font-bold ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
              My Faucets
            </h3>
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full accent-surface`} style={{ marginLeft: 6 }}>
              {faucets.length}
            </span>
          </div>
          <div className="relative w-64 group">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-[#6B7280] group-focus-within:text-[#00FF88]' : 'text-[#6B7280] group-focus-within:text-[#2563EB]'}`} />
            <Input
              placeholder="Search faucets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 font-mono text-sm macos-input border-2 h-9 ${
                isDark 
                  ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#5cd4b8]' 
                  : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#279bd0]'
              }`}
            />
          </div>
        </div>

        {filteredFaucets.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed rounded-xl border-[#1F2937] macos-card faucet-empty">
            <Droplets className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'}`} />
            <h4 className={`font-mono font-bold mb-2 ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
              No Faucets Found
            </h4>
            <p className={`font-mono text-sm ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
              Add your first faucet above
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredFaucets.map((faucet, index) => renderFaucetCard(faucet, index))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}