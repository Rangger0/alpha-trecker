import { Outlet, useLocation } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';

const authCopy = {
  login: {
    title: 'Disciplined execution starts here.',
    subtitle:
      'Access your research desk, active opportunities, wallet follow-up, and reward review flow from one focused workspace.',
    features: [
      'Research and execution in one operating layer',
      'Wallet, eligibility, and reward context stay connected',
      'Built for daily review, not noisy speculation',
    ],
  },
  register: {
    title: 'Build a cleaner crypto workflow.',
    subtitle:
      'Create an Alpha Tracker workspace for structured research, tracking, execution, and outcome review.',
    features: [
      'Turn project discovery into a repeatable process',
      'Keep multiple accounts and actions easier to review',
      'Use one source of truth across the opportunity cycle',
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
