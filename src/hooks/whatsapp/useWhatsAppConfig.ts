
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { 
  fetchWhatsappConfig, 
  saveWhatsappConfig,
  testWhatsappConnection,
  configureWebhook
} from '@/contexts/finance/whatsappService';
import { WhatsappConfig } from '@/contexts/finance/whatsapp/types';

export const useWhatsAppConfig = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [testingConnection, setTestingConnection] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configuringWebhook, setConfiguringWebhook] = useState(false);
  
  // Config state
  const [config, setConfig] = useState<Partial<WhatsappConfig>>({
    apiToken: '',
    senderNumber: '',
    recipientNumbers: [''],
    isEnabled: true,
    notificationFrequency: 'immediate',
    webhookUrl: ''
  });
  
  const loadConfig = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await fetchWhatsappConfig(userId);
      if (data) {
        setConfig({
          apiToken: data.apiToken,
          senderNumber: data.senderNumber,
          recipientNumbers: data.recipientNumbers,
          isEnabled: data.isEnabled,
          notificationFrequency: data.notificationFrequency,
          webhookUrl: data.webhookUrl
        });
      }
    } catch (error) {
      console.error("Error loading WhatsApp config:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveConfig = async () => {
    if (!userId) return;
    
    setSavingConfig(true);
    try {
      // Validate inputs
      if (!config.apiToken) {
        toast.error("Token da API é obrigatório");
        return;
      }
      
      if (!config.senderNumber) {
        toast.error("Número remetente é obrigatório");
        return;
      }
      
      if (!config.recipientNumbers || config.recipientNumbers.length === 0 || !config.recipientNumbers[0]) {
        toast.error("Pelo menos um número destinatário é obrigatório");
        return;
      }
      
      // Filter out empty recipient numbers
      const filteredRecipients = config.recipientNumbers.filter(num => num.trim() !== '');
      
      const result = await saveWhatsappConfig(userId, {
        apiToken: config.apiToken || '',
        senderNumber: config.senderNumber || '',
        recipientNumbers: filteredRecipients,
        isEnabled: config.isEnabled ?? true,
        notificationFrequency: config.notificationFrequency as 'immediate' | 'daily' | 'critical' || 'immediate',
        webhookUrl: config.webhookUrl || ''
      });
      
      if (result) {
        toast.success("Configurações do WhatsApp salvas com sucesso!");
      }
    } catch (error) {
      console.error("Error saving WhatsApp config:", error);
      toast.error("Erro ao salvar configurações do WhatsApp");
    } finally {
      setSavingConfig(false);
    }
  };
  
  const handleConfigureWebhook = async () => {
    if (!userId || !config.apiToken || !config.senderNumber) {
      toast.error("Preencha o token da API e o número remetente antes de configurar o webhook");
      return;
    }
    
    setConfiguringWebhook(true);
    try {
      // Webhook URL from environment
      const webhookUrl = `https://dpfteiyxodigjvzzrwbt.supabase.co/functions/v1/evolution-webhook`;
      
      console.log("Configurando webhook:", {
        senderNumber: config.senderNumber,
        apiToken: config.apiToken.substring(0, 5) + '...',
        webhookUrl
      });
      
      // Save webhook URL in config
      setConfig(prev => ({
        ...prev,
        webhookUrl
      }));
      
      // Configure webhook in Evolution API
      const success = await configureWebhook(
        config.senderNumber,
        config.apiToken,
        webhookUrl
      );
      
      if (success) {
        toast.success("Webhook configurado com sucesso na Evolution API");
      } else {
        toast.error("Falha ao configurar webhook na Evolution API");
      }
    } catch (error) {
      console.error("Error configuring webhook:", error);
      toast.error("Erro ao configurar webhook: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setConfiguringWebhook(false);
    }
  };
  
  const handleTestConnection = async () => {
    if (!userId) return;
    
    if (!config.apiToken || !config.senderNumber || !config.recipientNumbers || config.recipientNumbers.length === 0) {
      toast.error("Preencha todos os campos antes de testar a conexão");
      return;
    }

    // Validate input formats
    if (!config.senderNumber.trim().match(/^\d+$/)) {
      toast.error("Número remetente deve conter apenas dígitos");
      return;
    }

    if (!config.recipientNumbers[0].trim().match(/^\d+$/)) {
      toast.error("Número destinatário deve conter apenas dígitos");
      return;
    }
    
    setTestingConnection(true);
    try {
      console.log("Testando conexão com:", {
        apiToken: config.apiToken.substring(0, 5) + '...',
        senderNumber: config.senderNumber,
        recipientNumber: config.recipientNumbers[0]
      });
      
      const result = await testWhatsappConnection(
        config.apiToken,
        config.senderNumber,
        config.recipientNumbers[0]
      );
      
      if (result) {
        toast.success("Conexão testada com sucesso! Uma mensagem de teste foi enviada.");
      } else {
        toast.error("Falha ao conectar com a Evolution API. Verifique os dados informados.");
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      toast.error("Erro ao testar conexão: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setTestingConnection(false);
    }
  };
  
  const handleAddRecipient = () => {
    setConfig(prev => ({
      ...prev,
      recipientNumbers: [...(prev.recipientNumbers || []), '']
    }));
  };
  
  const handleRemoveRecipient = (index: number) => {
    setConfig(prev => {
      const newRecipients = [...(prev.recipientNumbers || [])];
      newRecipients.splice(index, 1);
      return {
        ...prev,
        recipientNumbers: newRecipients
      };
    });
  };
  
  const handleRecipientChange = (index: number, value: string) => {
    setConfig(prev => {
      const newRecipients = [...(prev.recipientNumbers || [])];
      newRecipients[index] = value;
      return {
        ...prev,
        recipientNumbers: newRecipients
      };
    });
  };

  return {
    loading,
    config,
    setConfig,
    testingConnection,
    savingConfig,
    configuringWebhook,
    loadConfig,
    handleSaveConfig,
    handleTestConnection,
    handleConfigureWebhook,
    handleAddRecipient,
    handleRemoveRecipient,
    handleRecipientChange,
  };
};
