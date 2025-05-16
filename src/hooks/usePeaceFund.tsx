
import { useState, useEffect } from 'react';
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
  
  const loadPeaceFundData = async () => {
    if (!user) return;
    
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
  
  const handleCreatePeaceFund = async (formData: Partial<PeaceFund>) => {
    try {
      if (!user) return;
      
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
  }, [user]);
  
  return {
    peaceFund,
    transactions,
    chartData,
    loading,
    refreshData: loadPeaceFundData,
    createPeaceFund: handleCreatePeaceFund
  };
}
