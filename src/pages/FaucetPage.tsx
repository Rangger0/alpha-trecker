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
  ExternalLink, 
  Edit2, 
  X,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { useFaucets } from '@/hooks/use-faucets';
import type { Faucet } from '@/types';

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
  
  // Add form states
  const [projectName, setProjectName] = useState('');
  const [faucetUrl, setFaucetUrl] = useState('');
  const [faucetLogo, setFaucetLogo] = useState('');
  
  // Search & UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditingFaucet | null>(null);

  // Load data on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleAddFaucet = async () => {
    if (!projectName.trim() || !faucetUrl.trim()) return;
    
    await addFaucet({
      projectName: projectName.trim(),
      url: faucetUrl.trim(),
      logo: faucetLogo.trim() || undefined,
    });
    
    // Reset form
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
      logo: faucet.logo || '',
    });
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
      logo: editForm.logo || undefined,
    });
    setEditingId(null);
    setEditForm(null);
  };

  const handleLogoError = (id: string) => {
    setLogoError(prev => ({ ...prev, [id]: true }));
  };

  const filteredFaucets = faucets.filter(f => 
    f.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Card animation classes (sama seperti Priority Projects)
  const cardBaseClasses = `relative p-4 rounded-xl border transition-all duration-300 ease-out overflow-hidden group`;
  
  const cardThemeClasses = isDark 
    ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]' 
    : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-[#00FF88]/10' : 'bg-[#2563EB]/10'}`}>
              <Droplets className={`w-6 h-6 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`} />
            </div>
            <h1 className={`text-2xl font-bold font-mono ${
              isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
            }`}>
              Faucet Management
            </h1>
          </div>
          <p className={`font-mono text-sm ${
            isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
          }`}>
            Add, search, and manage your project faucets easily
          </p>
        </div>

        {/* Add New Faucet */}
        <Card className={`mb-6 border-2 ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}`}>
          <CardContent className="p-6">
            <h3 className={`font-mono font-bold mb-4 flex items-center gap-2 ${
              isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
            }`}>
              <Plus className="w-4 h-4" />
              Add New Faucet
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-mono mb-2 ${
                    isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                  }`}>
                    Project Name *
                  </label>
                  <Input
                    placeholder="Enter project name..."
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className={`font-mono border-2 ${
                      isDark 
                        ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                        : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-mono mb-2 ${
                    isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                  }`}>
                    Faucet URL *
                  </label>
                  <Input
                    placeholder="https://..."
                    value={faucetUrl}
                    onChange={(e) => setFaucetUrl(e.target.value)}
                    className={`font-mono border-2 ${
                      isDark 
                        ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                        : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                    }`}
                  />
                </div>
              </div>

              {/* NEW: Logo URL Field */}
              <div>
                <label className={`block text-sm font-mono mb-2 flex items-center gap-2 ${
                  isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                }`}>
                  <ImageIcon className="w-4 h-4" />
                  Project Logo URL (optional)
                </label>
                <Input
                  placeholder="https://..."
                  value={faucetLogo}
                  onChange={(e) => setFaucetLogo(e.target.value)}
                  className={`font-mono border-2 ${
                    isDark 
                      ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                      : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                  }`}
                />
              </div>
              
              <Button
                onClick={handleAddFaucet}
                disabled={!projectName.trim() || !faucetUrl.trim()}
                className={`w-full font-mono border-2 transition-all duration-200 ${
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
        <Card className={`border-2 ${isDark ? 'bg-[#161B22] border-[#1F2937]' : 'bg-white border-[#E5E7EB]'}`}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className={`font-mono font-bold flex items-center gap-2 ${
                  isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                }`}>
                  <Droplets className="w-4 h-4" />
                  My Faucets
                </h3>
                <p className={`font-mono text-xs mt-1 ${
                  isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                }`}>
                  {faucets.length} faucet(s) saved
                </p>
              </div>
              <div className="relative w-full sm:w-64 group">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDark ? 'text-[#6B7280] group-focus-within:text-[#00FF88]' : 'text-[#6B7280] group-focus-within:text-[#2563EB]'
                }`} />
                <Input
                  placeholder="Search by project name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 font-mono text-sm border-2 transition-all ${
                    isDark 
                      ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                      : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                  }`}
                />
              </div>
            </div>

            {filteredFaucets.length === 0 ? (
              <div className="py-12 text-center">
                <Droplets className={`w-16 h-16 mx-auto mb-4 ${
                  isDark ? 'text-[#1F2937]' : 'text-[#E5E7EB]'
                }`} />
                <h4 className={`font-mono font-bold mb-2 ${
                  isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                }`}>
                  No Faucets Found
                </h4>
                <p className={`font-mono text-sm ${
                  isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                }`}>
                  Add your first faucet above
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaucets.map((faucet) => {
                  const isHovered = hoveredCard === faucet.id;
                  const isEditing = editingId === faucet.id;
                  
                  if (isEditing && editForm) {
                    return (
                      <div
                        key={faucet.id}
                        className={`${cardBaseClasses} ${cardThemeClasses} border-[#00FF88]/50 ring-2 ring-[#00FF88]/20`}
                      >
                        <div className="space-y-3 w-full">
                          <Input
                            placeholder="Project name..."
                            value={editForm.projectName}
                            onChange={(e) => setEditForm({...editForm, projectName: e.target.value})}
                            className={`font-mono border-2 ${
                              isDark 
                                ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                                : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                            }`}
                          />
                          <Input
                            placeholder="URL..."
                            value={editForm.url}
                            onChange={(e) => setEditForm({...editForm, url: e.target.value})}
                            className={`font-mono border-2 ${
                              isDark 
                                ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                                : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                            }`}
                          />
                          <Input
                            placeholder="Logo URL (optional)..."
                            value={editForm.logo}
                            onChange={(e) => setEditForm({...editForm, logo: e.target.value})}
                            className={`font-mono border-2 ${
                              isDark 
                                ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] focus:border-[#00FF88]' 
                                : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                            }`}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={saveEdit}
                              className={`flex-1 font-mono border ${
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
                              className={`font-mono border-2 ${
                                isDark 
                                  ? 'border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10' 
                                  : 'border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626]/10'
                              }`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={faucet.id}
                      className={`${cardBaseClasses} ${cardThemeClasses}`}
                      onMouseEnter={() => setHoveredCard(faucet.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {/* Hover gradient effect (sama seperti Priority) */}
                      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${
                        isDark ? 'from-[#00FF88]/10 via-transparent to-[#00FF88]/10' : 'from-[#2563EB]/10 via-transparent to-[#2563EB]/10'
                      }`} />

                      <div className="relative flex items-center gap-4">
                        {/* Logo */}
                        <div className={`w-12 h-12 rounded-xl overflow-hidden border flex-shrink-0 transition-transform duration-300 ${
                          isHovered ? 'scale-110' : ''
                        } ${isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'}`}>
                          {faucet.logo && !logoError[faucet.id] ? (
                            <img 
                              src={faucet.logo} 
                              alt={faucet.projectName}
                              className="w-full h-full object-cover"
                              onError={() => handleLogoError(faucet.id)}
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center font-bold text-lg ${
                              isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'
                            }`}>
                              {faucet.projectName[0].toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className={`font-mono font-bold truncate transition-colors ${
                            isDark ? 'text-[#E5E7EB] group-hover:text-[#00FF88]' : 'text-[#111827] group-hover:text-[#2563EB]'
                          }`}>
                            {faucet.projectName}
                          </h4>
                          <a
                            href={faucet.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-mono text-xs truncate block transition-colors ${
                              isDark ? 'text-[#6B7280] hover:text-[#00FF88]' : 'text-[#6B7280] hover:text-[#2563EB]'
                            }`}
                          >
                            {faucet.url}
                          </a>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(faucet)}
                            className={`font-mono text-xs border-2 ${
                              isDark 
                                ? 'border-[#00FF88]/50 text-[#00FF88] hover:bg-[#00FF88]/10' 
                                : 'border-[#2563EB]/50 text-[#2563EB] hover:bg-[#2563EB]/10'
                            }`}
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className={`font-mono text-xs ${
                              isDark 
                                ? 'text-[#6B7280] hover:bg-[#00FF88]/10 hover:text-[#00FF88]' 
                                : 'text-[#6B7280] hover:bg-[#2563EB]/10 hover:text-[#2563EB]'
                            }`}
                          >
                            <a href={faucet.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Visit
                            </a>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFaucet(faucet.id)}
                            className={`font-mono text-xs ${
                              isDark 
                                ? 'text-[#EF4444] hover:bg-[#EF4444]/10' 
                                : 'text-[#DC2626] hover:bg-[#DC2626]/10'
                            }`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}