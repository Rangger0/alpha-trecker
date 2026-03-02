// src/components/auth/AuthLayout.tsx
import { type ReactNode, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PipesBackground } from './PipesBackground';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  features: string[];
  gradient: 'blue' | 'green';
}

export function AuthLayout({ children, title, subtitle, features, gradient }: AuthLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [logoError, setLogoError] = useState(false);

  const gradientClass = gradient === 'blue' 
    ? 'from-blue-600 via-blue-700 to-indigo-800'
    : 'from-emerald-600 via-teal-700 to-green-800';

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Info (Tanpa Pipes) */}
      <div className={`hidden lg:flex lg:w-1/2 xl:w-5/12 flex-col justify-between p-12 bg-gradient-to-br ${gradientClass} text-white relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Logo PNG */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="Alpha Tracker"
                className="w-12 h-12 object-contain drop-shadow-lg"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                <span className="font-mono font-bold text-xl">{'>'}_</span>
              </div>
            )}
            <span className="font-bold text-xl font-mono">
              ALPHA_TRACKER
            </span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 my-auto">
          <h1 className="text-4xl xl:text-5xl font-bold font-mono mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            {subtitle}
          </p>
          
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Theme Toggle */}
        <div className="relative z-10">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-sm font-mono hover:bg-white/20 transition-colors"
          >
            {isDark ? '☀ LIGHT_MODE' : '🌙 DARK_MODE'}
          </button>
        </div>
      </div>

      {/* Right Panel - Form (Dengan Pipes Background) */}
      <div className={`flex-1 flex flex-col relative overflow-hidden ${
        isDark ? 'bg-[#0B0F14]' : 'bg-gray-50'
      }`}>
        {/* Pipes Background - Hanya di kanan */}
        <div className="absolute inset-0 z-0">
          <PipesBackground />
        </div>

        {/* Mobile Header dengan Logo PNG */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#1F2937] relative z-10">
          <Link to="/" className="flex items-center gap-2">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="Alpha Tracker"
                className="w-8 h-8 object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                <span className={`font-mono font-bold ${isDark ? 'text-[#00FF88]' : 'text-blue-600'}`}>{'>'}_</span>
              </div>
            )}
            <span className={`font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ALPHA_TRACKER
            </span>
          </Link>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border ${
              isDark ? 'border-[#1F2937] text-gray-400' : 'border-gray-200 text-gray-600'
            }`}
          >
            {isDark ? '☀' : '🌙'}
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}