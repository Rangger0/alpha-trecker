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
import { EcosystemDetailPage } from '@/pages/EcosystemDetailPage';
import { PriorityProjectsPage } from '@/pages/PriorityProjectsPage';
import { FaucetPage } from '@/pages/FaucetPage';
import { MultipleAccountPage } from '@/pages/MultipleAccountPage';
import { AboutPage } from '@/pages/AboutPage';
import { Toaster } from '@/components/ui/sonner';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ScreeningAddressPage } from "@/pages/ScreeningAddressPage";
import { AnimatePresence, motion } from 'framer-motion';
import { ToolsPage } from '@/pages/ToolsPage';
import { AIToolsPage } from '@/pages/AIToolsPage';
import { SwapPage } from '@/pages/SwapPage';
// Page transition wrapper component
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.4
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

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
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition><LandingPage /></PageTransition>
        } />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/overview" /> : <PageTransition><LoginPage /></PageTransition>} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/overview" /> : <PageTransition><RegisterPage /></PageTransition>} 
        />
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
         path="/swap" 
          element={isAuthenticated ? <PageTransition><SwapPage /></PageTransition> : <Navigate to="/login" />} 
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
    </AnimatePresence>
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