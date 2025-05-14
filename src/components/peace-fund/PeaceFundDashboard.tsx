
import React, { useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import PeaceFundOverview from './PeaceFundOverview';
import PeaceFundTransactionsList from './PeaceFundTransactionsList';
import PeaceFundForm from './PeaceFundForm';
import PeaceFundChart from './PeaceFundChart';
import PeaceFundInfo from './PeaceFundInfo';

const PeaceFundDashboard: React.FC = () => {
  const { fetchPeaceFund, state } = useFinance();

  useEffect(() => {
    fetchPeaceFund();
  }, [fetchPeaceFund]);

  return (
    <div className="space-y-6">
      <PeaceFundOverview />
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <PeaceFundForm />
          <PeaceFundInfo />
        </div>
        
        <div className="space-y-6">
          <PeaceFundChart />
          <PeaceFundTransactionsList limit={5} />
        </div>
      </div>
    </div>
  );
};

export default PeaceFundDashboard;
