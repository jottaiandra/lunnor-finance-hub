
import React, { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial'),
  confirmPassword: z.string().min(1, 'Confirme sua nova senha'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordFormProps {
  form: UseFormReturn<PasswordFormValues>;
  user: User | null;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ form, user }) => {
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async (data: PasswordFormValues) => {
    try {
      setLoading(true);
      
      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: data.currentPassword,
      });
      
      if (signInError) {
        toast.error('Senha atual incorreta');
        setLoading(false);
        return;
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      
      if (error) throw error;
      
      toast.success('Senha atualizada com sucesso');
      form.reset();
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      toast.error('Erro ao atualizar senha');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handlePasswordUpdate)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha Atual</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground mt-1">
                A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, 
                minúsculas, números e caracteres especiais.
              </p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Nova Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={loading || !form.formState.isDirty}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Atualizar Senha
        </Button>
      </form>
    </Form>
  );
};

export default PasswordForm;
