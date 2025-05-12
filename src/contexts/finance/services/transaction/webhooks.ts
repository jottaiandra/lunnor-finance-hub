
import { Transaction } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Send webhook to Make
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
    
    // Format the data for the webhook
    const webhookData = {
      nome: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
      tipo: transaction.type === 'income' ? 'receita' : 'despesa',
      valor: transaction.amount,
      descricao: transaction.description,
      data: new Date(transaction.date).toISOString().split('T')[0], // Format as YYYY-MM-DD
      telefone: profileData.phone_number || ''
    };
    
    // Send the webhook to Make
    const webhookUrl = 'https://hook.us2.make.com/xvkee5kj7au6i85tb8yvrv682kau9fxm';
    
    const response = await fetch(webhookUrl, {
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
