// src/App.tsx - Update routing
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import { OverviewPage } from '@/pages/OverviewPage';
import { EcosystemPage } from '@/pages/EcosystemPage';
import { EcosystemDetailPage } from '@/pages/EcosystemDetailPage';  // <-- TAMBAH INI
import { PriorityProjectsPage } from '@/pages/PriorityProjectsPage';
import { FaucetPage } from '@/pages/FaucetPage';
import { ClaimAirdropPage } from '@/pages/ClaimAirdropPage';
import { MultipleAccountPage } from '@/pages/MultipleAccountPage';
import { AboutPage } from '@/pages/AboutPage';
import { Toaster } from '@/components/ui/sonner';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F14]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-mono">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/overview" /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/overview" /> : <RegisterPage />} 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/overview" 
        element={isAuthenticated ? <OverviewPage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/ecosystem" 
        element={isAuthenticated ? <EcosystemPage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/ecosystem/:id" 
        element={isAuthenticated ? <EcosystemDetailPage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/priority-projects" 
        element={isAuthenticated ? <PriorityProjectsPage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/faucet" 
        element={isAuthenticated ? <FaucetPage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/claim-airdrop" 
        element={isAuthenticated ? <ClaimAirdropPage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/multiple-account" 
        element={isAuthenticated ? <MultipleAccountPage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/about" 
        element={isAuthenticated ? <AboutPage /> : <Navigate to="/login" />} 
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
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
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