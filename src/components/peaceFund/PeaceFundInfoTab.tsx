
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeaceFund } from '@/types/peaceFund';
import { toast } from 'sonner';
import PeaceFundInfo from './PeaceFundInfo';
import PeaceFundForm from './PeaceFundForm';

interface PeaceFundInfoTabProps {
  peaceFund: PeaceFund;
  onUpdateSettings: () => void;
}

const PeaceFundInfoTab: React.FC<PeaceFundInfoTabProps> = ({
  peaceFund,
  onUpdateSettings
}) => {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>O que é o Fundo de Paz?</CardTitle>
        </CardHeader>
        <CardContent>
          <PeaceFundInfo />
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <PeaceFundForm 
            onSubmit={async (data) => {
              try {
                // Update logic would go here
                await onUpdateSettings();
                toast.success('Configurações atualizadas com sucesso!');
              } catch (error) {
                console.error(error);
                toast.error('Erro ao atualizar configurações');
              }
            }} 
            peaceFund={peaceFund}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PeaceFundInfoTab;
