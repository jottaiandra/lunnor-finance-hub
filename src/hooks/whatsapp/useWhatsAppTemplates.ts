
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { 
  fetchWhatsappTemplates,
  saveWhatsappTemplate,
} from '@/contexts/finance/whatsappService';
import { WhatsappTemplate } from '@/contexts/finance/whatsapp/types';
import { DEFAULT_TEMPLATES } from '@/contexts/finance/whatsapp/constants';

export const useWhatsAppTemplates = (userId: string | undefined) => {
  const [templates, setTemplates] = useState<WhatsappTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<string>('new_income');
  const [templateText, setTemplateText] = useState<string>('');
  const [savingTemplate, setSavingTemplate] = useState(false);
  
  useEffect(() => {
    // When active template changes, load the template text
    const template = templates.find(t => t.eventType === activeTemplate);
    if (template) {
      setTemplateText(template.messageTemplate);
    } else {
      // Load default template
      setTemplateText(DEFAULT_TEMPLATES[activeTemplate as keyof typeof DEFAULT_TEMPLATES] || DEFAULT_TEMPLATES.default);
    }
  }, [activeTemplate, templates]);
  
  const loadTemplates = async () => {
    if (!userId) return;
    
    try {
      const data = await fetchWhatsappTemplates(userId);
      setTemplates(data);
    } catch (error) {
      console.error("Error loading WhatsApp templates:", error);
    }
  };
  
  const handleSaveTemplate = async () => {
    if (!userId || !activeTemplate) return;
    
    setSavingTemplate(true);
    try {
      const result = await saveWhatsappTemplate(userId, {
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
    templates,
    activeTemplate,
    setActiveTemplate,
    templateText,
    setTemplateText,
    savingTemplate,
    loadTemplates,
    handleSaveTemplate
  };
};
