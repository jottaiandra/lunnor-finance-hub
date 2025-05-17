
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PeaceFundInfo from '../PeaceFundInfo';
import PeaceFundForm from '../PeaceFundForm';
import { PeaceFund } from '@/types/peaceFund';
import { toast } from '@/components/ui/use-toast';

interface InfoTabProps {
  peaceFund: PeaceFund;
  onUpdateSuccess: () => Promise<void>;
}

const InfoTab: React.FC<InfoTabProps> = ({ 
  peaceFund,
  onUpdateSuccess
}) => {
  const handleUpdateConfig = async (data: Partial<PeaceFund>) => {
    try {
      // Update logic would go here
      await onUpdateSuccess();
      toast({
        title: 'Configurações atualizadas com sucesso!',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: 'Erro ao atualizar configurações',
      });
    }
  };

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
            onSubmit={handleUpdateConfig} 
            peaceFund={peaceFund}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoTab;
