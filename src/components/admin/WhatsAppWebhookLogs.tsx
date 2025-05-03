
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw,
  Download,
  Webhook
} from 'lucide-react';
import WhatsAppLogsFilter from './WhatsAppLogsFilter';
import WhatsAppLogsPagination from './WhatsAppLogsPagination';
import WhatsAppWebhookTable from './WhatsAppWebhookTable';
import { useWhatsAppWebhookLogs } from '@/hooks/useWhatsAppWebhookLogs';

const WhatsAppWebhookLogs: React.FC = () => {
  const {
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
  } = useWhatsAppWebhookLogs();

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
        <WhatsAppWebhookTable logs={logs} loading={loading} />
        
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
