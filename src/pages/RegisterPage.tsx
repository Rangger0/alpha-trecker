import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isBusy = isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must include at least one letter and one number.');
      return;
    }

    if (!acceptedTerms) {
      setError('You must accept the terms to create an account.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Registration failed.');
      }

      if (data.session) {
        setSuccess('Workspace created. Opening dashboard...');
        window.setTimeout(() => navigate('/overview'), 350);
      } else {
        setSuccess('Account created. Check your email if confirmation is enabled.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="alpha-auth-card">
      <div className="alpha-auth-card-header">
        <p>Create Account</p>
        <h2>Start your Alpha Tracker workspace</h2>
        <span>Set up a focused place for research, tracking, execution, and review.</span>
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
          <Label htmlFor="name">Name</Label>
          <div className="alpha-auth-input-wrap">
            <User className="h-4 w-4" />
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isBusy}
              required
            />
          </div>
        </div>

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

        <div className="alpha-auth-field-grid">
          <div className="alpha-auth-field-group">
            <Label htmlFor="password">Password</Label>
            <div className="alpha-auth-input-wrap">
              <Lock className="h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create password"
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

          <div className="alpha-auth-field-group">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="alpha-auth-input-wrap">
              <Lock className="h-4 w-4" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
        </div>

        <label className="alpha-auth-checkbox alpha-auth-terms">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            disabled={isBusy}
          />
          <span>I agree to the terms and workspace access policy.</span>
        </label>

        <Button type="submit" className="alpha-auth-submit" disabled={isBusy || !acceptedTerms}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Account
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <p className="alpha-auth-footer-copy">
        Already have account?{' '}
        <Link to="/login" state={{ authTransition: 'right' }}>
          Sign In
        </Link>
      </p>
    </div>
  );
}
