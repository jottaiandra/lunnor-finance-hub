
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { 
  fetchWhatsappConfig, 
  saveWhatsappConfig,
  testWhatsappConnection,
  fetchWhatsappTemplates,
  saveWhatsappTemplate,
  fetchWhatsappLogs
} from '@/contexts/finance/whatsappService';
import { WhatsappConfig, WhatsappTemplate, WhatsappLog } from '@/contexts/finance/whatsapp/types';

export const EVENT_TYPES = [
  { id: 'new_income', name: 'Nova receita' },
  { id: 'new_expense', name: 'Nova despesa' },
  { id: 'upcoming_expense', name: 'Despesas a vencer' },
  { id: 'goal_achieved', name: 'Meta alcançada' },
  { id: 'low_balance', name: 'Saldo baixo' },
  { id: 'goal_updated', name: 'Meta atualizada' },
  { id: 'transaction_updated', name: 'Transação atualizada' }
];

export const useWhatsAppSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('config');
  const [loading, setLoading] = useState(true);
  const [testingConnection, setTestingConnection] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  
  // Config state
  const [config, setConfig] = useState<Partial<WhatsappConfig>>({
    apiToken: '',
    senderNumber: '',
    recipientNumbers: [''],
    isEnabled: true,
    notificationFrequency: 'immediate'
  });
  
  // Templates state
  const [templates, setTemplates] = useState<WhatsappTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<string>('new_income');
  const [templateText, setTemplateText] = useState<string>('');
  
  // Logs state
  const [logs, setLogs] = useState<WhatsappLog[]>([]);
  
  useEffect(() => {
    if (user) {
      loadConfig();
      loadTemplates();
      loadLogs();
    }
  }, [user]);
  
  useEffect(() => {
    // When active template changes, load the template text
    const template = templates.find(t => t.eventType === activeTemplate);
    if (template) {
      setTemplateText(template.messageTemplate);
    } else {
      // Load default template
      const defaultTemplate = EVENT_TYPES.find(et => et.id === activeTemplate);
      if (defaultTemplate) {
        switch (defaultTemplate.id) {
          case 'new_income':
            setTemplateText("Olá {nome}! Uma nova receita de {valor} foi registrada com a descrição: {descricao}.");
            break;
          case 'new_expense':
            setTemplateText("Atenção {nome}! Uma nova despesa de {valor} foi registrada com a descrição: {descricao}.");
            break;
          case 'upcoming_expense':
            setTemplateText("Lembrete: Você tem {count} despesa(s) a vencer nos próximos dias, totalizando {valor}.");
            break;
          case 'goal_achieved':
            setTemplateText("Parabéns {nome}! Sua meta '{titulo}' foi atingida com sucesso!");
            break;
          case 'low_balance':
            setTemplateText("Alerta! Seu saldo atual de {valor} está abaixo do limite definido.");
            break;
          case 'goal_updated':
            setTemplateText("A meta '{titulo}' foi atualizada. Progresso atual: {progresso}%.");
            break;
          case 'transaction_updated':
            setTemplateText("Uma transação foi atualizada: {descricao} - {valor}");
            break;
          default:
            setTemplateText("Notificação do Lunnor Caixa: {mensagem}");
        }
      }
    }
  }, [activeTemplate, templates]);
  
  const loadConfig = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await fetchWhatsappConfig(user.id);
      if (data) {
        setConfig({
          apiToken: data.apiToken,
          senderNumber: data.senderNumber,
          recipientNumbers: data.recipientNumbers,
          isEnabled: data.isEnabled,
          notificationFrequency: data.notificationFrequency
        });
      }
    } catch (error) {
      console.error("Error loading WhatsApp config:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadTemplates = async () => {
    if (!user) return;
    
    try {
      const data = await fetchWhatsappTemplates(user.id);
      setTemplates(data);
    } catch (error) {
      console.error("Error loading WhatsApp templates:", error);
    }
  };
  
  const loadLogs = async () => {
    if (!user) return;
    
    try {
      const data = await fetchWhatsappLogs(user.id);
      setLogs(data);
    } catch (error) {
      console.error("Error loading WhatsApp logs:", error);
    }
  };
  
  const handleSaveConfig = async () => {
    if (!user) return;
    
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
      
      const result = await saveWhatsappConfig(user.id, {
        apiToken: config.apiToken || '',
        senderNumber: config.senderNumber || '',
        recipientNumbers: filteredRecipients,
        isEnabled: config.isEnabled ?? true,
        notificationFrequency: config.notificationFrequency as 'immediate' | 'daily' | 'critical' || 'immediate'
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
  
  const handleTestConnection = async () => {
    if (!user) return;
    
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
  
  const handleSaveTemplate = async () => {
    if (!user || !activeTemplate) return;
    
    setSavingTemplate(true);
    try {
      const result = await saveWhatsappTemplate(user.id, {
        eventType: activeTemplate,
        messageTemplate: templateText
      });
      
      if (result) {
        // Update templates list
        await loadTemplates();
        toast.success("Modelo de mensagem salvo com sucesso!");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Erro ao salvar modelo de mensagem");
    } finally {
      setSavingTemplate(false);
    }
  };

  return {
    user,
    loading,
    activeTab,
    setActiveTab,
    config,
    setConfig,
    templates,
    activeTemplate,
    setActiveTemplate,
    templateText,
    setTemplateText,
    logs,
    testingConnection,
    savingConfig,
    savingTemplate,
    handleSaveConfig,
    handleTestConnection,
    handleAddRecipient,
    handleRemoveRecipient,
    handleRecipientChange,
    handleSaveTemplate,
  };
};
