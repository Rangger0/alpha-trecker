// src/components/landing/HeroSection.tsx
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const dashboardImages = [
  {
    src: '/1.png',
    alt: 'Regist to Login',
    label: 'Regist to Login'
  },
  {
    src: '/2.png',
    alt: 'Overview',
    label: 'Overview'
  },
    {
    src: '/3.png',
    alt: 'Dashboard',
    label: 'Dashboard'
  },
    {
    src: '/4.png',
    alt: 'Add-New-Airdrop',
    label: 'Add-New-Airdrop'
  },
    {
    src: '/5.png',
    alt: 'Tool',
    label: 'Tools'
  },
    {
    src: '/6.png',
    alt: 'AI Tools',
    label: 'AI Tools'
  },
    {
    src: '/7.png',
    alt: 'Swap&Bridge',
    label: 'Swap&Bridge'
  },
];

export function HeroSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [typedText, setTypedText] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const fullText = '$ alpha-tracker --status';

  // Typing effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => setShowDashboard(true), 500);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Auto slide
  useEffect(() => {
    if (!isAutoPlaying || !showDashboard) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dashboardImages.length);
    }, 4000); // Ganti slide setiap 4 detik

    return () => clearInterval(interval);
  }, [isAutoPlaying, showDashboard]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % dashboardImages.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + dashboardImages.length) % dashboardImages.length);
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl animate-pulse ${
          isDark ? 'bg-[#00FF88]/5' : 'bg-blue-500/5'
        }`} />
        <div className={`absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full blur-3xl animate-pulse delay-1000 ${
          isDark ? 'bg-blue-500/5' : 'bg-purple-500/5'
        }`} />
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-[#00FF88]/10 border border-blue-200 dark:border-[#00FF88]/20 mb-8 animate-fade-in-up">
          <Sparkles className={`w-4 h-4 ${isDark ? 'text-[#00FF88]' : 'text-blue-600'} animate-pulse`} />
          <span className={`text-sm font-medium ${isDark ? 'text-[#00FF88]' : 'text-blue-600'}`}>
            Alpha Tracker 2.0 - Public Beta
          </span>
        </div>

        {/* Headline */}
        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold font-mono mb-6 leading-tight animate-fade-in-up delay-100 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          The Project Tool For{' '}
          <span className={`bg-gradient-to-r ${
            isDark 
              ? 'from-[#00FF88] to-[#00D4FF]' 
              : 'from-blue-600 to-purple-600'
          } bg-clip-text text-transparent animate-gradient`}>
            Airdroppers
          </span>
        </h1>

        {/* Subheadline */}
        <p className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Explore your data, build your dashboard, bring your team together. 
          Stop hunting, start building your airdrop empire.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Link to="/register">
            <Button className={`h-12 px-8 text-base font-mono group ${
              isDark 
                ? 'bg-[#00FF88] text-[#0B0F14] hover:bg-[#00FF88]/90 hover:scale-105' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 hover:scale-105'
            } transition-all duration-300`}>
              Get Started - It's Free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className={`h-12 px-8 text-base font-mono border-2 group ${
              isDark 
                ? 'border-[#1F2937] text-gray-300 hover:bg-[#1F2937] hover:scale-105' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-105'
            } transition-all duration-300`}>
              Learn More 
              <ChevronDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Terminal Preview */}
        <div className="mt-16 relative animate-fade-in-up delay-500">
          <div className={`absolute -inset-1 bg-gradient-to-r ${
            isDark ? 'from-[#00FF88]/20 to-blue-500/20' : 'from-blue-500/20 to-purple-500/20'
          } rounded-2xl blur-xl animate-pulse`} />
          
          <div className={`relative rounded-xl overflow-hidden border shadow-2xl ${
            isDark ? 'border-[#1F2937] bg-[#0B0F14]' : 'border-gray-200 bg-white'
          }`}>
            <div className={`h-10 flex items-center px-4 border-b ${
              isDark ? 'border-[#1F2937] bg-[#161B22]' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  alpha-tracker
                </span>
                <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>—</span>
                <span className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  bash
                </span>
              </div>
            </div>
            
            <div className="p-6 text-left font-mono text-sm">
              <div className={isDark ? 'text-[#00FF88]' : 'text-blue-600'}>
                {typedText}
                <span className="animate-blink">_</span>
              </div>
              <div className={`mt-4 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="animate-fade-in delay-500">{'>'} Initializing dashboard...</div>
                <div className="animate-fade-in delay-700">{'>'} Loading portfolio data...</div>
                <div className="animate-fade-in delay-900">{'>'} Syncing 12 wallets...</div>
                <div className={`animate-fade-in delay-1100 ${isDark ? 'text-[#00FF88]' : 'text-green-600'}`}>
                  {'>'} Ready! Found 3 new airdrop opportunities
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD SLIDER - 2 GAMBAR */}
        <div 
          ref={sliderRef}
          className={`mt-16 relative transition-all duration-1000 transform ${
            showDashboard 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
          }`}
        >
          {/* Glow Background */}
          <div className={`absolute -inset-4 bg-gradient-to-r ${
            isDark 
              ? 'from-[#00FF88]/20 via-blue-500/20 to-purple-500/20' 
              : 'from-blue-500/20 via-purple-500/20 to-pink-500/20'
          } rounded-3xl blur-2xl animate-pulse`} />

          {/* Slider Container */}
          <div className="relative group">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 ${
                isDark 
                  ? 'bg-[#161B22] border border-[#00FF88]/50 text-[#00FF88] shadow-[0_0_20px_rgba(0,255,136,0.3)]' 
                  : 'bg-white border border-blue-300 text-blue-600 shadow-lg'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 ${
                isDark 
                  ? 'bg-[#161B22] border border-[#00FF88]/50 text-[#00FF88] shadow-[0_0_20px_rgba(0,255,136,0.3)]' 
                  : 'bg-white border border-blue-300 text-blue-600 shadow-lg'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Images Container dengan Zoom Effect */}
            <div className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-500 group-hover:shadow-2xl ${
              isDark 
                ? 'border-[#1F2937] shadow-[0_0_50px_rgba(0,255,136,0.2)]' 
                : 'border-gray-200 shadow-xl'
            }`}>
              
              {/* Slider Track */}
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 50}%)` }}
              >
                {dashboardImages.map((image, index) => (
                  <div 
                    key={index}
                    className="w-1/2 flex-shrink-0 p-2"
                  >
                    <div className="relative group/slide overflow-hidden rounded-xl">
                      {/* Glow on hover */}
                      <div className={`absolute -inset-1 rounded-xl transition-all duration-500 opacity-0 group-hover/slide:opacity-100 ${
                        isDark 
                          ? 'bg-gradient-to-r from-[#00FF88]/30 to-blue-500/30' 
                          : 'bg-gradient-to-r from-blue-500/30 to-purple-500/30'
                      } blur-xl`} />

                      <div className="relative overflow-hidden rounded-xl">
                        <img 
                          src={image.src} 
                          alt={image.alt}
                          className="w-full aspect-video object-cover transition-transform duration-700 group-hover/slide:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        
                        {/* Fallback */}
                        <div 
                          className="hidden w-full aspect-video items-center justify-center bg-[#161B22] text-gray-400 font-mono"
                        >
                          <div className="text-center">
                            <div className="text-5xl mb-3">📊</div>
                            <div className="text-sm">{image.label}</div>
                            <div className="text-xs text-gray-600 mt-1">Add {image.src} to public folder</div>
                          </div>
                        </div>

                        {/* Label */}
                        <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 translate-y-full group-hover/slide:translate-y-0 ${
                          isDark ? 'bg-gradient-to-t from-black/80 to-transparent' : 'bg-gradient-to-t from-white/80 to-transparent'
                        }`}>
                          <p className={`font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {image.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {dashboardImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentSlide(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? isDark 
                          ? 'bg-[#00FF88] w-8 shadow-[0_0_10px_rgba(0,255,136,0.5)]' 
                          : 'bg-blue-600 w-8'
                        : isDark
                          ? 'bg-gray-600 hover:bg-gray-500'
                          : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 text-center">
            <p className={`text-sm font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Preview of your personalized dashboard • Hover to zoom • Click arrows to navigate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}