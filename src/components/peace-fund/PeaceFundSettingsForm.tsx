
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
import { Loader2 } from 'lucide-react';
import { PeaceFund } from '@/types';

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

interface PeaceFundSettingsFormProps {
  peaceFund: PeaceFund;
  onSubmit: (data: z.infer<typeof settingsSchema>) => Promise<void>;
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
  }, [peaceFund, settingsForm]);
  
  const handleSubmit = async (data: z.infer<typeof settingsSchema>) => {
    await onSubmit(data);
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
  );
};

export default PeaceFundSettingsForm;
