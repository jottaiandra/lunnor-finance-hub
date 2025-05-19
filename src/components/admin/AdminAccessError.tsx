
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AdminAccessErrorProps {
  error: string | null;
  isAdmin: boolean;
  onRetry?: () => void;
}

const AdminAccessError: React.FC<AdminAccessErrorProps> = ({ error, isAdmin, onRetry }) => {
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Erro de Administração</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
            <Button 
              className="mt-4"
              onClick={onRetry || (() => window.location.reload())}
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Acesso Restrito</h1>
        <Card>
          <CardContent className="pt-6">
            <p>Você não tem permissão para acessar esta página. Esta área é restrita aos administradores.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default AdminAccessError;
