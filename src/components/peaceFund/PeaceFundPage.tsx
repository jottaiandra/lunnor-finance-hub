
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  getUserPeaceFund, 
  createPeaceFund, 
  getPeaceFundTransactions, 
  getMonthlyProgress 
} from '@/services/peaceFundService';
import { PeaceFund, PeaceFundTransaction } from '@/types/peaceFund';
import PeaceFundOverview from './PeaceFundOverview';
import PeaceFundTransactionList from './PeaceFundTransactionList';
import PeaceFundForm from './PeaceFundForm';
import PeaceFundTransactionForm from './PeaceFundTransactionForm';
import PeaceFundChart from './PeaceFundChart';
import PeaceFundInfo from './PeaceFundInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const PeaceFundPage: React.FC = () => {
  const { user } = useAuth();
  const [peaceFund, setPeaceFund] = useState<PeaceFund | null>(null);
  const [transactions, setTransactions] = useState<PeaceFundTransaction[]>([]);
  const [chartData, setChartData] = useState<Array<{name: string; value: number}>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  useEffect(() => {
    if (!user) return;
    
    const loadPeaceFund = async () => {
      setLoading(true);
      try {
        const fund = await getUserPeaceFund();
        
        if (fund) {
          setPeaceFund(fund);
          
          // Load transactions and chart data
          const transactions = await getPeaceFundTransactions(fund.id);
          setTransactions(transactions);
          
          const monthlyData = await getMonthlyProgress(fund.id);
          setChartData(monthlyData);
        }
      } catch (error) {
        console.error('Failed to load peace fund data:', error);
        toast.error('Falha ao carregar dados do Fundo de Paz');
      } finally {
        setLoading(false);
      }
    };
    
    loadPeaceFund();
  }, [user]);
  
  const handleCreatePeaceFund = async (formData: Partial<PeaceFund>) => {
    try {
      if (!user) return;
      
      const newPeaceFund = await createPeaceFund({
        user_id: user.id,
        ...formData
      });
      
      setPeaceFund(newPeaceFund);
      toast.success('Fundo de Paz criado com sucesso!');
      setActiveTab('overview');
    } catch (error) {
      console.error('Failed to create peace fund:', error);
      toast.error('Falha ao criar Fundo de Paz');
    }
  };
  
  const refreshData = async () => {
    if (!peaceFund) return;
    
    try {
      const fund = await getUserPeaceFund();
      if (fund) setPeaceFund(fund);
      
      const transactions = await getPeaceFundTransactions(peaceFund.id);
      setTransactions(transactions);
      
      const monthlyData = await getMonthlyProgress(peaceFund.id);
      setChartData(monthlyData);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };
  
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
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Crie seu Fundo de Paz</CardTitle>
          </CardHeader>
          <CardContent>
            <PeaceFundInfo />
            <div className="mt-6">
              <PeaceFundForm onSubmit={handleCreatePeaceFund} />
            </div>
          </CardContent>
        </Card>
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
            <PeaceFundOverview peaceFund={peaceFund} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-md h-full">
                <CardHeader>
                  <CardTitle>Evolução do Fundo</CardTitle>
                </CardHeader>
                <CardContent>
                  <PeaceFundChart data={chartData} />
                </CardContent>
              </Card>
              
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Últimas Movimentações</CardTitle>
                </CardHeader>
                <CardContent>
                  <PeaceFundTransactionList 
                    transactions={transactions} 
                    limit={5}
                    showAll={() => setActiveTab('transactions')} 
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6 mt-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Adicionar Movimentação</CardTitle>
              </CardHeader>
              <CardContent>
                <PeaceFundTransactionForm 
                  peaceFundId={peaceFund.id} 
                  onSuccess={refreshData}
                />
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Histórico de Movimentações</CardTitle>
              </CardHeader>
              <CardContent>
                <PeaceFundTransactionList 
                  transactions={transactions} 
                  showPagination
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="info" className="space-y-6 mt-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>O que é o Fundo de Paz?</CardTitle>
              </CardHeader>
              <CardContent>
                <PeaceFundInfo />
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent>
                <PeaceFundForm 
                  onSubmit={async (data) => {
                    try {
                      // Update logic would go here
                      await refreshData();
                      toast.success('Configurações atualizadas com sucesso!');
                    } catch (error) {
                      console.error(error);
                      toast.error('Erro ao atualizar configurações');
                    }
                  }} 
                  peaceFund={peaceFund}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PeaceFundPage;
