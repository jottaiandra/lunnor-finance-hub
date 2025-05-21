
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useCustomization } from '@/contexts/CustomizationContext';

const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

const resetSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

const AuthPage: React.FC = () => {
  const { user, loading, signIn, resetPassword } = useAuth();
  const [showResetForm, setShowResetForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { settings } = useCustomization();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '' },
  });

  // Ensure the user is redirected to the app route
  const onLogin = async (data: LoginFormValues) => {
    setIsProcessing(true);
    try {
      await signIn(data.email, data.password);
      // This redirect will be handled by the AuthContext onAuthStateChange
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const onReset = async (data: ResetFormValues) => {
    setIsProcessing(true);
    try {
      await resetPassword(data.email);
      setShowResetForm(false);
      toast.success('Email de recuperação enviado!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary">{settings.platformName}</h1>
            <p className="text-gray-500">Gerencie suas finanças com facilidade</p>
          </div>

          {showResetForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Recuperação de Senha</CardTitle>
                <CardDescription>
                  Digite seu e-mail para receber um link de recuperação de senha.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
                    <FormField
                      control={resetForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage className="text-destructive" />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90" 
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Enviar link de recuperação
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="link" onClick={() => setShowResetForm(false)}>
                  Voltar para o login
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Entre com seu e-mail e senha para acessar sua conta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage className="text-destructive" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field} 
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-10 px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                          </div>
                          <FormMessage className="text-destructive" />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90" 
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Entrar
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="link" onClick={() => setShowResetForm(true)}>
                  Esqueceu sua senha?
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
