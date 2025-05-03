
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import WhatsAppTester from '@/components/whatsapp/WhatsAppTester';

const WhatsAppTestPage: React.FC = () => {
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
        <h1 className="text-3xl font-bold tracking-tight">Testes da Integração WhatsApp</h1>
        <p className="text-muted-foreground">
          Teste o envio de mensagens e recebimento de webhooks da Evolution API.
        </p>
      </div>
      
      <WhatsAppTester />
    </div>
  );
};

export default WhatsAppTestPage;
