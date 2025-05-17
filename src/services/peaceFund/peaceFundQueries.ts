
import { supabase } from '@/integrations/supabase/client';
import { PeaceFund } from '@/types/peaceFund';
import { mapPeaceFundFromDB } from './mappers';

// Get user's peace fund
export async function getUserPeaceFund() {
  const { data, error } = await supabase
    .from('peace_funds')
    .select('*')
    .limit(1)
    .single();
    
  if (error) {
    console.error('Error fetching peace fund:', error);
    return null;
  }
  
  return data ? mapPeaceFundFromDB(data) : null;
}

// Create a peace fund
export async function createPeaceFund(peaceFundData: Omit<PeaceFund, 'id' | 'created_at' | 'updated_at'>) {
  // Convert Date objects to ISO strings for Supabase
  const dbPeaceFund = {
    ...peaceFundData,
    current_amount: peaceFundData.current_amount || 0,
    target_amount: peaceFundData.target_amount || 0
  };
  
  const { data, error } = await supabase
    .from('peace_funds')
    .insert([dbPeaceFund])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating peace fund:', error);
    throw error;
  }
  
  return mapPeaceFundFromDB(data);
}

// Update peace fund
export async function updatePeaceFund(id: string, updates: Partial<Omit<PeaceFund, 'id' | 'created_at'>>) {
  // Convert any Date objects to ISO strings for Supabase
  const dbUpdates = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('peace_funds')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating peace fund:', error);
    throw error;
  }
  
  return mapPeaceFundFromDB(data);
}
