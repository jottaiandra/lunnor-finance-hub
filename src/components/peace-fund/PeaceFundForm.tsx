
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useFinance } from '@/contexts/FinanceContext';
import { Loader2 } from 'lucide-react';

const transactionSchema = z.object({
  description: z.string().min(3, "Descrição é obrigatória (mínimo 3 caracteres)"),
  amount: z.string()
    .min(1, "Valor é obrigatório")
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Valor deve ser um número positivo"
    })
});

const settingsSchema = z.object({
  target_amount: z.string()
    .min(1, "Valor é obrigatório")
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Valor deve ser um número positivo"
    }),
  minimum_alert_amount: z.string()
    .refine(val => val === '' || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: "Valor deve ser um número positivo ou zero"
    })
    .optional()
    .transform(val => val === '' ? null : val)
});

const PeaceFundForm: React.FC = () => {
  const { state, addPeaceFundTransaction, updatePeaceFundSettings } = useFinance();
  const { peaceFund } = state;
  const [activeTab, setActiveTab] = React.useState<string>("deposit");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  
  const depositForm = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: ""
    }
  });
  
  const withdrawalForm = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: ""
    }
  });
  
  const settingsForm = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      target_amount: peaceFund ? peaceFund.target_amount.toString() : "10000",
      minimum_alert_amount: peaceFund?.minimum_alert_amount 
        ? peaceFund.minimum_alert_amount.toString() 
        : "1000"
    }
  });
  
  React.useEffect(() => {
    if (peaceFund) {
      settingsForm.reset({
        target_amount: peaceFund.target_amount.toString(),
        minimum_alert_amount: peaceFund.minimum_alert_amount 
          ? peaceFund.minimum_alert_amount.toString() 
          : ""
      });
    }
  }, [peaceFund]);
  
  const onSubmitDeposit = async (data: z.infer<typeof transactionSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await addPeaceFundTransaction({
        amount: parseFloat(data.amount),
        description: data.description,
        type: 'deposit'
      });
      
      if (result) {
        depositForm.reset();
        toast({
          title: "Depósito realizado",
          description: "O valor foi adicionado ao seu Fundo de Paz."
        });
      } else {
        toast({
          title: "Erro ao realizar depósito",
          description: "Ocorreu um erro ao processar sua solicitação.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao depositar:", error);
      toast({
        title: "Erro ao realizar depósito",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onSubmitWithdrawal = async (data: z.infer<typeof transactionSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await addPeaceFundTransaction({
        amount: parseFloat(data.amount),
        description: data.description,
        type: 'withdrawal'
      });
      
      if (result) {
        withdrawalForm.reset();
        toast({
          title: "Saque realizado",
          description: "O valor foi retirado do seu Fundo de Paz."
        });
      } else {
        toast({
          title: "Erro ao realizar saque",
          description: "Ocorreu um erro ao processar sua solicitação.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao sacar:", error);
      toast({
        title: "Erro ao realizar saque",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onSubmitSettings = async (data: z.infer<typeof settingsSchema>) => {
    setIsSubmitting(true);
    try {
      await updatePeaceFundSettings({
        target_amount: parseFloat(data.target_amount),
        minimum_alert_amount: data.minimum_alert_amount 
          ? parseFloat(data.minimum_alert_amount)
          : null
      });
      
      toast({
        title: "Configurações atualizadas",
        description: "As configurações do seu Fundo de Paz foram atualizadas com sucesso."
      });
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      toast({
        title: "Erro ao atualizar configurações",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!peaceFund) {
    return <p>Carregando...</p>;
  }
  
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
            <Form {...depositForm}>
              <form onSubmit={depositForm.handleSubmit(onSubmitDeposit)} className="space-y-4">
                <FormField
                  control={depositForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={depositForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ex: Reserva mensal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="default"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Depositar no Fundo"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="withdraw">
            <Form {...withdrawalForm}>
              <form onSubmit={withdrawalForm.handleSubmit(onSubmitWithdrawal)} className="space-y-4">
                <FormField
                  control={withdrawalForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={withdrawalForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ex: Uso para emergência" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="default"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Sacar do Fundo"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="settings">
            <Form {...settingsForm}>
              <form onSubmit={settingsForm.handleSubmit(onSubmitSettings)} className="space-y-4">
                <FormField
                  control={settingsForm.control}
                  name="target_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta do Fundo (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={settingsForm.control}
                  name="minimum_alert_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor mínimo para alerta (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          placeholder="Deixe em branco para desativar alertas"
                          {...field} 
                          value={field.value !== null ? field.value : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="default"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Salvar Configurações"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PeaceFundForm;
