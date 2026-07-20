import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
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

  const getAuthErrorMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('invalid login credentials')) return 'Email atau password salah. Cek lagi data login kamu.';
    if (lowerMessage.includes('email not confirmed')) return 'Email belum dikonfirmasi. Cek inbox kamu dulu.';
    return message;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) throw authError;
      if (!data.session) throw new Error('Login failed. Session not created.');

      setSuccess(rememberMe ? 'Access verified. Opening command center...' : 'Session verified. Opening command center...');
      window.setTimeout(() => navigate('/overview'), 350);
    } catch (err: unknown) {
      const message = err instanceof Error ? getAuthErrorMessage(err.message) : 'Authentication failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/overview`,
        },
      });

      if (authError) throw authError;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign in failed';
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="alpha-auth-card">
      <div className="alpha-auth-card-header">
        <p>Secure Login</p>
        <h2>Open your Alpha command center</h2>
        <span>Continue to research, wallet scans, funding signals, and project tracking.</span>
      </div>

      {error ? (
        <Alert variant="destructive" className="alpha-auth-alert alpha-auth-alert--error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {success ? (
        <Alert className="alpha-auth-alert alpha-auth-alert--success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="alpha-auth-form">
        <div className="alpha-auth-field-group">
          <Label htmlFor="login-email">Email</Label>
          <div className="alpha-auth-input-wrap">
            <Mail className="h-4 w-4" />
            <Input
              id="login-email"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isBusy}
              required
            />
          </div>
        </div>

        <div className="alpha-auth-field-group">
          <Label htmlFor="login-password">Password</Label>
          <div className="alpha-auth-input-wrap">
            <Lock className="h-4 w-4" />
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
            <span>Remember me</span>
          </label>

          <a href="/forgot-password" className="alpha-auth-text-link">
            Forgot password?
          </a>
        </div>

        <Button type="submit" className="alpha-auth-submit" disabled={isBusy}>
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

      <div className="alpha-auth-divider">
        <span>OR</span>
      </div>

      <div className="alpha-auth-social-grid">
        <button type="button" onClick={handleGoogleSignIn} disabled={isBusy}>
          <span>G</span>
          Continue with Google
        </button>
      </div>

      <p className="alpha-auth-footer-copy">
        New researcher?{' '}
        <Link to="/register" state={{ authTransition: 'left' }}>
          Create Account
        </Link>
      </p>
    </div>
  );
}
