
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/pages/Layout";
import AuthPage from "@/pages/AuthPage";
import Index from "@/pages/Index";
import TransactionsPage from "@/pages/TransactionsPage";
import ReportsPage from "@/pages/ReportsPage";
import GoalsPage from "@/pages/GoalsPage";
import ExportPage from "@/pages/ExportPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Index />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="export" element={<ExportPage />} />
              <Route path="admin" element={<AdminPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
