
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import WhatsAppSettings from '@/components/WhatsAppSettings';
import { AlertCircle, Info } from 'lucide-react';

const EVOLUTION_API_BASE_URL = "https://evolution.anayaatendente.online";

const WhatsAppPage: React.FC = () => {
  const { user } = useAuth();

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
      
      <WhatsAppSettings />
    </div>
  );
};

export default WhatsAppPage;
