// src/pages/LoginPage.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (!data.session) {
        throw new Error("Login failed. Session not created.");
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.log("AUTH ERROR:", err);
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Sign in to your Alpha Tracker account and continue managing your airdrop projects with our powerful tools."
      features={[
        'Track multiple airdrop projects',
        'Real-time market data',
        'Priority project management',
      ]}
      gradient="blue"
    >
    
<div className={`p-8 rounded-2xl border shadow-2xl backdrop-blur-md ${
  isDark 
    ? 'bg-[#161B22]/90 border-[#1F2937]/50' 
    : 'bg-white/90 border-gray-200/50'
}`}>
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold font-mono mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Sign in to your account
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Welcome back! Please enter your details.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className={`font-mono text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </Label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 h-12 font-mono ${
                  isDark 
                    ? 'bg-[#0B0F14] border-[#1F2937] text-white placeholder:text-gray-600' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className={`font-mono text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </Label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-10 pr-10 h-12 font-mono ${
                  isDark 
                    ? 'bg-[#0B0F14] border-[#1F2937] text-white placeholder:text-gray-600' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className={`w-full h-12 font-mono font-bold text-base ${
              isDark 
                ? 'bg-[#00FF88] text-[#0B0F14] hover:bg-[#00FF88]/90' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              'LOGIN'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <a href="#" className={`block text-sm hover:underline ${
            isDark ? 'text-[#00FF88]' : 'text-blue-600'
          }`}>
            Forgot Password?
          </a>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Not a member?{' '}
            <Link to="/register" className={`font-medium hover:underline ${
              isDark ? 'text-[#00FF88]' : 'text-blue-600'
            }`}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}