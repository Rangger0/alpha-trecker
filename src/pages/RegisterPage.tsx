// src/pages/RegisterPage.tsx
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

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error("Registration failed.");
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.log("AUTH ERROR:", err);
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Join Alpha Tracker!"
      subtitle="Create your account and start managing your airdrop projects like a pro with our advanced tools and features."
      features={[
        'AI-powered airdrop generator',
        'Advanced financial tools',
        'Smart notification system',
      ]}
      gradient="green"
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
            Create your account
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Join thousands of web3 enthusiasts
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
                placeholder="Create a password"
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className={`font-mono text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className={`w-full h-12 font-mono font-bold text-base ${
              isDark 
                ? 'bg-[#00FF88] text-[#0B0F14] hover:bg-[#00FF88]/90' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'REGISTER'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className={`font-medium hover:underline ${
              isDark ? 'text-[#00FF88]' : 'text-emerald-600'
            }`}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}