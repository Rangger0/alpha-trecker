import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <div className="alpha-auth-card">
      <div className="alpha-auth-card-header">
        <p>Welcome Back</p>
        <h2>Sign in to Alpha Tracker</h2>
        <span>Continue your research, execution queue, and reward review.</span>
      </div>

      {error && (
        <Alert variant="destructive" className="alpha-auth-alert alpha-auth-alert--error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="alpha-auth-alert alpha-auth-alert--success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="alpha-auth-form">
        <div className="alpha-auth-field-group">
          <Label htmlFor="email">Email</Label>
          <div className="alpha-auth-input-wrap">
            <Mail className="h-4 w-4" />
            <Input
              id="email"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isBusy}
              required
            />
          </div>
        </div>

        <div className="alpha-auth-field-group">
          <Label htmlFor="password">Password</Label>
          <div className="alpha-auth-input-wrap">
            <Lock className="h-4 w-4" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isBusy}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              disabled={isBusy}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="alpha-auth-form-row">
          <label className="alpha-auth-checkbox">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              disabled={isBusy}
            />
            <span>Remember Me</span>
          </label>

          <a href="#" className="alpha-auth-text-link">
            Forgot Password
          </a>
        </div>

        <Button type="submit" className="alpha-auth-submit" disabled={isBusy}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing In
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <p className="alpha-auth-footer-copy">
        Don&apos;t have an account?{' '}
        <Link to="/register" state={{ authTransition: 'left' }}>
          Create Account
        </Link>
      </p>
    </div>
  );
}
