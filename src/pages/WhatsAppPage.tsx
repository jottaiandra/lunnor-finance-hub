
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import WhatsAppSettings from '@/components/WhatsAppSettings';
import { AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { testEvolutionApi } from '@/contexts/finance/whatsapp/testEvolutionApi';
import { Loader2 } from 'lucide-react';

const EVOLUTION_API_BASE_URL = "https://evolution.anayaatendente.online";

const WhatsAppPage: React.FC = () => {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const handleTestApi = async () => {
    setTesting(true);
    try {
      const result = await testEvolutionApi();
      setTestResult(result);
    } finally {
      setTesting(false);
    }
  };

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
      
      <WhatsAppSettings />
    </div>
  );
};

export default WhatsAppPage;
