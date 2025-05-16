
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  getUserPeaceFund, 
  getPeaceFundTransactions, 
  getMonthlyProgress,
  createPeaceFund
} from '@/services/peaceFundService';
import { PeaceFund, PeaceFundTransaction } from '@/types/peaceFund';

export function usePeaceFund() {
  const { user } = useAuth();
  const [peaceFund, setPeaceFund] = useState<PeaceFund | null>(null);
  const [transactions, setTransactions] = useState<PeaceFundTransaction[]>([]);
  const [chartData, setChartData] = useState<Array<{name: string; value: number}>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  const loadPeaceFundData = useCallback(async () => {
    if (!user) return;
    
    try {
      console.log('Loading peace fund data...');
      setLoading(true);
      const fund = await getUserPeaceFund();
      
      if (fund) {
        console.log('Peace fund loaded:', fund);
        setPeaceFund(fund);
        
        // Load transactions and chart data
        console.log('Loading transactions for peace fund:', fund.id);
        const transactions = await getPeaceFundTransactions(fund.id);
        console.log(`Loaded ${transactions.length} transactions`);
        setTransactions(transactions);
        
        console.log('Loading monthly progress data');
        const monthlyData = await getMonthlyProgress(fund.id);
        setChartData(monthlyData);
      } else {
        console.log('No peace fund found for user');
      }
    } catch (error) {
      console.error('Failed to load peace fund data:', error);
      toast.error('Falha ao carregar dados do Fundo de Paz');
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  const refreshData = useCallback(() => {
    console.log('Refreshing peace fund data...');
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  const handleCreatePeaceFund = async (formData: Partial<PeaceFund>) => {
    try {
      if (!user) return null;
      
      console.log('Creating new peace fund with data:', formData);
      const newPeaceFund = await createPeaceFund({
        user_id: user.id,
        ...formData
      });
      
      setPeaceFund(newPeaceFund);
      toast.success('Fundo de Paz criado com sucesso!');
      return newPeaceFund;
    } catch (error) {
      console.error('Failed to create peace fund:', error);
      toast.error('Falha ao criar Fundo de Paz');
      return null;
    }
  };
  
  useEffect(() => {
    if (user) {
      loadPeaceFundData();
    }
  }, [user, loadPeaceFundData, refreshTrigger]);
  
  return {
    peaceFund,
    transactions,
    chartData,
    loading,
    refreshData,
    createPeaceFund: handleCreatePeaceFund
  };
}
