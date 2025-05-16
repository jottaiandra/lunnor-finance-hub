
import { fetchMonthlyEvolution } from "../../peaceFundService";

/**
 * Hook para gerenciar operações de análise do fundo de paz
 */
export const useAnalyticsOperations = (user: any | null) => {
  /**
   * Busca dados mensais de evolução do fundo de paz
   */
  const getPeaceFundMonthlyData = async () => {
    if (!user) return [];
    
    const state = await import("@/contexts/FinanceContext").then(module => {
      const { useFinance } = module;
      const { state } = useFinance();
      return state;
    });
    
    if (!state.peaceFund) return [];
    
    try {
      const monthlyData = await fetchMonthlyEvolution(state.peaceFund.id);
      return monthlyData;
    } catch (error) {
      console.error("Erro ao buscar dados mensais:", error);
      return [];
    }
  };

  return {
    getPeaceFundMonthlyData
  };
};
