
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
  Download,
  MessageSquare,
  Webhook
} from 'lucide-react';
import WhatsAppLogsFilter from './WhatsAppLogsFilter';
import WhatsAppLogsPagination from './WhatsAppLogsPagination';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface WebhookEvent {
  id: string;
  event_type: string;
  sender_number: string;
  recipient_number: string;
  content: string;
  message_type: string;
  status: string;
  raw_data: any;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

const WhatsAppWebhookLogs: React.FC = () => {
  const [logs, setLogs] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filtros
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
      
      setLogs(data || []);
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
      
      csvContent += `"${log.event_type}","${log.sender_number}","${log.recipient_number}","${log.content.replace(/"/g, '""')}","${log.message_type}","${log.status}","${date}"\n`;
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

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return (
        <>
          <span className="block">{date.toLocaleDateString('pt-BR')}</span>
          <span className="block text-xs text-muted-foreground">{date.toLocaleTimeString('pt-BR')}</span>
          <span className="block text-xs italic mt-1">
            {formatDistance(date, new Date(), { addSuffix: true, locale: ptBR })}
          </span>
        </>
      );
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Webhook className="mr-2 h-5 w-5" />
            Logs de Eventos Webhook WhatsApp
          </span>
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
          filterStatus={filterEventType}
          setFilterStatus={setFilterEventType}
          filterDateFrom={filterDateFrom}
          setFilterDateFrom={setFilterDateFrom}
          filterDateTo={filterDateTo}
          setFilterDateTo={setFilterDateTo}
          handleClearFilters={handleClearFilters}
          statusLabel="Tipo de Evento"
          statusOptions={[
            { value: "", label: "Todos os eventos" },
            { value: "messages.upsert", label: "Mensagem recebida" },
            { value: "messages.update", label: "Mensagem atualizada" },
            { value: "status.instance", label: "Status da instância" },
            { value: "connection.update", label: "Conexão atualizada" },
          ]}
        />
        
        {/* Tabela de Logs */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo de Evento</TableHead>
                <TableHead>Números</TableHead>
                <TableHead>Conteúdo</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center p-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                    <span className="mt-2 block">Carregando logs...</span>
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center p-8 text-muted-foreground">
                    Nenhum evento de webhook encontrado
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatTimestamp(log.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.event_type.includes("message") ? "default" : "outline"}>
                        {log.event_type === "messages.upsert" ? "Mensagem recebida" :
                         log.event_type === "messages.update" ? "Mensagem atualizada" :
                         log.event_type === "status.instance" ? "Status da instância" :
                         log.event_type === "connection.update" ? "Conexão atualizada" :
                         log.event_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {log.sender_number && (
                          <div className="text-xs">
                            <span className="font-semibold">De:</span> {log.sender_number}
                          </div>
                        )}
                        {log.recipient_number && (
                          <div className="text-xs">
                            <span className="font-semibold">Para:</span> {log.recipient_number}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={log.content}>
                        {log.message_type === 'text' ? (
                          <div className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {log.content}
                          </div>
                        ) : (
                          <Badge variant="secondary">{log.message_type}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <details className="text-sm">
                        <summary className="cursor-pointer text-primary">Ver detalhes</summary>
                        <div className="mt-2 p-2 bg-muted rounded text-xs whitespace-pre-wrap max-h-32 overflow-auto">
                          {typeof log.raw_data === 'object' 
                            ? JSON.stringify(log.raw_data, null, 2)
                            : log.raw_data
                          }
                        </div>
                      </details>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
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

export default WhatsAppWebhookLogs;
