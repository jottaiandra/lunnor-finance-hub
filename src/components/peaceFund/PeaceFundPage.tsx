
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { usePeaceFund } from './hooks/usePeaceFund';
import PeaceFundCreate from './PeaceFundCreate';
import OverviewTab from './tabs/OverviewTab';
import TransactionsTab from './tabs/TransactionsTab';
import InfoTab from './tabs/InfoTab';

const PeaceFundPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { 
    peaceFund, 
    transactions, 
    chartData, 
    loading, 
    handleCreatePeaceFund, 
    refreshData 
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
        <PeaceFundCreate 
          onSubmit={async (formData) => {
            const success = await handleCreatePeaceFund(formData);
            if (success) setActiveTab('overview');
            return success;
          }} 
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-gray-100 p-1 shadow-sm">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Transações
            </TabsTrigger>
            <TabsTrigger 
              value="info" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Informações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <OverviewTab 
              peaceFund={peaceFund}
              transactions={transactions}
              chartData={chartData}
              onShowAllTransactions={() => setActiveTab('transactions')}
            />
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6 mt-6">
            <TransactionsTab 
              peaceFundId={peaceFund.id}
              transactions={transactions}
              onTransactionSuccess={refreshData}
            />
          </TabsContent>
          
          <TabsContent value="info" className="space-y-6 mt-6">
            <InfoTab 
              peaceFund={peaceFund} 
              onUpdateSuccess={refreshData} 
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PeaceFundPage;
