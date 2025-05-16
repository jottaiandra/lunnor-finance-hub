
import { useAuth } from "@/contexts/AuthContext";
import { FinanceAction } from "../types";
import { 
  useFetchPeaceFund, 
  useTransactionOperations, 
  useSettingsOperations, 
  useAnalyticsOperations 
} from "./peaceFund";

/**
 * Hook principal para gerenciar o fundo de paz
 */
export const usePeaceFund = (user: any | null, dispatch: React.Dispatch<FinanceAction>) => {
  // Operações de busca de dados do fundo de paz
  const { 
    fetchPeaceFund, 
    fetchPeaceFundTransactions 
  } = useFetchPeaceFund(user, dispatch);
  
  // Operações de transação do fundo de paz
  const { 
    addPeaceFundTransaction 
  } = useTransactionOperations(user, dispatch);
  
  // Operações de configuração do fundo de paz
  const { 
    updatePeaceFundSettings 
  } = useSettingsOperations(user, dispatch);
  
  // Operações de análise do fundo de paz
  const { 
    getPeaceFundMonthlyData 
  } = useAnalyticsOperations(user);

  return {
    fetchPeaceFund,
    fetchPeaceFundTransactions,
    addPeaceFundTransaction,
    updatePeaceFundSettings,
    getPeaceFundMonthlyData
  };
};
