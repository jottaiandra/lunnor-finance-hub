
import React from 'react';
import { WhatsappLog } from '@/contexts/finance/whatsapp/types';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventType {
  id: string;
  name: string;
}

interface WhatsAppLogsProps {
  logs: WhatsappLog[];
  eventTypes: EventType[];
  loading?: boolean;
  onRefresh?: () => void;
}

const WhatsAppLogs: React.FC<WhatsAppLogsProps> = ({ logs, eventTypes, loading = false, onRefresh }) => {
  return (
    <div className="space-y-4">
      {onRefresh && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="ml-2">Carregando logs...</span>
        </div>
      ) : logs.length > 0 ? (
        <div className="border rounded-md">
          <table className="w-full">
            <thead>
              <tr className="bg-muted border-b">
                <th className="text-left p-2">Data/Hora</th>
                <th className="text-left p-2">Evento</th>
                <th className="text-left p-2">Destinatário</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-2 text-sm">
                    {log.sentAt.toLocaleString('pt-BR')}
                  </td>
                  <td className="p-2 text-sm">
                    {eventTypes.find(et => et.id === log.eventType)?.name || log.eventType}
                  </td>
                  <td className="p-2 text-sm">
                    {log.recipient}
                  </td>
                  <td className="p-2 text-sm">
                    <div className="flex items-center">
                      {log.status === 'sent' || log.status === 'delivered' ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      {log.status}
                      {log.errorMessage && <span className="ml-2 text-xs text-red-500">{log.errorMessage}</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          Nenhum registro de mensagem encontrado
        </div>
      )}
    </div>
  );
};

export default WhatsAppLogs;
