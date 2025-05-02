
import React, { useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';

const Index: React.FC = () => {
  const { user } = useAuth();
  const { state, fetchTransactions, fetchGoals } = useFinance();

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchGoals();
    }
  }, [user]);

  if (state.loading.transactions || state.loading.goals) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;
