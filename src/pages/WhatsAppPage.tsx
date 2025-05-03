
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import WhatsAppSettings from '@/components/WhatsAppSettings';
import { AlertCircle, Info, Webhook, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { testEvolutionApi } from '@/contexts/finance/whatsapp/testEvolutionApi';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WhatsAppMessageLogs from '@/components/admin/WhatsAppMessageLogs';
import WhatsAppWebhookLogs from '@/components/admin/WhatsAppWebhookLogs';
import { useProfiles } from '@/hooks/useProfiles';

const EVOLUTION_API_BASE_URL = "https://evolution.anayaatendente.online";

const WhatsAppPage: React.FC = () => {
  const { user } = useAuth();
  const { currentProfile } = useProfiles();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('settings');

  const handleTestApi = async () => {
    setTesting(true);
    try {
      const result = await testEvolutionApi();
      setTestResult(result);
    } finally {
      setTesting(false);
    }
  };

  // Check if user is admin
  const isAdmin = currentProfile?.role === 'admin';

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Acesso restrito</AlertTitle>
        <AlertDescription>
          Você precisa estar logado para acessar esta página.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notificações WhatsApp</h1>
        <p className="text-muted-foreground">
          Configure suas notificações automáticas via WhatsApp usando a Evolution API.
        </p>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Atualização da API</AlertTitle>
        <AlertDescription>
          A Evolution API está disponível em: {EVOLUTION_API_BASE_URL}
        </AlertDescription>
      </Alert>

      <div className="flex flex-col space-y-4">
        <Button 
          onClick={handleTestApi}
          disabled={testing}
          className="w-fit"
        >
          {testing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Testar API com credenciais fixas
        </Button>

        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"}>
            <AlertTitle>{testResult.success ? "Teste bem-sucedido" : "Falha no teste"}</AlertTitle>
            <AlertDescription className="max-w-full overflow-auto">
              {testResult.success ? (
                <p>A API está funcionando corretamente!</p>
              ) : (
                <p>Erro: {testResult.error}</p>
              )}
              {testResult.data && (
                <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-auto">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      {isAdmin ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">
              <MessageSquare className="h-4 w-4 mr-2" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="logs">
              <MessageSquare className="h-4 w-4 mr-2" />
              Logs de Mensagens
            </TabsTrigger>
            <TabsTrigger value="webhook-logs">
              <Webhook className="h-4 w-4 mr-2" />
              Eventos Webhook
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <WhatsAppSettings />
          </TabsContent>
          
          <TabsContent value="logs">
            <WhatsAppMessageLogs />
          </TabsContent>
          
          <TabsContent value="webhook-logs">
            <WhatsAppWebhookLogs />
          </TabsContent>
        </Tabs>
      ) : (
        <WhatsAppSettings />
      )}
    </div>
  );
};

export default WhatsAppPage;
