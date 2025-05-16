
import { supabase } from "@/integrations/supabase/client";
import { PeaceFund } from "@/types";
import { mapDatabasePeaceFundToFrontend } from "./mappers";

/**
 * Update settings function to accept minimum_alert_amount
 */
export const updateSettings = async (
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
