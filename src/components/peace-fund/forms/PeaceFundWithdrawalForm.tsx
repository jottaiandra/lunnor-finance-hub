
import React from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wallet } from 'lucide-react';

const transactionSchema = z.object({
  description: z.string().min(3, "Descrição é obrigatória (mínimo 3 caracteres)"),
  amount: z.string()
    .min(1, "Valor é obrigatório")
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Valor deve ser um número positivo"
    })
});

interface PeaceFundWithdrawalFormProps {
  onSubmit: (data: z.infer<typeof transactionSchema>) => Promise<void>;
  isSubmitting: boolean;
}

const PeaceFundWithdrawalForm: React.FC<PeaceFundWithdrawalFormProps> = ({ 
  onSubmit, 
  isSubmitting 
}) => {
  const withdrawalForm = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: ""
    }
  });
  
  const handleSubmit = async (data: z.infer<typeof transactionSchema>) => {
    await onSubmit(data);
    if (!isSubmitting) {
      withdrawalForm.reset();
    }
  };
  
  return (
    <Form {...withdrawalForm}>
      <form onSubmit={withdrawalForm.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={withdrawalForm.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor do saque (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0.01" 
                  placeholder="0,00"
                  {...field} 
                />
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
              <FormLabel>Motivo do saque</FormLabel>
              <FormControl>
                <Textarea placeholder="Ex: Emergência médica, Conserto..." {...field} />
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
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Sacar do Fundo
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PeaceFundWithdrawalForm;
