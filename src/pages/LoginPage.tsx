import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fieldStyle = {
    borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
    background: 'color-mix(in srgb, var(--alpha-surface) 90%, var(--alpha-panel) 10%)',
    color: 'var(--alpha-text)',
  } as const;

  const iconStyle = { color: 'var(--alpha-text-muted)' } as const;
  const labelStyle = { color: 'var(--alpha-text-muted)' } as const;
  const actionLinkStyle = { color: 'var(--alpha-accent)' } as const;

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
        throw new Error('Login failed. Session not created.');
      }

      navigate('/overview');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="macos-auth-card lg:min-h-[548px]">
      <div className="mb-6">
        <h2
          className="font-[ui-serif,Georgia,serif] text-[2.15rem] font-semibold leading-none sm:text-[2.35rem]"
          style={{ color: 'var(--alpha-text)' }}
        >
          Welcome Back...
        </h2>
        <p className="mt-2 text-sm leading-6" style={{ color: 'var(--alpha-text-muted)' }}>
          Please enter your email and password.
        </p>
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="mb-4 border-[color:var(--alpha-danger-border)] bg-[color:var(--alpha-danger-soft)] text-[color:var(--alpha-danger)]"
        >
          <AlertCircle className="h-4 w-4 text-[var(--alpha-danger)]" />
          <AlertDescription className="text-[var(--alpha-danger)]">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-mono text-[11px] uppercase tracking-[0.18em]" style={labelStyle}>
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={iconStyle} />
            <Input
              id="email"
              type="email"
              placeholder="user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="macos-auth-field h-[52px] pl-10 font-mono placeholder:opacity-60"
              style={fieldStyle}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="font-mono text-[11px] uppercase tracking-[0.18em]" style={labelStyle}>
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={iconStyle} />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="macos-auth-field h-[52px] pl-10 pr-10 font-mono placeholder:opacity-60"
              style={fieldStyle}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
              style={iconStyle}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <p className="text-xs leading-6" style={{ color: 'var(--alpha-text-muted)' }}>
          By login, you agree to our{' '}
          <a href="#" className="font-medium hover:underline" style={actionLinkStyle}>
            Terms & Conditions
          </a>
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            className="h-12 flex-1 rounded-xl border-0 font-mono text-base font-semibold transition-opacity duration-150 hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, var(--alpha-accent), color-mix(in srgb, var(--alpha-accent) 78%, var(--alpha-border) 22%))',
              color: 'var(--alpha-accent-contrast)',
              boxShadow: '0 18px 34px color-mix(in srgb, var(--alpha-accent) 26%, transparent)',
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Login...
              </>
            ) : (
              <span className="flex w-full items-center justify-between">
                <span>login...</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>

          <a
            href="#"
            className="shrink-0 text-xs font-medium transition-opacity hover:opacity-80"
            style={{ color: 'var(--alpha-text-muted)' }}
          >
            Forgot Password
          </a>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm" style={{ color: 'var(--alpha-text-muted)' }}>
          Don&apos;t have an account yet?{' '}
          <Link to="/register" state={{ authTransition: 'left' }} className="font-semibold hover:underline" style={actionLinkStyle}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
