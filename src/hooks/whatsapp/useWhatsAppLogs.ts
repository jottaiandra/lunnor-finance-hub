
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchWhatsappLogs
} from '@/contexts/finance/whatsapp/logsService';
import { WhatsappLog } from '@/contexts/finance/whatsapp/types';
import { toast } from '@/components/ui/sonner';

export const useWhatsAppLogs = (userId: string | undefined) => {
  const [logs, setLogs] = useState<WhatsappLog[]>([]);
  const [loading, setLoading] = useState(false);
  
  const loadLogs = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const data = await fetchWhatsappLogs(userId);
      setLogs(data);
      console.log("WhatsApp logs carregados:", data.length);
    } catch (error) {
      console.error("Erro ao carregar logs do WhatsApp:", error);
      toast.error("Erro ao carregar histórico de mensagens");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadLogs();
    }
  }, [userId, loadLogs]);

  return {
    logs,
    loadLogs,
    loading
  };
};
