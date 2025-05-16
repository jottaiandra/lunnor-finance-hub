
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/components/ui/sonner';
import { useFinance } from '@/contexts/FinanceContext';
import PeaceFundDepositForm from './PeaceFundDepositForm';
import PeaceFundWithdrawalForm from './PeaceFundWithdrawalForm';
import PeaceFundSettingsForm from './PeaceFundSettingsForm';
import * as z from "zod";

const PeaceFundForm: React.FC = () => {
  const { state, addPeaceFundTransaction, updatePeaceFundSettings } = useFinance();
  const { peaceFund } = state;
  const [activeTab, setActiveTab] = React.useState<string>("deposit");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  
  if (!peaceFund) {
    return <p>Carregando...</p>;
  }
  
  const handleDepositSubmit = async (data: {description: string, amount: string}) => {
    // Validar os dados de entrada
    if (!data.amount || isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0) {
      toast.error("Digite um valor válido para continuar.");
      return;
    }
    
    if (!data.description || data.description.trim().length < 3) {
      toast.error("A descrição é obrigatória (mínimo 3 caracteres).");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addPeaceFundTransaction({
        amount: parseFloat(data.amount),
        description: data.description,
        type: 'deposit'
      });
    } catch (error) {
      console.error("Erro ao depositar:", error);
      toast.error("Erro ao realizar depósito");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleWithdrawalSubmit = async (data: {description: string, amount: string}) => {
    // Validar os dados de entrada
    if (!data.amount || isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0) {
      toast.error("Digite um valor válido para continuar.");
      return;
    }
    
    if (!data.description || data.description.trim().length < 3) {
      toast.error("A descrição é obrigatória (mínimo 3 caracteres).");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Verificar se há saldo suficiente
      const amount = parseFloat(data.amount);
      if (peaceFund.current_amount < amount) {
        toast.error("Você não pode sacar mais do que tem no Fundo de Paz.");
        setIsSubmitting(false);
        return;
      }
      
      await addPeaceFundTransaction({
        amount: amount,
        description: data.description,
        type: 'withdrawal'
      });
    } catch (error) {
      console.error("Erro ao sacar:", error);
      toast.error("Erro ao realizar saque");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSettingsSubmit = async (data: {
    target_amount: string, 
    minimum_alert_amount: string | null
  }) => {
    setIsSubmitting(true);
    try {
      await updatePeaceFundSettings({
        target_amount: parseFloat(data.target_amount),
        minimum_alert_amount: data.minimum_alert_amount 
          ? parseFloat(data.minimum_alert_amount)
          : null
      });
      toast.success("Configurações atualizadas com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      toast.error("Erro ao atualizar configurações");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Gerenciar Fundo</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="deposit">Depositar</TabsTrigger>
            <TabsTrigger value="withdraw">Sacar</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit">
            <PeaceFundDepositForm 
              onSubmit={handleDepositSubmit}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="withdraw">
            <PeaceFundWithdrawalForm 
              onSubmit={handleWithdrawalSubmit}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <PeaceFundSettingsForm 
              peaceFund={peaceFund}
              onSubmit={handleSettingsSubmit}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PeaceFundForm;
