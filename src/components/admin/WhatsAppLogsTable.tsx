
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MessageLog {
  id: string;
  number: string;
  message: string;
  status: string;
  response: any;
  created_at: string;
}

interface WhatsAppLogsTableProps {
  logs: MessageLog[];
  loading: boolean;
}

const WhatsAppLogsTable: React.FC<WhatsAppLogsTableProps> = ({ logs, loading }) => {
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
            <TableHead>Número</TableHead>
            <TableHead>Mensagem</TableHead>
            <TableHead>Status</TableHead>
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
                Nenhum log de mensagem encontrado
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap">
                  {formatTimestamp(log.created_at)}
                </TableCell>
                <TableCell>{log.number}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={log.message}>
                    {log.message}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {log.status === 'success' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" /> Sucesso
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" /> Falha
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <details className="text-sm">
                    <summary className="cursor-pointer text-primary">Ver resposta</summary>
                    <div className="mt-2 p-2 bg-muted rounded text-xs whitespace-pre-wrap max-h-32 overflow-auto">
                      {JSON.stringify(log.response, null, 2)}
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

export default WhatsAppLogsTable;
