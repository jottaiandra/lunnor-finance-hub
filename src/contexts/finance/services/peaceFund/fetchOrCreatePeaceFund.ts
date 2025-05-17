
import { supabase } from "@/integrations/supabase/client";
import { PeaceFund } from "@/types";
import { mapDatabasePeaceFundToFrontend } from "./mappers";

/**
 * Buscar ou criar fundo de paz para o usuário
 */
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
