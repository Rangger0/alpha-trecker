// src/components/landing/Navbar.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [logoError, setLogoError] = useState(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
      isDark 
        ? 'bg-[#0B0F14]/80 border-[#1F2937]' 
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo PNG */}
          <Link to="/" className="flex items-center gap-3 group">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="Alpha Tracker"
                className="w-10 h-10 object-contain transition-transform group-hover:scale-110"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-10 h-10 rounded flex items-center justify-center bg-white/10">
                <span className={`font-mono font-bold text-xl ${isDark ? 'text-[#00FF88]' : 'text-blue-600'}`}>
                  {'>'}_
                </span>
              </div>
            )}
            
            <span className={`font-bold text-lg font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <span className={isDark ? 'text-[#00FF88]' : 'text-blue-600'}>ALPHA</span>_TRACKER
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Projects', 'Pricing'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isDark ? 'text-gray-300 hover:text-[#00FF88]' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className={`font-mono text-sm transition-all duration-300 hover:scale-105 ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className={`font-mono text-sm px-6 transition-all duration-300 hover:scale-105 ${
                isDark 
                  ? 'bg-[#00FF88] text-[#0B0F14] hover:bg-[#00FF88]/90 shadow-[0_0_20px_rgba(0,255,136,0.3)]' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 shadow-lg'
              }`}>
                Sign Up →
              </Button>
            </Link>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-all duration-300 hover:scale-110 ${
                isDark 
                  ? 'border-[#1F2937] text-gray-400 hover:text-[#00FF88] hover:border-[#00FF88]' 
                  : 'border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600'
              }`}
            >
              {isDark ? '☀' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}