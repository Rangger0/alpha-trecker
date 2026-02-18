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
      isDark ? 'bg-[#0a0a0f]' : 'bg-gray-100'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-5 ${
        isDark ? 'bg-[radial-gradient(#00ff00_1px,transparent_1px)]' : 'bg-[radial-gradient(#000_1px,transparent_1px)]'
      }`} style={{ backgroundSize: '20px 20px' }} />
      
      {/* Scanline Effect */}
      {isDark && <div className="absolute inset-0 scanline pointer-events-none" />}

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className={`relative w-24 h-24 mb-4 rounded border-2 flex items-center justify-center ${
            isDark ? 'bg-[#0f0f14] border-[#00ff00] shadow-[0_0_30px_rgba(0,255,0,0.3)]' : 'bg-white border-gray-800 shadow-lg'
          }`}>
            <Terminal className={`w-12 h-12 ${isDark ? 'text-[#00ff00]' : 'text-gray-800'}`} />
          </div>
          <h1 className={`text-3xl font-bold tracking-tighter font-mono ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <span className={isDark ? 'text-[#00ff00]' : 'text-gray-900'}>ALPHA</span>
            <span className={isDark ? 'text-white' : 'text-gray-600'}>_TRACKER</span>
            <span className={`animate-pulse ${isDark ? 'text-[#00ff00]' : 'text-gray-400'}`}>_</span>
          </h1>
          <p className={`mt-2 text-sm font-mono ${
            isDark ? 'text-gray-500' : 'text-gray-600'
          }`}>
            {isDark ? '> INITIALIZING_SECURE_CONNECTION...' : 'Crypto Airdrop Hunter Dashboard'}
          </p>
        </div>

        {/* Card */}
        <Card className={`border-2 shadow-2xl overflow-hidden ${
          isDark
            ? 'bg-[#0f0f14]/90 border-[#00ff00]/30'
            : 'bg-white/90 border-gray-300'
        }`}>
          <CardHeader className="space-y-1">
            <CardTitle className={`text-2xl text-center font-mono ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {isDark ? '> AUTHENTICATION_REQUIRED' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className={`text-center font-mono text-xs ${
              isDark ? 'text-gray-500' : 'text-gray-600'
            }`}>
              {isDark ? 'root@alpha-tracker:~$ login --secure' : 'Enter your credentials to access your dashboard'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
              <TabsList className={`grid w-full grid-cols-2 mb-6 border-2 font-mono ${
                isDark ? 'bg-[#0a0a0f] border-[#00ff00]/30' : 'bg-gray-100 border-gray-300'
              }`}>
                <TabsTrigger 
                  value="login" 
                  className={`font-mono data-[state=active]:bg-[#00ff00] data-[state=active]:text-black ${
                    isDark ? 'text-[#00ff00]' : 'text-gray-700'
                  }`}
                >
                  LOGIN
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className={`font-mono data-[state=active]:bg-[#00ff00] data-[state=active]:text-black ${
                    isDark ? 'text-[#00ff00]' : 'text-gray-700'
                  }`}
                >
                  REGISTER
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className={`mb-4 border-2 font-mono ${
                  isDark ? 'bg-red-900/20 border-red-500/50 text-red-400' : 'bg-red-50 border-red-300'
                }`}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-mono text-xs">ERROR: {error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username" className={`font-mono text-xs ${
                      isDark ? 'text-[#00ff00]' : 'text-gray-700'
                    }`}>
                      {isDark ? '> USERNAME:' : 'Username'}
                    </Label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                        isDark ? 'text-[#00ff00]/50' : 'text-gray-400'
                      }`} />
                      <Input
                        id="login-username"
                        placeholder={isDark ? "enter_credentials..." : "Enter your username"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`pl-10 font-mono border-2 ${
                          isDark 
                            ? 'bg-[#0a0a0f] border-[#00ff00]/30 text-[#00ff00] placeholder:text-[#00ff00]/30 focus:border-[#00ff00]' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-900'
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className={`font-mono text-xs ${
                      isDark ? 'text-[#00ff00]' : 'text-gray-700'
                    }`}>
                      {isDark ? '> PASSWORD:' : 'Password'}
                    </Label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                        isDark ? 'text-[#00ff00]/50' : 'text-gray-400'
                      }`} />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder={isDark ? "********" : "Enter your password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 font-mono border-2 ${
                          isDark 
                            ? 'bg-[#0a0a0f] border-[#00ff00]/30 text-[#00ff00] placeholder:text-[#00ff00]/30 focus:border-[#00ff00]' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-900'
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className={`w-full font-mono font-bold border-2 ${
                      isDark 
                        ? 'bg-[#00ff00] text-black border-[#00ff00] hover:bg-[#00ff00]/90 hover:shadow-[0_0_20px_rgba(0,255,0,0.4)]' 
                        : 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700'
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
                      isDark ? 'text-[#00ff00]' : 'text-gray-700'
                    }`}>
                      {isDark ? '> NEW_USERNAME:' : 'Username'}
                    </Label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                        isDark ? 'text-[#00ff00]/50' : 'text-gray-400'
                      }`} />
                      <Input
                        id="register-username"
                        placeholder={isDark ? "create_new_user..." : "Choose a username"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`pl-10 font-mono border-2 ${
                          isDark 
                            ? 'bg-[#0a0a0f] border-[#00ff00]/30 text-[#00ff00] placeholder:text-[#00ff00]/30 focus:border-[#00ff00]' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-900'
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className={`font-mono text-xs ${
                      isDark ? 'text-[#00ff00]' : 'text-gray-700'
                    }`}>
                      {isDark ? '> SET_PASSWORD:' : 'Password'}
                    </Label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                        isDark ? 'text-[#00ff00]/50' : 'text-gray-400'
                      }`} />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder={isDark ? "********" : "Choose a password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 font-mono border-2 ${
                          isDark 
                            ? 'bg-[#0a0a0f] border-[#00ff00]/30 text-[#00ff00] placeholder:text-[#00ff00]/30 focus:border-[#00ff00]' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-900'
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className={`w-full font-mono font-bold border-2 ${
                      isDark 
                        ? 'bg-[#00ff00] text-black border-[#00ff00] hover:bg-[#00ff00]/90 hover:shadow-[0_0_20px_rgba(0,255,0,0.4)]' 
                        : 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700'
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

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-6">
          <a 
            href="https://x.com/rinzx_" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`p-3 rounded border-2 transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'bg-[#0f0f14] border-[#00ff00]/30 text-[#00ff00] hover:bg-[#00ff00]/10 hover:border-[#00ff00]' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
            }`}
            aria-label="X (Twitter)"
          >
            <XIcon />
          </a>
          <a 
            href="https://t.me/+MGzRobr9cp4yMTk1" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`p-3 rounded border-2 transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'bg-[#0f0f14] border-[#00ff00]/30 text-[#00ff00] hover:bg-[#00ff00]/10 hover:border-[#00ff00]' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
            }`}
            aria-label="Telegram"
          >
            <TelegramIcon />
          </a>
          <a 
            href="https://github.com/Rangger0" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`p-3 rounded border-2 transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'bg-[#0f0f14] border-[#00ff00]/30 text-[#00ff00] hover:bg-[#00ff00]/10 hover:border-[#00ff00]' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
            }`}
            aria-label="GitHub"
          >
            <GithubIcon />
          </a>
        </div>

        {/* Theme Toggle */}
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className={`font-mono text-xs border ${
              isDark 
                ? 'text-[#00ff00] border-[#00ff00]/30 hover:bg-[#00ff00]/10' 
                : 'text-gray-600 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {isDark ? '[LIGHT_MODE]' : '[DARK_MODE]'}
          </Button>
        </div>
      </div>
    </div>
  );
}