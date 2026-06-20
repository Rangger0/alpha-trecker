import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

export type AuthMode = 'login' | 'register';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onOpenChange: (open: boolean) => void;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.5C17.1 3.1 14.8 2 12 2 6.9 2 2.7 6.1 2.7 12S6.9 22 12 22c5.6 0 9.3-3.9 9.3-9.5 0-.6-.1-1.1-.2-1.6H12z" />
      <path fill="#34A853" d="M3.9 7.3l3.2 2.4C8 8 9.8 6.7 12 6.7c1.9 0 3.1.8 3.9 1.5l2.6-2.5C17.1 3.1 14.8 2 12 2 8.4 2 5.3 4.1 3.9 7.3z" opacity="0" />
    </svg>
  );
}

export function AuthModal({ isOpen, initialMode = 'login', onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setSuccess('');
    }
  }, [initialMode, isOpen]);

  const getAuthErrorMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('invalid login credentials')) {
      return 'Email atau password salah. Cek lagi data login kamu.';
    }

    if (lowerMessage.includes('email not confirmed')) {
      return 'Email belum dikonfirmasi. Cek inbox email kamu dulu sebelum login.';
    }

    if (lowerMessage.includes('signup disabled')) {
      return 'Pendaftaran email sedang dinonaktifkan di Supabase Auth.';
    }

    return message;
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

  const openWorkspace = () => {
    onOpenChange(false);
    navigate('/overview', { replace: true, state: { dashboardEntry: true } });
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/overview` },
      });

      if (error) throw error;
    } catch (err: unknown) {
      const message = err instanceof Error ? getAuthErrorMessage(err.message) : 'Google sign in failed';
      setError(message);
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Enter your email first to reset your password.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/?mode=login#auth`,
      });

      if (error) throw error;
      setSuccess('Password reset link sent. Check your inbox.');
    } catch (err: unknown) {
      const message = err instanceof Error ? getAuthErrorMessage(err.message) : 'Could not send reset email';
      setError(message);
    } finally {
      setIsLoading(false);
    }
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

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
        const { data: sessionData } = await supabase.auth.getSession();
        if (!data.session && !sessionData.session) {
          throw new Error('Login failed. Session not created.');
        }

        setSuccess('Authentication success. Opening workspace...');
        window.setTimeout(openWorkspace, 360);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Registration failed.');

      if (data.session) {
        setSuccess('Workspace created. Opening workspace...');
        window.setTimeout(openWorkspace, 360);
      } else {
        setSuccess('Account created. Check your email if confirmation is enabled.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? getAuthErrorMessage(err.message) : 'Authentication failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isRegister = mode === 'register';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="alpha-rd-auth alpha-auth-modal p-0" showCloseButton>
        <div className="alpha-rd-auth-inner">
          <div className="alpha-rd-auth-logo">
            <img src="/logo/logo.png" alt="Alpha Tracker" />
            <span>Alpha Tracker</span>
          </div>

          <div>
            <DialogTitle className="alpha-rd-auth-title">
              {isRegister ? 'Create account' : 'Welcome back'}
            </DialogTitle>
            <DialogDescription className="alpha-rd-auth-sub">
              {isRegister ? 'Start tracking with Alpha Tracker' : 'Sign in to continue to Alpha Tracker'}
            </DialogDescription>
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

          <form onSubmit={handleSubmit} className="alpha-rd-auth-form">
            <div className="alpha-rd-field">
              <label htmlFor={`${mode}-email`}>Email Address</label>
              <div className="alpha-rd-input">
                <Mail />
                <input
                  id={`${mode}-email`}
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="alpha-rd-field">
              <label htmlFor={`${mode}-password`}>Password</label>
              <div className="alpha-rd-input">
                <Lock />
                <input
                  id={`${mode}-password`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isRegister ? 'Create password' : 'Enter password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isRegister ? (
              <div className="alpha-rd-field">
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className="alpha-rd-input">
                  <Lock />
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    disabled={isLoading}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ) : null}

            {!isRegister ? (
              <div className="alpha-rd-auth-rowbetween">
                <label className="alpha-rd-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    disabled={isLoading}
                  />
                  Remember me
                </label>
                <button type="button" className="alpha-rd-link" onClick={handleForgotPassword} disabled={isLoading}>
                  Forgot password?
                </button>
              </div>
            ) : null}

            <button type="submit" className="alpha-rd-auth-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isRegister ? 'Creating Account' : 'Signing In'}
                </>
              ) : isRegister ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="alpha-rd-divider">OR</div>

          <button type="button" className="alpha-rd-google" onClick={handleGoogleSignIn} disabled={isLoading}>
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="alpha-rd-auth-footer">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              className="alpha-rd-link"
              onClick={() => switchMode(isRegister ? 'login' : 'register')}
              disabled={isLoading}
            >
              {isRegister ? 'Sign in' : 'Create account'}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
