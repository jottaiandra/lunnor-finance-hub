
import { supabase } from "@/integrations/supabase/client";
import { PeaceFund } from "@/types";
import { FinanceAction } from "../../types";
import { toast } from "@/components/ui/sonner";

// Update peace fund settings
export const updatePeaceFundSettings = async (
  fundId: string,
  settings: { target_amount?: number; minimum_alert_amount?: number | null },
  userId: string,
  dispatch: React.Dispatch<FinanceAction>
): Promise<PeaceFund | null> => {
  try {
    const { data, error } = await supabase
      .from('peace_funds')
      .update({
        target_amount: settings.target_amount,
        minimum_alert_amount: settings.minimum_alert_amount
      })
      .eq('id', fundId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar configurações do fundo:', error);
      toast.error('Erro ao salvar configurações do fundo');
      return null;
    }

    const updatedFund: PeaceFund = {
      id: data.id,
      user_id: data.user_id,
      target_amount: data.target_amount,
      current_amount: data.current_amount,
      minimum_alert_amount: data.minimum_alert_amount,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    };

    // Update the peace fund in the state
    dispatch({
      type: "UPDATE_PEACE_FUND",
      payload: updatedFund
    });

    toast.success('Configurações do fundo atualizadas');
    return updatedFund;
  } catch (error) {
    console.error('Erro inesperado ao atualizar fundo:', error);
    return null;
  }
};
