
import React, { useEffect, useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import PeaceFundOverview from './PeaceFundOverview';
import PeaceFundTransactionsList from './PeaceFundTransactionsList';
import PeaceFundForm from './PeaceFundForm';
import PeaceFundChart from './PeaceFundChart';
import PeaceFundInfo from './PeaceFundInfo';

const PeaceFundDashboard: React.FC = () => {
  const { fetchPeaceFund, state } = useFinance();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchPeaceFund();
    
    // Atualiza os dados quando o componente é montado e quando refreshTrigger muda
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 60000); // Atualiza a cada minuto
    
    return () => clearInterval(interval);
  }, [fetchPeaceFund]);

  // Efeito para atualizar dados quando uma transação é adicionada
  useEffect(() => {
    if (state.peaceFundTransactions.length > 0) {
      // Apenas para garantir que o componente será atualizado quando as transações mudarem
    }
  }, [state.peaceFundTransactions.length, refreshTrigger]);

  return (
    <div className="space-y-6">
      <PeaceFundOverview key={`overview-${state.peaceFund?.current_amount || 0}`} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <PeaceFundForm />
          <PeaceFundInfo />
        </div>
        
        <div className="space-y-6">
          <PeaceFundChart key={`chart-${state.peaceFundTransactions.length}-${refreshTrigger}`} />
          <PeaceFundTransactionsList 
            key={`transactions-${state.peaceFundTransactions.length}`} 
            limit={5} 
          />
        </div>
      </div>
    </div>
  );
};

export default PeaceFundDashboard;
