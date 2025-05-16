
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { createPeaceFundTransaction } from '@/services/peaceFundService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  type: z.enum(['deposit', 'withdrawal']),
  amount: z.coerce
    .number()
    .positive({ message: 'O valor deve ser maior que zero' }),
  description: z.string()
    .min(3, { message: 'A descrição deve ter pelo menos 3 caracteres' }),
});

type FormValues = z.infer<typeof formSchema>;

interface PeaceFundTransactionFormProps {
  peaceFundId: string;
  onSuccess: () => void;
}

const PeaceFundTransactionForm: React.FC<PeaceFundTransactionFormProps> = ({ 
  peaceFundId, 
  onSuccess 
}) => {
  const { user } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'deposit',
      amount: 0,
      description: '',
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!user) return;
    
    try {
      await createPeaceFundTransaction({
        peace_fund_id: peaceFundId,
        user_id: user.id,
        type: values.type,
        amount: values.amount,
        description: values.description,
        date: new Date().toISOString(),
      });
      
      form.reset({
        type: 'deposit',
        amount: 0,
        description: '',
      });
      
      toast.success(
        values.type === 'deposit' 
          ? 'Depósito adicionado com sucesso!' 
          : 'Saque adicionado com sucesso!'
      );
      
      // Chama a função de callback diretamente para garantir a atualização
      onSuccess();
    } catch (error) {
      console.error('Failed to create transaction:', error);
      toast.error('Falha ao registrar movimentação');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="deposit">Depósito</SelectItem>
                    <SelectItem value="withdrawal">Saque</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Descrição da movimentação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Adicionar Movimentação
        </Button>
      </form>
    </Form>
  );
};

export default PeaceFundTransactionForm;
