
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
import { Loader2 } from 'lucide-react';

const transactionSchema = z.object({
  description: z.string().min(3, "Descrição é obrigatória (mínimo 3 caracteres)"),
  amount: z.string()
    .min(1, "Valor é obrigatório")
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Valor deve ser um número positivo"
    })
});

interface PeaceFundDepositFormProps {
  onSubmit: (data: z.infer<typeof transactionSchema>) => Promise<void>;
  isSubmitting: boolean;
}

const PeaceFundDepositForm: React.FC<PeaceFundDepositFormProps> = ({ 
  onSubmit, 
  isSubmitting 
}) => {
  const depositForm = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: ""
    }
  });
  
  const handleSubmit = async (data: z.infer<typeof transactionSchema>) => {
    await onSubmit(data);
    depositForm.reset();
  };
  
  return (
    <Form {...depositForm}>
      <form onSubmit={depositForm.handleSubmit(handleSubmit)} className="space-y-4">
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
  );
};

export default PeaceFundDepositForm;
