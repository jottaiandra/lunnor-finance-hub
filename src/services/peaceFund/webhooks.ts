
import { PeaceFundTransaction } from '@/types/peaceFund';
import { supabase } from '@/integrations/supabase/client';

// Constants
const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/wu5fi72gbmsh10lsb375wuog319u7qx0';

/**
 * Sends a webhook notification to Make.com when a Peace Fund transaction is created
 * 
 * @param transaction The Peace Fund transaction that was created
 * @param userId The ID of the user who created the transaction
 * @returns A boolean indicating whether the webhook was sent successfully
 */
export const sendPeaceFundWebhook = async (
  transaction: PeaceFundTransaction,
  userId: string
): Promise<boolean> => {
  try {
    // Get user profile data to include in the webhook
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error("Error fetching user data for webhook:", profileError);
      return false;
    }
    
    // Format the transaction type for better readability
    const transactionType = transaction.type === 'deposit' ? 'depósito' : 'saque';
    
    // Format the message
    const message = `${transactionType} de R$ ${transaction.amount.toFixed(2)} - ${transaction.description}`;
    
    // Prepare webhook data structure as requested: name, time, message
    const webhookData = {
      nome: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
      horario: new Date(transaction.date).toISOString(),
      mensagem: message
    };
    
    console.log('Sending Peace Fund webhook to Make.com:', JSON.stringify(webhookData));
    
    // Send the webhook to Make.com
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });
    
    if (!response.ok) {
      console.error('Error sending Peace Fund webhook:', response.status, response.statusText);
      return false;
    }
    
    console.log('Peace Fund webhook sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send Peace Fund webhook:', error);
    return false;
  }
};
