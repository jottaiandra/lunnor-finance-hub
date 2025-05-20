
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
      .select('first_name, last_name, phone_number')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error("Error fetching user data for webhook:", profileError);
      return false;
    }
    
    // Get system name from customization settings
    const { data: customData } = await supabase
      .from('customization_settings')
      .select('platform_name')
      .single();
    
    const systemName = customData?.platform_name || 'Lunnor Caixa';
    
    // Map Peace Fund transaction type to standard transaction type for consistency
    const transactionType = transaction.type === 'deposit' ? 'receita' : 'despesa';
    const peaceFundType = transaction.type === 'deposit' ? 'depósito' : 'saque';
    
    // Format the data for the webhook to match the standard transaction format
    const webhookData = {
      nome: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
      tipo: transactionType,
      valor: transaction.amount,
      descricao: `Fundo de Paz: ${peaceFundType} - ${transaction.description}`,
      data: new Date(transaction.date).toISOString().split('T')[0], // Format as YYYY-MM-DD
      telefone: profileData.phone_number || '',
      user_id: userId
    };
    
    // Format the message using the template
    const message = `Olá ${webhookData.nome}! Um novo ${peaceFundType} no Fundo de Paz foi registrado.\n` +
      `💰 Valor: R$ ${transaction.amount.toFixed(2)}\n` +
      `📝 Descrição: ${transaction.description}\n` +
      `📅 Data: ${webhookData.data}\n\n` +
      `Continue organizando sua vida financeira com o ${systemName}!`;
    
    // Add the message to the webhook data
    webhookData['mensagem'] = message;
    
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
