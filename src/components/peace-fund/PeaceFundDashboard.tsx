
import React, { useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PeaceFundOverview from './PeaceFundOverview';
import PeaceFundTransactions from './PeaceFundTransactions';
import PeaceFundActions from './PeaceFundActions';
import PeaceFundInfo from './PeaceFundInfo';
import PeaceFundChart from './PeaceFundChart';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const PeaceFundDashboard: React.FC = () => {
  const { fetchPeaceFund, state } = useFinance();
  const { peaceFund, loading } = state;
  
  useEffect(() => {
    fetchPeaceFund();
  }, [fetchPeaceFund]);

  if (loading.peaceFund) {
    return (
      <Card className="w-full h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview card with fund balance and progress */}
      <PeaceFundOverview />
      
      {/* Main content area with tabs */}
      <Tabs defaultValue="actions" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="actions">Gerenciar</TabsTrigger>
          <TabsTrigger value="transactions">Histórico</TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
        </TabsList>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <TabsContent value="actions" className="mt-0">
              <PeaceFundActions />
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-0">
              <PeaceFundTransactions />
            </TabsContent>
            
            <TabsContent value="info" className="mt-0">
              <PeaceFundInfo />
            </TabsContent>
          </div>
          
          <div className="space-y-6">
            <PeaceFundChart />
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default PeaceFundDashboard;
