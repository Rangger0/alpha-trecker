import { Suspense, lazy, type ComponentType, type ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { Toaster } from '@/components/ui/sonner';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

const lazyNamed = <T extends ComponentType<unknown>>(
  loader: () => Promise<Record<string, T>>,
  exportName: string,
) => lazy(async () => {
  const module = await loader();
  return { default: module[exportName] };
});

const LandingPage = lazyNamed(() => import('@/pages/LandingPage'), 'LandingPage');
const LoginPage = lazyNamed(() => import('@/pages/LoginPage'), 'LoginPage');
const RegisterPage = lazyNamed(() => import('@/pages/RegisterPage'), 'RegisterPage');
const AuthPage = lazyNamed(() => import('@/pages/AuthPage'), 'AuthPage');
const OverviewPage = lazyNamed(() => import('@/pages/OverviewPage'), 'OverviewPage');
const EcosystemPage = lazyNamed(() => import('@/pages/EcosystemPage'), 'EcosystemPage');
const EcosystemDetailPage = lazyNamed(() => import('@/pages/EcosystemDetailPage'), 'EcosystemDetailPage');
const PriorityProjectsPage = lazyNamed(() => import('@/pages/PriorityProjectsPage'), 'PriorityProjectsPage');
const FaucetPage = lazyNamed(() => import('@/pages/FaucetPage'), 'FaucetPage');
const MultipleAccountPage = lazyNamed(() => import('@/pages/MultipleAccountPage'), 'MultipleAccountPage');
const AboutPage = lazyNamed(() => import('@/pages/AboutPage'), 'AboutPage');
const ScreeningAddressPage = lazyNamed(() => import('@/pages/ScreeningAddressPage'), 'ScreeningAddressPage');
const CheckEligibilityPage = lazyNamed(() => import('@/pages/CheckEligibilityPage'), 'CheckEligibilityPage');
const ToolsPage = lazyNamed(() => import('@/pages/ToolsPage'), 'ToolsPage');
const DeployToolsPage = lazyNamed(() => import('@/pages/DeployToolsPage'), 'DeployToolsPage');
const AIToolsPage = lazyNamed(() => import('@/pages/AIToolsPage'), 'AIToolsPage');
const SwapPage = lazyNamed(() => import('@/pages/SwapPage'), 'SwapPage');
const RewardVaultPage = lazyNamed(() => import('@/pages/RewardVaultPage'), 'RewardVaultPage');
const FeedbackInboxPage = lazyNamed(() => import('@/pages/FeedbackInboxPage'), 'FeedbackInboxPage');
const FloatingFeedback = lazyNamed(() => import('@/components/feedback/FloatingFeedback'), 'FloatingFeedback');

const LazyDashboard = lazy(() => import('@/pages/Dashboard'));

function AppLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center alpha-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[color:var(--alpha-highlight)] border-t-transparent" />
        <p className="alpha-text-muted font-mono">Loading...</p>
      </div>
    </div>
  );
}

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <div className="macos-route-transition">
      {children}
    </div>
  );
}

function GuestAuthShell() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <AppLoader />;
  }

  return isAuthenticated ? <Navigate to="/overview" replace /> : <AuthPage />;
}

function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AppLoader />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestRuntimeShell() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

function AppRuntimeShell() {
  return (
    <AuthProvider>
      <WalletProvider>
        <Outlet />
        <Suspense fallback={null}>
          <FloatingFeedback />
        </Suspense>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--alpha-panel)',
              border: '1px solid var(--alpha-border)',
              color: 'var(--alpha-text)',
            },
          }}
        />
      </WalletProvider>
    </AuthProvider>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        <Route path="/" element={
          <PageTransition><LandingPage /></PageTransition>
        } />

        <Route element={<GuestRuntimeShell />}>
          <Route element={<GuestAuthShell />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Route>

        <Route element={<AppRuntimeShell />}>
          <Route
            path="/screening"
            element={<PageTransition><ScreeningAddressPage /></PageTransition>}
          />
          <Route
            path="/check-eligibility"
            element={<PageTransition><CheckEligibilityPage /></PageTransition>}
          />
          <Route
            path="/faucet"
            element={<PageTransition><FaucetPage /></PageTransition>}
          />
          <Route
            path="/tools"
            element={<PageTransition><ToolsPage /></PageTransition>}
          />
          <Route
            path="/deploy"
            element={<PageTransition><DeployToolsPage /></PageTransition>}
          />
          <Route
            path="/ai-tools"
            element={<PageTransition><AIToolsPage /></PageTransition>}
          />
          <Route
            path="/swap-bridge"
            element={<PageTransition><SwapPage /></PageTransition>}
          />
          <Route
            path="/swap"
            element={<Navigate to="/swap-bridge" replace />}
          />

          <Route element={<RequireAuth />}>
            <Route
              path="/overview"
              element={<PageTransition><OverviewPage /></PageTransition>}
            />
            <Route
              path="/dashboard"
              element={<PageTransition><LazyDashboard /></PageTransition>}
            />
            <Route
              path="/ecosystem"
              element={<PageTransition><EcosystemPage /></PageTransition>}
            />
            <Route
              path="/ecosystem/:id"
              element={<PageTransition><EcosystemDetailPage /></PageTransition>}
            />
            <Route
              path="/priority-projects"
              element={<PageTransition><PriorityProjectsPage /></PageTransition>}
            />
            <Route
              path="/reward-vault"
              element={<PageTransition><RewardVaultPage /></PageTransition>}
            />
            <Route
              path="/feedback-inbox"
              element={<PageTransition><FeedbackInboxPage /></PageTransition>}
            />
            <Route
              path="/multiple-account"
              element={<PageTransition><MultipleAccountPage /></PageTransition>}
            />
            <Route
              path="/about"
              element={<PageTransition><AboutPage /></PageTransition>}
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App;
