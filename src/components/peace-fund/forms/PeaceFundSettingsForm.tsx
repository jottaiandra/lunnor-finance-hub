
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from 'lucide-react';
import { PeaceFund } from '@/types';

const settingsSchema = z.object({
  target_amount: z.string()
    .min(1, "Valor da meta é obrigatório")
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "O valor da meta deve ser um número positivo"
    }),
  minimum_alert_amount: z.string()
    .refine(val => !val || !isNaN(parseFloat(val)), {
      message: "O valor mínimo deve ser um número"
    })
    .refine(val => !val || parseFloat(val) >= 0, {
      message: "O valor mínimo deve ser maior ou igual a zero"
    })
    .optional()
    .transform(val => val === "" ? null : val)
});

interface PeaceFundSettingsFormProps {
  peaceFund: PeaceFund;
  onSubmit: (data: {
    target_amount: string;
    minimum_alert_amount: string | null;
  }) => Promise<void>;
  isSubmitting: boolean;
}

const PeaceFundSettingsForm: React.FC<PeaceFundSettingsFormProps> = ({ 
  peaceFund, 
  onSubmit, 
  isSubmitting 
}) => {
  const settingsForm = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      target_amount: peaceFund.target_amount.toString(),
      minimum_alert_amount: peaceFund.minimum_alert_amount?.toString() || ""
    }
  });
  
  const handleSubmit = async (data: z.infer<typeof settingsSchema>) => {
    await onSubmit({
      target_amount: data.target_amount,
      minimum_alert_amount: data.minimum_alert_amount
    });
  };
  
  return (
    <Form {...settingsForm}>
      <form onSubmit={settingsForm.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={settingsForm.control}
          name="target_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta do Fundo (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0.01" 
                  placeholder="0,00"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Valor que você deseja alcançar no seu Fundo de Paz
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={settingsForm.control}
          name="minimum_alert_amount"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Alerta de valor mínimo (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="Opcional"
                  value={value || ""}
                  onChange={onChange}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Você receberá um alerta quando o fundo ficar abaixo deste valor
              </FormDescription>
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
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar configurações
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PeaceFundSettingsForm;
