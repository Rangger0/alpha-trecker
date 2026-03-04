import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Globe,
  Droplets,
  Users,
  Star,
  Info,
  Search,
  LogOut,
  Camera,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Bot,
  ArrowLeftRight,
  Wrench
  
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { theme } = useTheme();
  const { session, logout } = useAuth();
  const location = useLocation();
  const isDark = theme === 'dark';
  const user = session?.user;

  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load avatar
  useEffect(() => {
    const loadPhoto = async () => {
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

    loadPhoto();
  }, [user]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    await supabase
      .from('profiles')
      .upsert({
  id: user.id,
  avatar_url: fileName,
  updated_at: new Date().toISOString()
});

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    setUserPhoto(urlData.publicUrl);
  };

  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/overview', label: 'Overview', icon: Layers },
    { path: '/ecosystem', label: 'Ecosystem', icon: Globe },
    { path: '/faucet', label: 'Faucet', icon: Droplets },
    { path: '/multiple-account', label: 'Multi Account', icon: Users },
    { path: '/priority-projects', label: 'Priority', icon: Star },
  ];

  const toolsNavItems = [
    { path: '/tools', label: 'Tools', icon: Wrench, color: '#F59E0B', desc: 'Research & Analysis' },
    { path: '/ai-tools', label: 'AI Tools', icon: Bot, color: '#8B5CF6', desc: 'Coding & Research AI' },
    { path: '/swap', label: 'Swap & Bridge', icon: ArrowLeftRight, color: '#3B82F6', desc: 'DEX & Cross-chain' },
    { path: '/screening', label: 'Screening', icon: Search, color: '#10B981', desc: ' Analysis' },
  ];

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? 60 : 208,
          x: open ? 0 : -208
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 h-screen z-50 ${
          isDark ? 'bg-[#161B22]' : 'bg-white'
        } border-r ${isDark ? 'border-[#1F2937]' : 'border-gray-200'}`}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center shadow-lg z-50 transition-colors ${
            isDark ? 'bg-[#1F2937] hover:bg-[#2D3748]' : 'bg-white hover:bg-gray-100'
          } border ${isDark ? 'border-[#2D3748]' : 'border-gray-200'}`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3 text-gray-400" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-400" />
          )}
        </button>

        {/* Header */}
        <div className={`h-14 flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'} border-b ${isDark ? 'border-[#1F2937]' : 'border-gray-200'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img src="/logo.png" className="w-7 h-7" />
              <span className="font-bold font-mono text-sm">ALPHA</span>
            </div>
          )}
          {isCollapsed && <img src="/logo.png" className="w-7 h-7" />}
          
          {!isCollapsed && (
            <button onClick={onClose} className="lg:hidden">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User */}
        {user && !isCollapsed && (
          <div className="px-3 py-3 border-b border-gray-200 dark:border-[#1F2937]">
            <div
              className="relative w-10 h-10 mx-auto mb-2 cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {userPhoto ? (
                <img src={userPhoto} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
            <p className="text-xs font-mono font-semibold text-center truncate">
              {user.email?.split('@')[0]}
            </p>
          </div>
        )}

        {user && isCollapsed && (
          <div className="py-3 border-b border-gray-200 dark:border-[#1F2937] flex justify-center">
            <div className="relative w-8 h-8 cursor-pointer">
              {userPhoto ? (
                <img src={userPhoto} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {/* Main Menu */}
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2 rounded-md text-sm font-mono transition-colors ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}

          {/* Tools Section */}
          {!isCollapsed && (
            <p className="px-3 pt-4 pb-2 text-[10px] text-gray-400 font-mono uppercase tracking-wider">
              External Tools
            </p>
          )}
          
          {isCollapsed && <div className="pt-4" />}

          {/* Tools Menu Items - Direct Links */}
          {toolsNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2 rounded-md text-sm font-mono transition-colors group ${
                  isActive
                    ? 'bg-gray-100 dark:bg-white/10'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div 
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? '' : 'group-hover:opacity-100'}`}
                  style={{ color: isActive ? item.color : undefined }}
                >
                  <item.icon className="w-4 h-4" style={{ color: isActive ? item.color : undefined }} />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div 
                      className="truncate font-medium"
                      style={{ color: isActive ? item.color : undefined }}
                    >
                      {item.label}
                    </div>
                    {isActive && (
                      <div className="text-[10px] text-gray-400 truncate">
                        {item.desc}
                      </div>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}

          {/* About */}
          <NavLink
            to="/about"
            onClick={onClose}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2 rounded-md text-sm font-mono transition-colors mt-4 ${
              location.pathname === "/about"
                ? "bg-blue-500/10 text-blue-500"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
            title={isCollapsed ? 'About' : undefined}
          >
            <Info className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>About</span>}
          </NavLink>

          {/* Logout */}
          <button
            onClick={logout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2 rounded-md text-sm font-mono text-red-500 hover:bg-red-500/10 transition-colors`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </nav>
      </motion.aside>
    </>
  );
}