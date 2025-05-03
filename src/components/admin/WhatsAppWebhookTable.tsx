import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { RefreshCw, MessageSquare } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { WebhookEvent } from '@/types/whatsapp';

interface WhatsAppWebhookTableProps {
  logs: WebhookEvent[];
  loading: boolean;
}

const WhatsAppWebhookTable: React.FC<WhatsAppWebhookTableProps> = ({ logs, loading }) => {
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
  );
};

export default WhatsAppWebhookTable;
