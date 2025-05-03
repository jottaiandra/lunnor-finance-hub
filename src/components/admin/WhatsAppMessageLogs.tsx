
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { 
  RefreshCw,
  Download
} from 'lucide-react';
import WhatsAppLogsFilter from './WhatsAppLogsFilter';
import WhatsAppLogsTable from './WhatsAppLogsTable';
import WhatsAppLogsPagination from './WhatsAppLogsPagination';

interface MessageLog {
  id: string;
  number: string;
  message: string;
  status: string;
  response: any;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

const WhatsAppMessageLogs: React.FC = () => {
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filtros
  const [filterNumber, setFilterNumber] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // Start building the query
      let query = supabase
        .from('whatsapp_message_logs')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (filterNumber) {
        query = query.ilike('number', `%${filterNumber}%`);
      }
      
      if (filterStatus) {
        query = query.eq('status', filterStatus);
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
      
      setLogs(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar logs:", error);
      toast.error("Erro ao carregar logs de mensagens");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLogs();
  }, [currentPage, filterStatus, filterNumber, filterDateFrom, filterDateTo]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleClearFilters = () => {
    setFilterNumber('');
    setFilterStatus('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    // Convert logs to CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // CSV Header
    csvContent += "Numero,Mensagem,Status,Data,Resposta\n";
    
    // CSV Data
    logs.forEach(log => {
      const date = new Date(log.created_at).toLocaleString('pt-BR');
      const response = log.response ? JSON.stringify(log.response).replace(/,/g, ' ') : '';
      
      csvContent += `"${log.number}","${log.message.replace(/"/g, '""')}","${log.status}","${date}","${response}"\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `whatsapp-logs-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Logs de Mensagens WhatsApp</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchLogs()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportToCSV}
            >
              <Download className="h-4 w-4 mr-1" />
              Exportar CSV
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <WhatsAppLogsFilter
          filterNumber={filterNumber}
          setFilterNumber={setFilterNumber}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterDateFrom={filterDateFrom}
          setFilterDateFrom={setFilterDateFrom}
          filterDateTo={filterDateTo}
          setFilterDateTo={setFilterDateTo}
          handleClearFilters={handleClearFilters}
        />
        
        {/* Tabela de Logs */}
        <WhatsAppLogsTable logs={logs} loading={loading} />
        
        {/* Paginação */}
        <WhatsAppLogsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </CardContent>
    </Card>
  );
};

export default WhatsAppMessageLogs;
