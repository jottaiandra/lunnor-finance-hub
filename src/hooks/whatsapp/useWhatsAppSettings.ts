
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWhatsAppConfig } from './useWhatsAppConfig';
import { useWhatsAppTemplates } from './useWhatsAppTemplates';
import { useWhatsAppLogs } from './useWhatsAppLogs';
import { EVENT_TYPES } from '@/contexts/finance/whatsapp/constants';

export { EVENT_TYPES };

export const useWhatsAppSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('config');
  
  const {
    loading: loadingConfig,
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
  } = useWhatsAppConfig(user?.id);
  
  const {
    templates,
    activeTemplate,
    setActiveTemplate,
    templateText,
    setTemplateText,
    savingTemplate,
    loadTemplates,
    handleSaveTemplate
  } = useWhatsAppTemplates(user?.id);
  
  const {
    logs,
    loadLogs,
    loading: loadingLogs
  } = useWhatsAppLogs(user?.id);
  
  useEffect(() => {
    if (user) {
      loadConfig();
      loadTemplates();
      loadLogs();
    }
  }, [user]);

  // Função para atualizar os logs quando solicitado
  const refreshLogs = () => {
    if (user) {
      loadLogs();
    }
  };

  const loading = loadingConfig || loadingLogs;

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
    loadingLogs,
    refreshLogs,
    testingConnection,
    savingConfig,
    savingTemplate,
    configuringWebhook,
    handleSaveConfig,
    handleTestConnection,
    handleConfigureWebhook,
    handleAddRecipient,
    handleRemoveRecipient,
    handleRecipientChange,
    handleSaveTemplate,
  };
};
