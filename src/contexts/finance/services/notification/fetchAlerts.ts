
import { supabase } from "@/integrations/supabase/client";
import { mapAlertFromDB } from "../../mappers";

// Fetch alerts from Supabase
export const fetchAlerts = async (userId: string, dispatch: any) => {
  if (!userId) return;
  
  try {
    dispatch({ type: "SET_LOADING", payload: { key: 'alerts', value: true } });
    
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const mappedAlerts = data.map(mapAlertFromDB);
    dispatch({ type: "SET_ALERTS", payload: mappedAlerts });
  } catch (error: any) {
    console.error("Erro ao buscar alertas:", error);
    dispatch({ type: "SET_ERROR", payload: error.message });
  } finally {
    dispatch({ type: "SET_LOADING", payload: { key: 'alerts', value: false } });
  }
};
