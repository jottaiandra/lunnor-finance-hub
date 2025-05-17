
import { toast } from "@/components/ui/sonner";
import { updatePeaceFundSettings as updatePeaceFundSettingsService } from "../../services/peaceFund/updatePeaceFundSettings";
import { FinanceAction } from "../../types";

/**
 * Hook para gerenciar operações de configuração do fundo de paz
 */
export const useSettingsOperations = (user: any | null, dispatch: React.Dispatch<FinanceAction>) => {
  /**
   * Atualiza as configurações do fundo de paz
   */
  const updatePeaceFundSettings = async (settings: {
    target_amount?: number;
    minimum_alert_amount?: number | null;
  }) => {
    if (!user || !user.id) {
      toast.error("Usuário não autenticado");
      return;
    }
    
    const state = await import("@/contexts/FinanceContext").then(module => {
      const { useFinance } = module;
      const { state } = useFinance();
      return state;
    });
    
    if (!state.peaceFund) {
      toast.error("Fundo de paz não encontrado");
      return;
    }
    
    try {
      const updatedFund = await updatePeaceFundSettingsService(
        state.peaceFund.id,
        settings,
        user.id,
        dispatch
      );
      
      if (updatedFund) {
        toast.success("Configurações atualizadas com sucesso");
      }
    } catch (error) {
      console.error("Erro ao atualizar configurações do fundo:", error);
      toast.error("Erro ao atualizar configurações");
    }
  };

  return {
    updatePeaceFundSettings
  };
};
