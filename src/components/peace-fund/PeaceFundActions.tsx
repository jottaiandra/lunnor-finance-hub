
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpCircle, ArrowDownCircle, Settings } from 'lucide-react';
import PeaceFundDepositForm from './forms/PeaceFundDepositForm';
import PeaceFundWithdrawalForm from './forms/PeaceFundWithdrawalForm';
import PeaceFundSettingsForm from './forms/PeaceFundSettingsForm';
import { useFinance } from '@/contexts/FinanceContext';
import { toast } from '@/components/ui/sonner';

const PeaceFundActions: React.FC = () => {
  const { state, addPeaceFundTransaction, updatePeaceFundSettings } = useFinance();
  const { peaceFund } = state;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  if (!peaceFund) {
    return <Card><CardContent className="p-6">Carregando...</CardContent></Card>;
  }

  const handleDepositSubmit = async (data: {description: string, amount: string}) => {
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
      toast.success("🌱 Depósito realizado com sucesso! Seu Fundo de Paz está crescendo.");
    } catch (error) {
      console.error("Erro ao depositar:", error);
      toast.error("Erro ao realizar depósito");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleWithdrawalSubmit = async (data: {description: string, amount: string}) => {
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
      toast.success("💸 Saque efetuado com sucesso!");
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
      toast.success("✅ Configurações atualizadas com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      toast.error("Erro ao atualizar configurações");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Gerenciar seu Fundo de Paz</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="deposit" className="flex gap-2">
              <ArrowUpCircle className="h-4 w-4" /> Depositar
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex gap-2">
              <ArrowDownCircle className="h-4 w-4" /> Sacar
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex gap-2">
              <Settings className="h-4 w-4" /> Configurações
            </TabsTrigger>
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

export default PeaceFundActions;
