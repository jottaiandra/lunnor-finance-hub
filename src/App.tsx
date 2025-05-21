
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from "./components/theme-provider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './contexts/AuthContext';
import { CustomizationProvider } from './contexts/CustomizationContext';
import Layout from './pages/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';
import GoalsPage from './pages/GoalsPage';
import ExportPage from './pages/ExportPage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import PeaceFundPage from './pages/PeaceFundPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CustomizationProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Routes>
                  {/* Redirect root to auth page */}
                  <Route path="/" element={<Navigate to="/auth" replace />} />
                  
                  {/* Auth page */}
                  <Route path="/auth" element={<AuthPage />} />
                  
                  {/* Páginas protegidas */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<HomePage />} />
                    <Route path="transactions" element={<TransactionsPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="goals" element={<GoalsPage />} />
                    <Route path="peace-fund" element={<PeaceFundPage />} />
                    <Route path="export" element={<ExportPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="admin" element={<AdminPage />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              <Toaster />
            </ThemeProvider>
          </CustomizationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
