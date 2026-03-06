// src/App.tsx - Update routing
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AuthPage } from '@/pages/AuthPage';
import Dashboard from '@/pages/Dashboard';
import { OverviewPage } from '@/pages/OverviewPage';
import { EcosystemPage } from '@/pages/EcosystemPage';
import { EcosystemDetailPage } from '@/pages/EcosystemDetailPage';
import { PriorityProjectsPage } from '@/pages/PriorityProjectsPage';
import { FaucetPage } from '@/pages/FaucetPage';
import { MultipleAccountPage } from '@/pages/MultipleAccountPage';
import { AboutPage } from '@/pages/AboutPage';
import { Toaster } from '@/components/ui/sonner';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ScreeningAddressPage } from "@/pages/ScreeningAddressPage";
import { motion } from 'framer-motion';
import { ToolsPage } from '@/pages/ToolsPage';
import { AIToolsPage } from '@/pages/AIToolsPage';
import { SwapPage } from '@/pages/SwapPage';
import { RewardVaultPage } from '@/pages/RewardVaultPage';

// Page transition wrapper component
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const shouldAnimate = location.pathname === '/';

  if (!shouldAnimate) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.18,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center alpha-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="alpha-text-muted font-mono">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes location={location}>
      <Route path="/" element={
        <PageTransition><LandingPage /></PageTransition>
      } />
      <Route element={isAuthenticated ? <Navigate to="/overview" /> : <AuthPage />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route
        path="/screening"
        element={<PageTransition><ScreeningAddressPage /></PageTransition>}
      />
      <Route
        path="/overview"
        element={isAuthenticated ? <PageTransition><OverviewPage /></PageTransition> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <PageTransition><Dashboard /></PageTransition> : <Navigate to="/login" />}
      />
      <Route
        path="/ecosystem"
        element={isAuthenticated ? <PageTransition><EcosystemPage /></PageTransition> : <Navigate to="/login" />}
      />
      <Route
        path="/ecosystem/:id"
        element={isAuthenticated ? <PageTransition><EcosystemDetailPage /></PageTransition> : <Navigate to="/login" />}
      />
      <Route
        path="/priority-projects"
        element={isAuthenticated ? <PageTransition><PriorityProjectsPage /></PageTransition> : <Navigate to="/login" />}
      />
      <Route
        path="/reward-vault"
        element={isAuthenticated ? <PageTransition><RewardVaultPage /></PageTransition> : <Navigate to="/login" />}
      />
      <Route
        path="/faucet"
        element={isAuthenticated ? <PageTransition><FaucetPage /></PageTransition> : <Navigate to="/login" />}
      />
      <Route
        path="/tools"
        element={isAuthenticated ? <PageTransition><ToolsPage /></PageTransition> : <Navigate to="/login" />}
      />
      <Route
        path="/ai-tools"
        element={isAuthenticated ? <PageTransition><AIToolsPage /></PageTransition> : <Navigate to="/login" />}
      />
      <Route
        path="/swap-bridge"
        element={isAuthenticated ? <PageTransition><SwapPage /></PageTransition> : <Navigate to="/login" />}
      />
      <Route
        path="/swap"
        element={isAuthenticated ? <Navigate to="/swap-bridge" replace /> : <Navigate to="/login" />}
      />
      <Route
        path="/multiple-account"
        element={isAuthenticated ? <PageTransition><MultipleAccountPage /></PageTransition> : <Navigate to="/login" />}
      />
      <Route
        path="/about"
        element={isAuthenticated ? <PageTransition><AboutPage /></PageTransition> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <WalletProvider>
            <AppContent />
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
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App;
