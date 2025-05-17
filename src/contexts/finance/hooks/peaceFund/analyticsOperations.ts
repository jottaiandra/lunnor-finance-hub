
import { fetchMonthlyEvolution } from "../../services/peaceFund/fetchMonthlyEvolution";

/**
 * Hook para operações de análise do fundo de paz
 */
export const useAnalyticsOperations = (user: any | null) => {
  /**
   * Obtém os dados mensais do fundo de paz para o gráfico
   */
  const getPeaceFundMonthlyData = async () => {
    if (!user) return [];

    try {
      // Importar dinamicamente para evitar referência circular
      const { state } = await import("@/contexts/FinanceContext").then(module => {
        return { state: module.useFinance().state };
      });
      
      if (!state || !state.peaceFund || !state.peaceFund.id) {
        return [];
      }
      
      return await fetchMonthlyEvolution(state.peaceFund.id);
    } catch (error) {
      console.error('Erro ao buscar dados mensais do fundo:', error);
      return [];
    }
  };

  return {
    getPeaceFundMonthlyData
  };
};
