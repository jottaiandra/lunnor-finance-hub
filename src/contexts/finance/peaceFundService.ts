
import { supabase } from "@/integrations/supabase/client";
import { PeaceFund, PeaceFundTransaction } from "@/types";

// Buscar ou criar fundo de paz para o usuário
export const fetchOrCreatePeaceFund = async (userId: string): Promise<PeaceFund | null> => {
  if (!userId) return null;

  try {
    // Verificar se o usuário já tem um fundo de paz
    let { data: existingFund, error: fetchError } = await supabase
      .from('peace_funds')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Erro ao buscar fundo de paz:', fetchError);
      return null;
    }

    // Se o fundo já existe, retornar
    if (existingFund) {
      return mapDatabasePeaceFundToFrontend(existingFund);
    }

    // Se não existe, criar um novo fundo
    const { data: newFund, error: insertError } = await supabase
      .from('peace_funds')
      .insert([
        { 
          user_id: userId,
          target_amount: 10000, // Valor padrão inicial
          current_amount: 0,
          minimum_alert_amount: 1000 // Valor padrão para alerta
        }
      ])
      .select('*')
      .single();

    if (insertError) {
      console.error('Erro ao criar fundo de paz:', insertError);
      return null;
    }

    return mapDatabasePeaceFundToFrontend(newFund);
  } catch (error) {
    console.error('Erro inesperado ao gerenciar fundo de paz:', error);
    return null;
  }
};

// Update settings function to accept minimum_alert_amount
export const updatePeaceFundSettings = async (
  fundId: string,
  settings: { target_amount?: number; minimum_alert_amount?: number | null }
): Promise<PeaceFund | null> => {
  try {
    const { data, error } = await supabase
      .from('peace_funds')
      .update(settings)
      .eq('id', fundId)
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao atualizar configurações do fundo:', error);
      return null;
    }

    return mapDatabasePeaceFundToFrontend(data);
  } catch (error) {
    console.error('Erro inesperado ao atualizar fundo:', error);
    return null;
  }
};

// Adicionar transação ao fundo de paz
export const addPeaceFundTransaction = async (transaction: {
  peace_fund_id: string;
  user_id: string;
  amount: number;
  description: string;
  type: 'deposit' | 'withdrawal';
  date?: Date | string;
}): Promise<PeaceFundTransaction | null> => {
  try {
    const transactionData = {
      ...transaction,
      date: transaction.date 
        ? typeof transaction.date === 'string' 
          ? transaction.date 
          : transaction.date.toISOString()
        : new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('peace_fund_transactions')
      .insert(transactionData)
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao adicionar transação ao fundo:', error);
      return null;
    }

    return mapDatabaseTransactionToFrontend(data);
  } catch (error) {
    console.error('Erro inesperado ao adicionar transação:', error);
    return null;
  }
};

// Obter histórico de transações do fundo
export const fetchPeaceFundTransactions = async (
  fundId: string, 
  limit = 50
): Promise<PeaceFundTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('peace_fund_transactions')
      .select('*')
      .eq('peace_fund_id', fundId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar transações do fundo:', error);
      return [];
    }

    return data.map(mapDatabaseTransactionToFrontend);
  } catch (error) {
    console.error('Erro inesperado ao buscar transações:', error);
    return [];
  }
};

// Obter evolução mensal do fundo
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

// Funções auxiliares para mapear dados
const mapDatabasePeaceFundToFrontend = (dbFund: any): PeaceFund => ({
  id: dbFund.id,
  user_id: dbFund.user_id,
  target_amount: dbFund.target_amount,
  current_amount: dbFund.current_amount,
  minimum_alert_amount: dbFund.minimum_alert_amount,
  created_at: dbFund.created_at,
  updated_at: dbFund.updated_at
});

const mapDatabaseTransactionToFrontend = (dbTransaction: any): PeaceFundTransaction => ({
  id: dbTransaction.id,
  peace_fund_id: dbTransaction.peace_fund_id,
  user_id: dbTransaction.user_id,
  amount: dbTransaction.amount,
  description: dbTransaction.description,
  type: dbTransaction.type,
  date: dbTransaction.date,
  created_at: dbTransaction.created_at
});

// Processar dados para gráfico de evolução mensal
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
