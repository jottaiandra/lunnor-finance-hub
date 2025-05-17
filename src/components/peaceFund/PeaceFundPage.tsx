
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { 
  getUserPeaceFund, 
  createPeaceFund, 
  getPeaceFundTransactions, 
  getMonthlyProgress,
  createPeaceFundTransaction,
  updatePeaceFund
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
  const [initialTransactionsAdded, setInitialTransactionsAdded] = useState<boolean>(false);
  
  useEffect(() => {
    if (!user) return;
    
    const loadPeaceFund = async () => {
      setLoading(true);
      try {
        console.log("Loading peace fund data...");
        const fund = await getUserPeaceFund();
        console.log("Peace fund data:", fund);
        
        if (fund) {
          setPeaceFund(fund);
          
          // Load transactions and chart data
          const transactions = await getPeaceFundTransactions(fund.id);
          console.log("Transactions loaded:", transactions);
          setTransactions(transactions);
          
          const monthlyData = await getMonthlyProgress(fund.id);
          console.log("Chart data loaded:", monthlyData);
          setChartData(monthlyData);

          // Se não houver transações, adicionamos as movimentações demonstrativas apenas uma vez
          if (transactions.length === 0 && !initialTransactionsAdded) {
            await addDemoTransactions(fund.id);
          }
        }
      } catch (error) {
        console.error('Failed to load peace fund data:', error);
        toast({
          variant: "destructive",
          title: 'Falha ao carregar dados do Fundo de Paz',
          description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPeaceFund();
  }, [user, initialTransactionsAdded]);
  
  const addDemoTransactions = async (peaceFundId: string) => {
    if (!user) return;
    
    try {
      let totalAmount = 0;
      
      // Adicionar transação de R$100
      await createPeaceFundTransaction({
        peace_fund_id: peaceFundId,
        user_id: user.id,
        type: 'deposit',
        amount: 100,
        description: 'Depósito demonstrativo',
        date: new Date(),
      });
      totalAmount += 100;
      
      // Adicionar transação de R$300 (alterado de R$200 para R$300)
      await createPeaceFundTransaction({
        peace_fund_id: peaceFundId,
        user_id: user.id,
        type: 'deposit',
        amount: 300,
        description: 'Depósito demonstrativo',
        date: new Date(),
      });
      totalAmount += 300;
      
      // Forçar atualização do saldo atual para garantir que apareça corretamente
      if (peaceFund) {
        const updatedPeaceFund = await updatePeaceFund(peaceFundId, {
          current_amount: totalAmount,
          updated_at: new Date()
        });
        setPeaceFund(updatedPeaceFund);
      }
      
      setInitialTransactionsAdded(true);
      
      // Atualizar dados
      await refreshData();
      
      toast({
        title: 'Depósitos demonstrativos adicionados',
        description: 'Foram adicionados R$400 em depósitos ao seu Fundo de Paz.'
      });
    } catch (error) {
      console.error('Failed to add demo transactions:', error);
    }
  };
  
  const handleCreatePeaceFund = async (formData: Partial<PeaceFund>) => {
    try {
      if (!user) return;
      
      const newPeaceFund = await createPeaceFund({
        user_id: user.id,
        target_amount: formData.target_amount || 0,
        current_amount: 0, // Explicitly set current_amount to 0 for new funds
        minimum_alert_amount: formData.minimum_alert_amount
      });
      
      setPeaceFund(newPeaceFund);
      toast({
        title: 'Fundo de Paz criado com sucesso!',
        description: 'Agora você pode começar a fazer depósitos no seu Fundo de Paz.'
      });
      setActiveTab('overview');
    } catch (error) {
      console.error('Failed to create peace fund:', error);
      toast({
        variant: "destructive",
        title: 'Falha ao criar Fundo de Paz',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
      });
    }
  };
  
  const refreshData = async () => {
    if (!peaceFund) return;
    
    try {
      console.log("Refreshing peace fund data...");
      const fund = await getUserPeaceFund();
      console.log("Updated peace fund:", fund);
      if (fund) setPeaceFund(fund);
      
      const transactions = await getPeaceFundTransactions(peaceFund.id);
      console.log("Updated transactions:", transactions);
      setTransactions(transactions);
      
      const monthlyData = await getMonthlyProgress(peaceFund.id);
      console.log("Updated chart data:", monthlyData);
      setChartData(monthlyData);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast({
        variant: "destructive",
        title: 'Falha ao atualizar dados',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
      });
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
                      toast({
                        title: 'Configurações atualizadas com sucesso!',
                      });
                    } catch (error) {
                      console.error(error);
                      toast({
                        variant: "destructive",
                        title: 'Erro ao atualizar configurações',
                      });
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
