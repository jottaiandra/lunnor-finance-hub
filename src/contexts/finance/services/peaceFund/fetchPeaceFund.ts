
import { supabase } from "@/integrations/supabase/client";
import { PeaceFund } from "@/types";
import { FinanceAction } from "../../types";

// Fetch or create a peace fund for the user
export const fetchPeaceFund = async (
  userId: string,
  dispatch: React.Dispatch<FinanceAction>
): Promise<PeaceFund | null> => {
  if (!userId) {
    console.log("Nenhum usuário autenticado, pulando busca de fundo de paz");
    return null;
  }

  try {
    dispatch({ type: "SET_LOADING", payload: { key: 'peaceFund', value: true } });
    
    // Try to fetch the existing peace fund
    let { data: existingFund, error: fetchError } = await supabase
      .from('peace_funds')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Erro ao buscar fundo de paz:', fetchError);
      return null;
    }

    // If fund exists, return it
    if (existingFund) {
      const fund: PeaceFund = {
        id: existingFund.id,
        user_id: existingFund.user_id,
        target_amount: existingFund.target_amount,
        current_amount: existingFund.current_amount,
        minimum_alert_amount: existingFund.minimum_alert_amount,
        created_at: new Date(existingFund.created_at),
        updated_at: new Date(existingFund.updated_at)
      };
      
      dispatch({ type: "SET_PEACE_FUND", payload: fund });
      return fund;
    }

    // If it doesn't exist, create a new one
    const { data: newFund, error: insertError } = await supabase
      .from('peace_funds')
      .insert([
        { 
          user_id: userId,
          target_amount: 10000, // Valor padrão
          current_amount: 0,
          minimum_alert_amount: 1000 // Valor padrão para alerta
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao criar fundo de paz:', insertError);
      return null;
    }

    const fund: PeaceFund = {
      id: newFund.id,
      user_id: newFund.user_id,
      target_amount: newFund.target_amount,
      current_amount: newFund.current_amount,
      minimum_alert_amount: newFund.minimum_alert_amount,
      created_at: new Date(newFund.created_at),
      updated_at: new Date(newFund.updated_at)
    };
    
    dispatch({ type: "SET_PEACE_FUND", payload: fund });
    return fund;
  } catch (error) {
    console.error('Erro inesperado ao gerenciar fundo de paz:', error);
    return null;
  } finally {
    dispatch({ type: "SET_LOADING", payload: { key: 'peaceFund', value: false } });
  }
};
