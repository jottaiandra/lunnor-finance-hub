
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { 
  getUserPeaceFund, 
  createPeaceFund, 
  getPeaceFundTransactions, 
  getMonthlyProgress,
  createPeaceFundTransaction,
  updatePeaceFund
} from '@/services/peaceFund';
import { PeaceFund, PeaceFundTransaction } from '@/types/peaceFund';

interface UsePeaceFundReturn {
  peaceFund: PeaceFund | null;
  transactions: PeaceFundTransaction[];
  chartData: Array<{name: string; value: number}>;
  loading: boolean;
  handleCreatePeaceFund: (formData: Partial<PeaceFund>) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

export function usePeaceFund(): UsePeaceFundReturn {
  const { user } = useAuth();
  const [peaceFund, setPeaceFund] = useState<PeaceFund | null>(null);
  const [transactions, setTransactions] = useState<PeaceFundTransaction[]>([]);
  const [chartData, setChartData] = useState<Array<{name: string; value: number}>>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
      
      // Adicionar transação de R$300
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
        await updatePeaceFund(peaceFundId, {
          current_amount: totalAmount,
          updated_at: new Date()
        });
        
        // Recarregar os dados do fundo para garantir que o estado reflete o valor atual
        const updatedFund = await getUserPeaceFund();
        if (updatedFund) {
          setPeaceFund(updatedFund);
        }
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

  const handleCreatePeaceFund = async (formData: Partial<PeaceFund>): Promise<boolean> => {
    try {
      if (!user) return false;
      
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
      return true;
    } catch (error) {
      console.error('Failed to create peace fund:', error);
      toast({
        variant: "destructive",
        title: 'Falha ao criar Fundo de Paz',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
      });
      return false;
    }
  };
  
  const refreshData = async (): Promise<void> => {
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

  return {
    peaceFund,
    transactions,
    chartData,
    loading,
    handleCreatePeaceFund,
    refreshData
  };
}
