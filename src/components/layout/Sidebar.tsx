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
  Wallet,
  Search,
  LogOut,
  Menu,
  Camera,
  User,
  X
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

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

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/overview', label: 'Overview', icon: Layers },
    { path: '/ecosystem', label: 'Ecosystem', icon: Globe },
    { path: '/faucet', label: 'Faucet', icon: Droplets },
    { path: '/multiple-account', label: 'Multi Account', icon: Users },
    { path: '/priority-projects', label: 'Priority', icon: Star },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-52 z-50 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${isDark ? 'bg-[#161B22]' : 'bg-white'}`}
      >
        {/* Header */}
        <div className="h-15 flex items-center justify-between px-3 border-b border-gray-200 dark:border-[#1F2937]">
          <div className="flex items-center gap-2">
            <img src="/logo.png" className="w-8 h-8" />
            <span className="font-bold font-mono">ALPHA_TRACKER</span>
          </div>

          <button onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User */}
        {user && (
          <div className="px-4 py-4 border-b border-gray-200 dark:border-[#1F2937] text-center">
            <div
              className="relative w-16 h-16 mx-auto mb-2 cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {userPhoto ? (
                <img
                  src={userPhoto}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />

            <p className="text-sm font-mono font-semibold">
              {user.email?.split('@')[0]}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-mono ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}

          <p className="px-3 pt-4 text-xs text-gray-400 font-mono">TOOLS</p>

          <div className="flex items-center gap-3 px-3 py-2 text-sm font-mono">
            <Wallet className="w-4 h-4" />
            Wallet
          </div>

          <NavLink
                to="/screening"
          onClick={onClose}
           className={`flex items-center gap-3 px-3 py-2 text-sm font-mono rounded-md ${
           location.pathname === "/screening"
           ? "bg-blue-500/10 text-blue-500"
             : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
             }`}
             >
            <Search className="w-4 h-4" />
             Screening
          </NavLink>

          <NavLink
            to="/about"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 text-sm font-mono"
          >
            <Info className="w-4 h-4" />
            About
          </NavLink>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 text-sm font-mono text-red-500"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}