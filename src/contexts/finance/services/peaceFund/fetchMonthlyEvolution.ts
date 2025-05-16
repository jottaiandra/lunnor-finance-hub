
import { supabase } from "@/integrations/supabase/client";

/**
 * Obtém evolução mensal do fundo de paz
 */
export const fetchMonthlyEvolution = async (fundId: string): Promise<any[]> => {
  try {
    if (!fundId) return [];
    
    const { data, error } = await supabase
      .from('peace_fund_transactions')
      .select('*')
      .eq('peace_fund_id', fundId)
      .order('date', { ascending: true });

    if (error) {
      console.error('Erro ao buscar transações para evolução:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const monthlyData = processMonthlyEvolution(data);
    return monthlyData;
  } catch (error) {
    console.error('Erro ao calcular evolução mensal:', error);
    return [];
  }
};

/**
 * Processa dados para gráfico de evolução mensal
 */
const processMonthlyEvolution = (transactions: any[]): any[] => {
  const monthlyMap = new Map<string, number>();
  let runningTotal = 0;
  
  transactions.forEach(tx => {
    const date = new Date(tx.date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    // Calcular o saldo acumulado
    if (tx.type === 'deposit') {
      runningTotal += Number(tx.amount);
    } else {
      runningTotal -= Number(tx.amount);
    }
    
    // Registrar o saldo para este mês (sobrescrever valores anteriores do mesmo mês)
    monthlyMap.set(monthKey, runningTotal);
  });
  
  // Converter o mapa para array de objetos para o gráfico
  const result = Array.from(monthlyMap.entries()).map(([month, amount]) => ({
    month,
    amount
  }));
  
  return result;
};
