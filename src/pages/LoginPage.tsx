import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isBusy = isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (!data.session) {
        throw new Error('Login failed. Session not created.');
      }

      setSuccess(rememberMe ? 'Access verified. Opening your workspace...' : 'Access verified for this session.');
      window.setTimeout(() => navigate('/overview'), 350);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/overview`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign in failed';
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`alpha-theme ${theme} min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden`}
      style={{
        backgroundColor: 'var(--alpha-bg)',
      }}
    >
      {/* Decorative background elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--alpha-accent), transparent)',
        }}
      />

      {/* Animated card entrance */}
      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div
          className="rounded-2xl border p-8 sm:p-10 backdrop-blur-md transition-all duration-300"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--alpha-panel) 90%, transparent)',
            borderColor: 'var(--alpha-border)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="mb-4">
              <p className="text-xs font-semibold tracking-wider opacity-60" style={{ color: 'var(--alpha-accent)' }}>
                ALPHA TRACKER
              </p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--alpha-text)' }}>
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: 'var(--alpha-text-muted)' }}>
              Sign in to continue to Alpha Tracker
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <Alert variant="destructive" className="mb-6 animate-fade-in-up border-red-200" style={{ backgroundColor: 'color-mix(in srgb, rgb(239, 68, 68) 10%, transparent)', animationDelay: '0.15s' }}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 animate-fade-in-up" style={{ backgroundColor: 'color-mix(in srgb, var(--alpha-accent) 10%, transparent)', borderColor: 'var(--alpha-accent)', animationDelay: '0.15s' }}>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium" style={{ color: 'var(--alpha-text)' }}>
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200" style={{ color: 'var(--alpha-text-muted)' }} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isBusy}
                  className="pl-10 rounded-lg border transition-all duration-200 focus:ring-2"
                  style={{
                    borderColor: 'var(--alpha-border)',
                    backgroundColor: 'color-mix(in srgb, var(--alpha-panel) 50%, transparent)',
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium" style={{ color: 'var(--alpha-text)' }}>
                  Password
                </Label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200" style={{ color: 'var(--alpha-text-muted)' }} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isBusy}
                  className="pl-10 pr-10 rounded-lg border transition-all duration-200 focus:ring-2"
                  style={{
                    borderColor: 'var(--alpha-border)',
                    backgroundColor: 'color-mix(in srgb, var(--alpha-panel) 50%, transparent)',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={isBusy}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 hover:opacity-80"
                  style={{ color: 'var(--alpha-text-muted)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  disabled={isBusy}
                  className="w-4 h-4 rounded border transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor: 'var(--alpha-border)',
                    accentColor: 'var(--alpha-accent)',
                  }}
                />
                <span style={{ color: 'var(--alpha-text-muted)' }}>Remember me</span>
              </label>

              <a
                href="/forgot-password"
                className="transition-colors duration-200 hover:opacity-80 font-medium"
                style={{ color: 'var(--alpha-accent)' }}
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isBusy}
              className="w-full h-11 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--alpha-accent)',
                color: 'white',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing In
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div
              className="absolute inset-0 flex items-center"
              style={{
                background: 'var(--alpha-border)',
                height: '1px',
              }}
            />
            <div
              className="relative flex justify-center text-xs font-medium"
              style={{ color: 'var(--alpha-text-muted)' }}
            >
              <span
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--alpha-panel) 90%, transparent)',
                  padding: '0 12px',
                }}
              >
                OR
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isBusy}
            variant="outline"
            className="w-full h-11 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            style={{
              borderColor: 'var(--alpha-border)',
              color: 'var(--alpha-text)',
              backgroundColor: 'transparent',
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-sm mt-8" style={{ color: 'var(--alpha-text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold transition-colors duration-200 hover:opacity-80"
              style={{ color: 'var(--alpha-accent)' }}
            >
              Create account
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        input:focus {
          outline: none;
        }

        input:focus-visible {
          outline: none;
        }
      `}</style>
    </div>
  );
}
