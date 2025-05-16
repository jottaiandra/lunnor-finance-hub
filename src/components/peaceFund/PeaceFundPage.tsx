
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { usePeaceFund } from '@/hooks/usePeaceFund';
import CreatePeaceFund from './CreatePeaceFund';
import PeaceFundTabs from './PeaceFundTabs';

const PeaceFundPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { 
    peaceFund, 
    transactions, 
    chartData, 
    loading, 
    refreshData, 
    createPeaceFund 
  } = usePeaceFund();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Carregando Fundo de Paz...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Fundo de Paz</h1>
      
      {!peaceFund ? (
        <CreatePeaceFund 
          onCreatePeaceFund={(formData) => {
            const result = createPeaceFund(formData);
            if (result) setActiveTab('overview');
            return result;
          }} 
        />
      ) : (
        <PeaceFundTabs
          peaceFund={peaceFund}
          transactions={transactions}
          chartData={chartData}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRefreshData={refreshData}
        />
      )}
    </div>
  );
};

export default PeaceFundPage;
