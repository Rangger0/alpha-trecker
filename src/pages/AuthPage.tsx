// ALPHA TRECKER - Auth Page (Terminal Theme)
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, User, Lock, Loader2, Terminal } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

// TikTok Icon
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username.trim(),
          password,
        });

        if (error) throw error;

        if (!data.session) {
          throw new Error("Login failed. Session not created.");
        }

        window.location.href = "/dashboard";

      } else {
        const { data, error } = await supabase.auth.signUp({
          email: username.trim(),
          password,
        });

        if (error) throw error;

        if (!data.user) {
          throw new Error("Registration failed.");
        }

        window.location.href = "/dashboard";
      }

    } catch (err: any) {
      console.log("AUTH ERROR:", err);
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-mono ${
      isDark ? 'bg-[#0B0F14]' : 'bg-[#F3F4F6]'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-5 ${
        isDark ? 'bg-[radial-gradient(#00FF88_1px,transparent_1px)]' : 'bg-[radial-gradient(#2563EB_1px,transparent_1px)]'
      }`} style={{ backgroundSize: '20px 20px' }} />
      
      {/* Scanline Effect */}
      {isDark && <div className="absolute inset-0 scanline pointer-events-none" />}

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className={`relative w-24 h-24 mb-4 rounded border-2 flex items-center justify-center ${
            isDark ? 'bg-[#161B22] border-[#00FF88] shadow-[0_0_30px_rgba(0,255,136,0.3)]' : 'bg-white border-[#2563EB] shadow-lg'
          }`}>
            <Terminal className={`w-12 h-12 ${isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}`} />
          </div>
          <h1 className={`text-3xl font-bold tracking-tighter font-mono ${
            isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
          }`}>
            <span className={isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'}>ALPHA</span>
            <span className={isDark ? 'text-[#E5E7EB]' : 'text-[#374151]'}>_TRACKER</span>
            <span className={`animate-pulse ${isDark ? 'text-[#00FF88]' : 'text-[#10B981]'}`}>_</span>
          </h1>
          <p className={`mt-2 text-sm font-mono ${
            isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
          }`}>
            {isDark ? '> INITIALIZING_SECURE_CONNECTION...' : 'Crypto Airdrop Hunter Dashboard'}
          </p>
        </div>

        {/* Card */}
        <Card className={`border shadow-2xl overflow-hidden ${
          isDark
            ? 'bg-[#161B22]/90 border-[#1F2937]'
            : 'bg-white/90 border-[#E5E7EB]'
        }`}>
          <CardHeader className="space-y-1">
            <CardTitle className={`text-2xl text-center font-mono ${
              isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
            }`}>
              {isDark ? '> AUTHENTICATION_REQUIRED' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className={`text-center font-mono text-xs ${
              isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
            }`}>
              {isDark ? 'root@alpha-tracker:~$ login --secure' : 'Enter your credentials to access your dashboard'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
              <TabsList className={`grid w-full grid-cols-2 mb-6 border font-mono ${
                isDark ? 'bg-[#0B0F14] border-[#1F2937]' : 'bg-[#F3F4F6] border-[#E5E7EB]'
              }`}>
                <TabsTrigger 
                  value="login" 
                  className={`font-mono data-[state=active]:bg-[#00FF88] data-[state=active]:text-[#0B0F14] ${
                    isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                  }`}
                >
                  LOGIN
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className={`font-mono data-[state=active]:bg-[#00FF88] data-[state=active]:text-[#0B0F14] ${
                    isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                  }`}
                >
                  REGISTER
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className={`mb-4 border font-mono ${
                  isDark ? 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]' : 'bg-[#DC2626]/10 border-[#DC2626]/30 text-[#DC2626]'
                }`}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-mono text-xs">ERROR: {error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username" className={`font-mono text-xs ${
                      isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'
                    }`}>
                      {isDark ? '> USERNAME:' : 'Username'}
                    </Label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                        isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                      }`} />
                      <Input
                        id="login-username"
                        placeholder={isDark ? "enter_credentials..." : "Enter your username"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`pl-10 font-mono border ${
                          isDark 
                            ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#00FF88]' 
                            : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className={`font-mono text-xs ${
                      isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'
                    }`}>
                      {isDark ? '> PASSWORD:' : 'Password'}
                    </Label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                        isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                      }`} />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder={isDark ? "********" : "Enter your password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 font-mono border ${
                          isDark 
                            ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#00FF88]' 
                            : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className={`w-full font-mono font-bold border-2 ${
                      isDark 
                        ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]' 
                        : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isDark ? 'AUTHENTICATING...' : 'Signing in...'}
                      </>
                    ) : (
                      isDark ? 'EXECUTE_LOGIN()' : 'Sign In'
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username" className={`font-mono text-xs ${
                      isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'
                    }`}>
                      {isDark ? '> NEW_USERNAME:' : 'Username'}
                    </Label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                        isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                      }`} />
                      <Input
                        id="register-username"
                        placeholder={isDark ? "create_new_user..." : "Choose a username"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`pl-10 font-mono border ${
                          isDark 
                            ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#00FF88]' 
                            : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className={`font-mono text-xs ${
                      isDark ? 'text-[#00FF88]' : 'text-[#2563EB]'
                    }`}>
                      {isDark ? '> SET_PASSWORD:' : 'Password'}
                    </Label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                        isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                      }`} />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder={isDark ? "********" : "Choose a password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 font-mono border ${
                          isDark 
                            ? 'bg-[#0B0F14] border-[#1F2937] text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#00FF88]' 
                            : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]'
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className={`w-full font-mono font-bold border-2 ${
                      isDark 
                        ? 'bg-[#00FF88] text-[#0B0F14] border-[#00FF88] hover:bg-[#00FF88]/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]' 
                        : 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#2563EB]/90'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isDark ? 'CREATING_ACCOUNT...' : 'Creating account...'}
                      </>
                    ) : (
                      isDark ? 'INITIALIZE_USER()' : 'Create Account'
                    )}
                  </Button>
                </TabsContent>
              </form>
            </Tabs>
          </CardContent>
        </Card>

        {/* Social Icons - TAMBAH TIKTOK */}
        <div className="flex justify-center gap-4 mt-6">
          <a 
            href="https://x.com/rinzx_" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`p-3 rounded border transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'bg-[#161B22] border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10 hover:border-[#00FF88] hover:text-[#00FF88]' 
                : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10 hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
            aria-label="X (Twitter)"
          >
            <XIcon />
          </a>
          <a 
            href="https://t.me/+MGzRobr9cp4yMTk1" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`p-3 rounded border transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'bg-[#161B22] border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10 hover:border-[#00FF88] hover:text-[#00FF88]' 
                : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10 hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
            aria-label="Telegram"
          >
            <TelegramIcon />
          </a>
          <a 
            href="https://github.com/Rangger0" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`p-3 rounded border transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'bg-[#161B22] border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10 hover:border-[#00FF88] hover:text-[#00FF88]' 
                : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10 hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
            aria-label="GitHub"
          >
            <GithubIcon />
          </a>
          {/* TIKTOK ICON */}
          <a 
            href="https://www.tiktok.com/@rinzzx0" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`p-3 rounded border transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'bg-[#161B22] border-[#1F2937] text-[#6B7280] hover:bg-[#00FF88]/10 hover:border-[#00FF88] hover:text-[#00FF88]' 
                : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-[#2563EB]/10 hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
            aria-label="TikTok"
          >
            <TikTokIcon />
          </a>
        </div>

        {/* Theme Toggle */}
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className={`font-mono text-xs border ${
              isDark 
                ? 'text-[#6B7280] border-[#1F2937] hover:bg-[#00FF88]/10 hover:text-[#00FF88]' 
                : 'text-[#6B7280] border-[#E5E7EB] hover:bg-[#2563EB]/10 hover:text-[#2563EB]'
            }`}
          >
            {isDark ? '[LIGHT_MODE]' : '[DARK_MODE]'}
          </Button>
        </div>
      </div>
    </div>
  );
}