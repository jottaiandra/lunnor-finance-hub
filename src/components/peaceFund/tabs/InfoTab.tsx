
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PeaceFundInfo from '../PeaceFundInfo';
import PeaceFundForm from '../PeaceFundForm';
import { PeaceFund } from '@/types/peaceFund';
import { toast } from '@/components/ui/use-toast';
import { updatePeaceFund } from '@/services/peaceFund';

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
      console.log('Atualizando configurações do Fundo de Paz:', data);
      
      // Update the peace fund with the new configuration
      await updatePeaceFund(peaceFund.id, {
        target_amount: data.target_amount,
        minimum_alert_amount: data.minimum_alert_amount,
      });
      
      await onUpdateSuccess();
      toast({
        title: 'Configurações atualizadas com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast({
        variant: "destructive",
        title: 'Erro ao atualizar configurações',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
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
