// ALPHA TRECKER - Main App

import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthPage } from '@/pages/AuthPage';
import { Dashboard } from '@/pages/Dashboard';
import { initializeDemoData } from '@/services/database';
import { Toaster } from '@/components/ui/sonner';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    initializeDemoData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <AuthPage />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
