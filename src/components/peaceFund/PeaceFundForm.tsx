
import React from 'react';
import { useForm } from 'react-hook-form';
import { PeaceFund } from '@/types/peaceFund';
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  target_amount: z.coerce
    .number()
    .min(1, { message: 'O valor alvo deve ser maior que zero' }),
  minimum_alert_amount: z.coerce
    .number()
    .min(0, { message: 'O valor mínimo deve ser positivo' })
    .nullable(),
});

interface PeaceFundFormProps {
  onSubmit: (data: Partial<PeaceFund>) => void;
  peaceFund?: PeaceFund;
}

const PeaceFundForm: React.FC<PeaceFundFormProps> = ({ onSubmit, peaceFund }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      target_amount: peaceFund?.target_amount || 0,
      minimum_alert_amount: peaceFund?.minimum_alert_amount || null,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="target_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Alvo</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="10000"
                  step="0.01"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minimum_alert_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Mínimo de Alerta</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="5000"
                  step="0.01"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? null : Number(e.target.value);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {peaceFund ? 'Atualizar Configurações' : 'Criar Fundo de Paz'}
        </Button>
      </form>
    </Form>
  );
};

export default PeaceFundForm;
