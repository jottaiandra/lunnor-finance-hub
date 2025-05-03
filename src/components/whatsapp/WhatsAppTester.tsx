
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Send } from 'lucide-react';
import { testSendMessage, getLatestWebhookLogs } from '@/utils/testEvolutionApi';
import { toast } from '@/components/ui/sonner';

const WhatsAppTester: React.FC = () => {
  const [recipientNumber, setRecipientNumber] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const handleSendMessage = async () => {
    if (!recipientNumber || !message) {
      toast.error('Preencha o número e a mensagem');
      return;
    }
    
    try {
      setSending(true);
      const testResult = await testSendMessage({
        recipientNumber,
        message
      });
      
      setResult(testResult);
      
      if (testResult.success) {
        toast.success('Mensagem enviada com sucesso');
      } else {
        toast.error(`Erro ao enviar mensagem: ${testResult.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao testar envio de mensagem:', error);
      toast.error('Erro ao testar envio de mensagem');
    } finally {
      setSending(false);
    }
  };

  const loadWebhookLogs = async () => {
    try {
      setLoadingLogs(true);
      const { logs, success, error } = await getLatestWebhookLogs(10);
      
      if (success) {
        setWebhookLogs(logs);
        toast.success('Logs carregados com sucesso');
      } else {
        toast.error(`Erro ao carregar logs: ${error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao carregar logs de webhook:', error);
      toast.error('Erro ao carregar logs de webhook');
    } finally {
      setLoadingLogs(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Envio de Mensagem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Número do Destinatário</label>
            <Input
              placeholder="Ex: 5511999999999"
              value={recipientNumber}
              onChange={(e) => setRecipientNumber(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Inclua o código do país (55 para Brasil)</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mensagem</label>
            <Textarea
              placeholder="Digite sua mensagem aqui"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={sending || !recipientNumber || !message}
            className="w-full"
          >
            {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Enviar Mensagem
          </Button>

          {result && (
            <Alert variant={result.success ? "success" : "destructive"}>
              <AlertTitle>{result.success ? "Sucesso!" : "Erro!"}</AlertTitle>
              <AlertDescription>
                <p>{result.message || (result.success ? "Mensagem enviada com sucesso" : "Erro ao enviar mensagem")}</p>
                {result.data && (
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Últimos Eventos de Webhook</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadWebhookLogs}
            disabled={loadingLogs}
          >
            {loadingLogs ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Atualizar Logs"}
          </Button>
        </CardHeader>
        <CardContent>
          {webhookLogs.length > 0 ? (
            <div className="space-y-4">
              {webhookLogs.map((log) => (
                <div key={log.id} className="border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{log.event_type}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm">{log.content}</p>
                  <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                    {log.sender_number && <span>De: {log.sender_number}</span>}
                    {log.recipient_number && <span>Para: {log.recipient_number}</span>}
                  </div>
                  <details className="mt-1">
                    <summary className="cursor-pointer text-xs text-primary hover:underline">Ver dados completos</summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(log.raw_data, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {loadingLogs ? "Carregando logs..." : "Nenhum evento de webhook registrado ainda"}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-2 border-t pt-4">
        <h2 className="text-lg font-medium">Configuração do Webhook</h2>
        <p>Configure este URL de webhook na sua instância da Evolution API:</p>
        <div className="flex items-center gap-2">
          <Input 
            readOnly 
            value="https://dpfteiyxodigjvzzrwbt.supabase.co/functions/v1/evolution-webhook"
            className="font-mono text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText("https://dpfteiyxodigjvzzrwbt.supabase.co/functions/v1/evolution-webhook");
              toast.success("URL copiada para área de transferência");
            }}
          >
            Copiar
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Para configurar via API, você pode usar este comando curl:
        </p>
        <pre className="p-2 bg-muted rounded text-xs overflow-x-auto">
{`curl -X POST "https://evolution.anayaatendente.online/webhook/set/558391618969" \\
-H "Content-Type: application/json" \\
-H "apikey: DF53146D34F6-4999-A172-475485A2AC7C" \\
-d '{
  "webhook": "https://dpfteiyxodigjvzzrwbt.supabase.co/functions/v1/evolution-webhook",
  "events": [
    "messages.upsert",
    "messages.update",
    "connection.update",
    "status.instance"
  ]
}'`}
        </pre>
      </div>

      <div className="space-y-2 border-t pt-4">
        <h2 className="text-lg font-medium">Exemplos de Teste via Postman/cURL</h2>
        
        <h3 className="text-md font-medium">1. Enviar Mensagem</h3>
        <pre className="p-2 bg-muted rounded text-xs overflow-x-auto">
{`curl -X POST "https://dpfteiyxodigjvzzrwbt.supabase.co/functions/v1/whatsapp-send" \\
-H "Content-Type: application/json" \\
-d '{
  "recipientNumber": "5511999999999",
  "message": "Teste de mensagem via API"
}'`}
        </pre>
        
        <h3 className="text-md font-medium mt-4">2. Simular Webhook (para testar recebimento)</h3>
        <pre className="p-2 bg-muted rounded text-xs overflow-x-auto">
{`curl -X POST "https://dpfteiyxodigjvzzrwbt.supabase.co/functions/v1/evolution-webhook" \\
-H "Content-Type: application/json" \\
-d '{
  "event": "messages.upsert",
  "instance": "558391618969",
  "data": {
    "key": {
      "remoteJid": "5511999999999@s.whatsapp.net",
      "id": "ABCDEF123456"
    },
    "message": {
      "conversation": "Esta é uma mensagem de teste simulada"
    }
  }
}'`}
        </pre>
      </div>
    </div>
  );
};

export default WhatsAppTester;
