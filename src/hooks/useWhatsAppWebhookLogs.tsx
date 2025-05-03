import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/sonner';
import { WebhookEvent } from '@/types/whatsapp';

const ITEMS_PER_PAGE = 10;

export const useWhatsAppWebhookLogs = () => {
  const [logs, setLogs] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filters
  const [filterNumber, setFilterNumber] = useState('');
  const [filterEventType, setFilterEventType] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // Start building the query
      let query = supabase
        .from('evolution_webhook_events')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (filterNumber) {
        query = query.or(`sender_number.ilike.%${filterNumber}%,recipient_number.ilike.%${filterNumber}%`);
      }
      
      if (filterEventType) {
        query = query.eq('event_type', filterEventType);
      }
      
      if (filterDateFrom) {
        query = query.gte('created_at', filterDateFrom);
      }
      
      if (filterDateTo) {
        // Add one day to include all entries from the selected day
        const nextDay = new Date(filterDateTo);
        nextDay.setDate(nextDay.getDate() + 1);
        query = query.lt('created_at', nextDay.toISOString());
      }
      
      // Pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      // Complete the query with order, pagination, etc.
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) {
        throw error;
      }
      
      if (count !== null) {
        setTotalItems(count);
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }
      
      setLogs(data as WebhookEvent[] || []);
    } catch (error: any) {
      console.error("Erro ao carregar logs de webhook:", error);
      toast.error("Erro ao carregar logs de eventos de webhook");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLogs();
  }, [currentPage, filterEventType, filterNumber, filterDateFrom, filterDateTo]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleClearFilters = () => {
    setFilterNumber('');
    setFilterEventType('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    // Convert logs to CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // CSV Header
    csvContent += "Tipo de Evento,Remetente,Destinatário,Conteúdo,Tipo de Mensagem,Status,Data\n";
    
    // CSV Data
    logs.forEach(log => {
      const date = new Date(log.created_at).toLocaleString('pt-BR');
      
      csvContent += `"${log.event_type}","${log.sender_number}","${log.recipient_number}","${log.content?.replace(/"/g, '""')}","${log.message_type}","${log.status}","${date}"\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `whatsapp-webhooks-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  };

  return {
    logs,
    loading,
    currentPage,
    totalPages,
    totalItems,
    filterNumber,
    setFilterNumber,
    filterEventType,
    setFilterEventType,
    filterDateFrom,
    setFilterDateFrom,
    filterDateTo,
    setFilterDateTo,
    handlePageChange,
    handleClearFilters,
    fetchLogs,
    exportToCSV,
    ITEMS_PER_PAGE
  };
};
