
import React, { useEffect } from 'react';
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
import { Loader2 } from 'lucide-react';

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
  onSubmitStart?: () => void;
  isProcessing?: boolean;
}

const PeaceFundTransactionForm: React.FC<PeaceFundTransactionFormProps> = ({ 
  peaceFundId, 
  onSuccess,
  onSubmitStart,
  isProcessing = false
}) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'deposit',
      amount: 0,
      description: '',
    },
  });

  // Use the external isProcessing prop if provided
  const isSubmitting = isProcessing || submitting;

  useEffect(() => {
    console.log('PeaceFundTransactionForm rendered with peaceFundId:', peaceFundId);
  }, [peaceFundId]);

  const handleSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }
    
    if (!peaceFundId) {
      toast.error('ID do Fundo de Paz não fornecido');
      return;
    }
    
    if (onSubmitStart) {
      onSubmitStart();
    } else {
      setSubmitting(true);
    }
    
    try {
      console.log('Creating transaction with values:', values);
      console.log('peaceFundId:', peaceFundId);
      console.log('user.id:', user.id);
      
      await createPeaceFundTransaction({
        peace_fund_id: peaceFundId,
        user_id: user.id,
        type: values.type,
        amount: values.amount,
        description: values.description,
        date: new Date().toISOString(),
      });
      
      console.log('Transaction created successfully');
      
      form.reset({
        type: 'deposit',
        amount: 0,
        description: '',
      });
      
      // Call the success callback
      if (onSuccess) {
        console.log('Calling onSuccess callback from form');
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to create transaction:', error);
      toast.error('Falha ao registrar movimentação');
    } finally {
      if (!onSubmitStart) {
        setSubmitting(false);
      }
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

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            'Adicionar Movimentação'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PeaceFundTransactionForm;
