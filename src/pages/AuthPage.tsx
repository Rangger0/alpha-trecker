import { Outlet, useLocation } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';

const authCopy = {
  login: {
    title: 'Welcome Back!',
    subtitle:
      'Sign in to your Alpha Tracker account and continue managing projects, wallets, and ecosystem progress in one calmer workspace.',
    features: [
      'Track multiple airdrop projects',
      'Monitor ecosystem progress in real time',
      'Keep notes, wallets, and priorities aligned',
    ],
  },
  register: {
    title: 'Join Alpha Tracker!',
    subtitle:
      'Create your workspace, organize every ecosystem you follow, and keep your dashboard cleaner from day one.',
    features: [
      'Manage ecosystems and project boards in one place',
      'Keep wallet notes, reminders, and priorities together',
      'Start with a dashboard flow that stays simple on mobile',
    ],
  },
} as const;

export function AuthPage() {
  const { pathname } = useLocation();
  const copy = pathname === '/register' ? authCopy.register : authCopy.login;

  return (
    <AuthLayout
      title={copy.title}
      subtitle={copy.subtitle}
      features={copy.features}
    >
      <Outlet />
    </AuthLayout>
  );
}
