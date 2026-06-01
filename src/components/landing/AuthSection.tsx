import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AuthMode = 'login' | 'register';
type EntryPhase = 'idle' | 'success' | 'fade' | 'power' | 'reveal';

const formVariants = {
  initial: { opacity: 0, x: 24, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -24, scale: 0.98 },
};

export function AuthSection() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [entryPhase, setEntryPhase] = useState<EntryPhase>('idle');
  const navigate = useNavigate();

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

  const runDashboardTransition = () => {
    setEntryPhase('success');
    window.setTimeout(() => setEntryPhase('fade'), 300);
    window.setTimeout(() => setEntryPhase('power'), 500);
    window.setTimeout(() => setEntryPhase('reveal'), 980);
    window.setTimeout(() => {
      navigate('/overview', {
        replace: true,
        state: { dashboardEntry: true },
      });
    }, 1320);
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

        setSuccess('Authentication success. Opening dashboard...');
        runDashboardTransition();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Registration failed.');

      if (data.session) {
        setSuccess('Workspace created. Opening dashboard...');
        runDashboardTransition();
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

  const isBusy = isLoading || entryPhase !== 'idle';
  const isRegister = mode === 'register';

  return (
    <section id="auth" className="alpha-landing-auth-section px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="macos-landing-width alpha-landing-auth-grid">
        <div className="alpha-landing-auth-copy">
          <p className="macos-section-label">Start tracking</p>
          <h2>Turn scattered alpha into a disciplined workspace.</h2>
          <p>
            Sign in or create an account with email. Alpha Tracker uses Supabase session management so your workspace
            opens cleanly without local auth storage.
          </p>
        </div>

        <div className="alpha-landing-auth-card">
          <div className="alpha-landing-auth-tabs" aria-label="Authentication mode">
            <button type="button" onClick={() => switchMode('login')} data-active={!isRegister}>
              Sign In
            </button>
            <button type="button" onClick={() => switchMode('register')} data-active={isRegister}>
              Create Account
            </button>
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

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={handleSubmit}
              className="alpha-auth-form"
            >
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
                    disabled={isBusy}
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
                      disabled={isBusy}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      disabled={isBusy}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ) : null}

              <Button type="submit" className="alpha-auth-submit" disabled={isBusy}>
                {isLoading || entryPhase !== 'idle' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {entryPhase !== 'idle' ? 'Opening Workspace' : isRegister ? 'Creating Account' : 'Signing In'}
                  </>
                ) : isRegister ? (
                  'Create Account'
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.form>
          </AnimatePresence>

          <p className="alpha-auth-footer-copy">
            {isRegister ? 'Already have an account?' : 'New to Alpha Tracker?'}{' '}
            <button type="button" onClick={() => switchMode(isRegister ? 'login' : 'register')} disabled={isBusy}>
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>

      <AnimatePresence>
        {entryPhase !== 'idle' ? (
          <motion.div
            className="alpha-dashboard-entry-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: entryPhase === 'success' ? 0.72 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: entryPhase === 'success' ? 0.3 : 0.2 }}
          >
            <motion.div
              className="alpha-dashboard-power-line"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: entryPhase === 'power' || entryPhase === 'reveal' ? 1 : 0,
                opacity: entryPhase === 'power' || entryPhase === 'reveal' ? 1 : 0,
              }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="alpha-dashboard-power-glow"
              initial={{ opacity: 0, scaleY: 0.02 }}
              animate={{
                opacity: entryPhase === 'reveal' ? 1 : 0,
                scaleY: entryPhase === 'reveal' ? 1 : 0.02,
              }}
              transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
