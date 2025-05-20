
import { Transaction } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Constants
const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/wu5fi72gbmsh10lsb375wuog319u7qx0';

// Send unified webhook to Make
export const sendTransactionWebhook = async (
  transaction: Transaction,
  userId: string
) => {
  try {
    // Get user profile data to include in the webhook
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, phone_number')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error("Erro ao buscar dados do usuário para webhook:", profileError);
      return false;
    }
    
    // Get system name from customization settings
    const { data: customData } = await supabase
      .from('customization_settings')
      .select('platform_name')
      .single();
    
    const systemName = customData?.platform_name || 'Lunnor Caixa';
    
    // Format transaction type for better readability
    const transactionType = transaction.type === 'income' ? 'receita' : 'despesa';
    
    // Format the data for the webhook exactly as specified
    const webhookData = {
      nome: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
      tipo: transactionType,
      valor: transaction.amount,
      descricao: transaction.description,
      data: new Date(transaction.date).toISOString().split('T')[0], // Format as YYYY-MM-DD
      telefone: profileData.phone_number || '',
      user_id: userId
    };
    
    // Format the message using the template
    const message = `Olá ${webhookData.nome}! Uma nova ${transactionType} foi registrada.\n` +
      `💰 Valor: R$ ${transaction.amount.toFixed(2)}\n` +
      `📝 Descrição: ${transaction.description}\n` +
      `📅 Data: ${webhookData.data}\n\n` +
      `Continue organizando sua vida financeira com o ${systemName}!`;
    
    // Add the message to the webhook data
    webhookData['mensagem'] = message;
    
    console.log('Enviando webhook para o Make com os dados:', JSON.stringify(webhookData));
    
    // Send the webhook to Make
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });
    
    if (!response.ok) {
      console.error('Erro ao enviar webhook para o Make:', response.status, response.statusText);
      return false;
    }
    
    console.log('Webhook enviado com sucesso para o Make:', webhookData);
    return true;
  } catch (error) {
    console.error('Erro ao enviar webhook para o Make:', error);
    return false;
  }
};
