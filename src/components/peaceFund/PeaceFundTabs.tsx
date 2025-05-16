
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PeaceFund, PeaceFundTransaction } from '@/types/peaceFund';
import PeaceFundOverviewTab from './PeaceFundOverviewTab';
import PeaceFundTransactionsTab from './PeaceFundTransactionsTab';
import PeaceFundInfoTab from './PeaceFundInfoTab';

interface PeaceFundTabsProps {
  peaceFund: PeaceFund;
  transactions: PeaceFundTransaction[];
  chartData: Array<{name: string; value: number}>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRefreshData: () => void;
}

const PeaceFundTabs: React.FC<PeaceFundTabsProps> = ({
  peaceFund,
  transactions,
  chartData,
  activeTab,
  onTabChange,
  onRefreshData
}) => {
  console.log('Rendering PeaceFundTabs with activeTab:', activeTab);
  console.log('Transaction count:', transactions.length);
  
  const handleTransactionSuccess = () => {
    console.log('Transaction success handler called in Tabs');
    onRefreshData();
  };
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
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
        <PeaceFundOverviewTab
          peaceFund={peaceFund}
          transactions={transactions}
          chartData={chartData}
          onShowAllTransactions={() => onTabChange('transactions')}
        />
      </TabsContent>
      
      <TabsContent value="transactions" className="space-y-6 mt-6">
        <PeaceFundTransactionsTab
          peaceFundId={peaceFund.id}
          transactions={transactions}
          onTransactionSuccess={handleTransactionSuccess}
        />
      </TabsContent>
      
      <TabsContent value="info" className="space-y-6 mt-6">
        <PeaceFundInfoTab
          peaceFund={peaceFund}
          onUpdateSettings={onRefreshData}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PeaceFundTabs;
