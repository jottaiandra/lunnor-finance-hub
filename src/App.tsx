
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from "../src/components/theme-provider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './contexts/AuthContext';
import Layout from './pages/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SobrePage from './pages/SobrePage';
import ContatoPage from './pages/ContatoPage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';
import GoalsPage from './pages/GoalsPage';
import ExportPage from './pages/ExportPage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import WhatsAppPage from './pages/WhatsAppPage';
import WhatsAppTestPage from './pages/WhatsAppTestPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="auth" element={<AuthPage />} />
                  <Route path="sobre" element={<SobrePage />} />
                  <Route path="contato" element={<ContatoPage />} />
                  <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                    <Route path="transactions" element={<TransactionsPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="goals" element={<GoalsPage />} />
                    <Route path="export" element={<ExportPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="whatsapp" element={<WhatsAppPage />} />
                    <Route path="whatsapp-test" element={<WhatsAppTestPage />} />
                    <Route path="admin" element={<AdminPage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
