
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
    setIsSubmitting(true);
    try {
      const result = await addPeaceFundTransaction({
        amount: parseFloat(data.amount),
        description: data.description,
        type: 'deposit'
      });
      
      if (result !== null) {
        toast.success("Depósito realizado com sucesso");
      } else {
        toast.error("Erro ao realizar depósito");
      }
    } catch (error) {
      console.error("Erro ao depositar:", error);
      toast.error("Erro ao realizar depósito");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleWithdrawalSubmit = async (data: {description: string, amount: string}) => {
    setIsSubmitting(true);
    try {
      const result = await addPeaceFundTransaction({
        amount: parseFloat(data.amount),
        description: data.description,
        type: 'withdrawal'
      });
      
      if (result !== null) {
        toast.success("Saque realizado com sucesso");
      } else {
        toast.error("Erro ao realizar saque");
      }
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
