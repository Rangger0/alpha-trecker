import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type AuthMode = 'login' | 'register';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ isOpen, initialMode = 'login', onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      <DialogContent className="alpha-auth-modal max-w-[min(92vw,460px)] rounded-[1.4rem] border p-0" showCloseButton>
        <div className="alpha-auth-modal-inner">
          <DialogHeader className="text-left">
            <p className="macos-section-label">Alpha Tracker</p>
            <DialogTitle className="alpha-auth-modal-title">
              {isRegister ? 'Create your workspace' : 'Sign in to workspace'}
            </DialogTitle>
            <DialogDescription className="alpha-auth-modal-copy">
              Track projects, wallets, eligibility, and rewards with one account.
            </DialogDescription>
          </DialogHeader>

          <div className="alpha-landing-auth-tabs" aria-label="Authentication mode">
            <button type="button" onClick={() => switchMode('login')} data-active={!isRegister}>
              Sign In
            </button>
            <button type="button" onClick={() => switchMode('register')} data-active={isRegister}>
              Create Account
            </button>
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
              <Label htmlFor={`${mode}-email`}>Email</Label>
              <div className="alpha-auth-input-wrap">
                <Mail className="h-4 w-4" />
                <Input
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

            <div className="alpha-auth-field-group">
              <Label htmlFor={`${mode}-password`}>Password</Label>
              <div className="alpha-auth-input-wrap">
                <Lock className="h-4 w-4" />
                <Input
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
              <div className="alpha-auth-field-group">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="alpha-auth-input-wrap">
                  <Lock className="h-4 w-4" />
                  <Input
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

            <Button type="submit" className="alpha-auth-submit" disabled={isLoading}>
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
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
