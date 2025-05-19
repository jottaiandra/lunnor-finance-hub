
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { DialogFooter } from '@/components/ui/dialog';
import { Shield, Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  isAdmin: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

interface AddUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      isAdmin: false
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      // Create the user in Supabase Auth
      const { data: userData, error: createUserError } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.password,
        email_confirm: true,
        user_metadata: {
          first_name: values.firstName,
          last_name: values.lastName
        }
      });
      
      if (createUserError) throw createUserError;
      
      // If user should be admin, update their role in the profiles table
      if (values.isAdmin && userData.user) {
        const { error: updateRoleError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userData.user.id);
          
        if (updateRoleError) {
          console.error('Erro ao definir papel de administrador:', updateRoleError);
          toast.error('Usuário criado, mas houve um erro ao definir o papel de administrador');
        }
      }
      
      toast.success('Usuário adicionado com sucesso');
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      
      // Handle common errors with user-friendly messages
      if (error.message.includes('already registered')) {
        toast.error('Este email já está registrado no sistema');
      } else {
        toast.error(`Erro ao adicionar usuário: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="isAdmin"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                />
              </FormControl>
              <FormLabel className="flex items-center gap-1 text-sm font-normal">
                <Shield className="h-4 w-4 text-primary" />
                Conceder privilégios de administrador
              </FormLabel>
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adicionando...
              </>
            ) : (
              'Adicionar Usuário'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddUserForm;
