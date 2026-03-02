import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, User, LogOut, Camera, ChevronDown, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AirdropModal } from '@/components/modals/AirdropModal';
import { createAirdrop, getAirdropsByUserId } from '@/services/database';
import type { Airdrop } from '@/types';

interface TopBarProps {
  sidebarCollapsed?: boolean;
}

export function TopBar({ sidebarCollapsed }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { session, logout } = useAuth();
  const isDark = theme === 'dark';
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [_airdrops, setAirdrops] = useState<Airdrop[]>([]);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const user = session?.user;

  // Load user photo from Supabase on mount
  useEffect(() => {
    const loadUserPhoto = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      if (data?.avatar_url) {
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(data.avatar_url);
        
        setUserPhoto(urlData.publicUrl);
      }
    };
    
    loadUserPhoto();
  }, [user]);

  // Load airdrops count
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const data = await getAirdropsByUserId(user.id);
      setAirdrops(data);
    };
    load();
  }, [user]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  // Handle photo upload to Supabase Storage
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          avatar_url: fileName,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      setUserPhoto(urlData.publicUrl);
      
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
  };

  const handleAddAirdrop = async (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    await createAirdrop(data, user.id);
    const freshData = await getAirdropsByUserId(user.id);
    setAirdrops(freshData);
    setIsAddModalOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 right-0 h-16 z-30 border-b backdrop-blur-md transition-all duration-300 ${
          sidebarCollapsed ? 'left-16' : 'left-64'
        } ${isDark ? 'bg-[#0B0F14]/95 border-[#1F2937]' : 'bg-white/95 border-[#E5E7EB]'}`}
      >
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left: [NEW_PROJECT] Button */}
          <Button 
            onClick={() => setIsAddModalOpen(true)} 
            className={`font-mono text-sm border-2 transition-all duration-300 hover:scale-105 ${
              isDark 
                ? 'bg-transparent border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88] hover:text-[#0B0F14] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]' 
                : 'bg-transparent border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]'
            }`}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>[NEW_PROJECT]</span>
          </Button>

          {/* Center: Digital Clock */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center font-mono">
            <div className={`flex items-center gap-2 ${isDark ? 'text-[#00FF88]' : 'text-[#111827]'}`}>
              <span className="text-lg font-bold tracking-wider">
                {new Date().toLocaleTimeString('en-US', { hour12: false })}
              </span>
            </div>
            <span className={`text-xs ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase()}
            </span>
          </div>

          {/* Right: Theme & User */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`border transition-all duration-200 hover:scale-110 ${
                isDark 
                  ? 'border-[#1F2937] text-[#00FF88] hover:bg-[#00FF88]/10' 
                  : 'border-[#E5E7EB] text-[#2563EB] hover:bg-[#2563EB]/10'
              }`}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* User Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:scale-105 ${
                  isDark 
                    ? 'bg-[#161B22] border-[#1F2937] hover:border-[#00FF88]/50' 
                    : 'bg-[#F3F4F6] border-[#E5E7EB] hover:border-[#2563EB]/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border-2 transition-all duration-200 ${
                  isDark 
                    ? 'bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88]' 
                    : 'bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]'
                }`}>
                  {userPhoto ? (
                    <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <span className={`text-sm font-mono hidden md:block ${isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'}`}>
                  {user?.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''} ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`} />
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className={`absolute right-0 top-full mt-2 w-64 rounded-xl border shadow-lg z-50 overflow-hidden ${
                  isDark 
                    ? 'bg-[#161B22] border-[#1F2937]' 
                    : 'bg-white border-[#E5E7EB]'
                }`}>
                  {/* Profile Header */}
                  <div className={`p-4 border-b ${isDark ? 'border-[#1F2937]' : 'border-[#E5E7EB]'}`}>
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center border-2 cursor-pointer transition-all duration-200 hover:scale-105 relative group ${
                          isDark 
                            ? 'bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88]' 
                            : 'bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]'
                        }`}
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                      >
                        {userPhoto ? (
                          <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-8 w-8" />
                        )}
                        {isUploading && (
                          <div className={`absolute inset-0 flex items-center justify-center ${isDark ? 'bg-black/60' : 'bg-white/60'}`}>
                            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin border-current" />
                          </div>
                        )}
                        <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isDark ? 'bg-black/60' : 'bg-white/60'}`}>
                          <Camera className={`h-6 w-6 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`} />
                        </div>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`font-mono font-bold truncate ${isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'}`}>
                          {user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className={`font-mono text-xs truncate ${isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}`}>
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                    </div>
                    <p className={`text-xs font-mono mt-2 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                      {isUploading ? 'Uploading...' : 'Click photo to upload'}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-sm transition-all duration-200 ${
                        isDark 
                          ? 'text-[#EF4444] hover:bg-[#EF4444]/10' 
                          : 'text-[#DC2626] hover:bg-[#DC2626]/10'
                      }`}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Airdrop Modal */}
      <AirdropModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAddAirdrop} 
        mode="add" 
        isDark={isDark} 
      />
    </>
  );
}