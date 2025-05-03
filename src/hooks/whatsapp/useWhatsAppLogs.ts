
import { useState } from 'react';
import { 
  fetchWhatsappLogs
} from '@/contexts/finance/whatsappService';
import { WhatsappLog } from '@/contexts/finance/whatsapp/types';

export const useWhatsAppLogs = (userId: string | undefined) => {
  const [logs, setLogs] = useState<WhatsappLog[]>([]);
  
  const loadLogs = async () => {
    if (!userId) return;
    
    try {
      const data = await fetchWhatsappLogs(userId);
      setLogs(data);
    } catch (error) {
      console.error("Error loading WhatsApp logs:", error);
    }
  };

  return {
    logs,
    loadLogs
  };
};
