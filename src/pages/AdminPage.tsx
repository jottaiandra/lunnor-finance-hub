import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Loader2, User, Shield, UserX, MessageSquare } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WhatsAppMessageLogs from '@/components/admin/WhatsAppMessageLogs';

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'user';
  created_at: string;
}

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminCheckError, setAdminCheckError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    // Só executar uma vez quando o componente montar
    let isMounted = true;
    
    const checkAdminStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setAdminCheckError(null);
        // Verificar se o usuário é admin
        const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
        
        if (error) {
          console.error('Erro ao verificar status de admin:', error);
          if (isMounted) {
            setAdminCheckError('Erro ao verificar permissões de administrador');
            setLoading(false);
          }
          return;
        }
        
        if (isMounted) {
          setIsAdmin(data || false);
          if (data) {
            fetchUsers();
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar status de admin:', error);
        if (isMounted) {
          setAdminCheckError('Erro ao verificar permissões de administrador');
          setLoading(false);
        }
      }
    };
    
    checkAdminStatus();
    
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data as UserProfile[]);
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar lista de usuários');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Atualizar a lista local
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      toast.success(`Usuário ${newRole === 'admin' ? 'promovido a administrador' : 'definido como usuário normal'}`);
    } catch (error: any) {
      console.error('Erro ao atualizar papel do usuário:', error);
      toast.error('Erro ao atualizar papel do usuário');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(userToDelete);
      
      if (error) throw error;
      
      // Remover da lista local
      setUsers(users.filter(u => u.id !== userToDelete));
      toast.success('Usuário excluído com sucesso');
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    } finally {
      setUserToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (adminCheckError) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Erro de Administração</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">{adminCheckError}</p>
            <Button 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Acesso Restrito</h1>
        <Card>
          <CardContent className="pt-6">
            <p>Você não tem permissão para acessar esta página. Esta área é restrita aos administradores.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administração</h1>
        <p className="text-muted-foreground">Gerencie usuários e configurações do sistema.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="users">
            <User className="h-4 w-4 mr-2" /> Usuários
          </TabsTrigger>
          <TabsTrigger value="whatsapp">
            <MessageSquare className="h-4 w-4 mr-2" /> Logs de WhatsApp
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2" /> Usuários do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Nome</th>
                      <th className="p-2 text-left">Papel</th>
                      <th className="p-2 text-left">Criado em</th>
                      <th className="p-2 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center">
                          Nenhum usuário encontrado
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">
                            {user.first_name || ''} {user.last_name || ''}
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                            </span>
                          </td>
                          <td className="p-2">
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-2 text-right">
                            {user.role === 'admin' ? (
                              <Button
                                variant="outline" 
                                size="sm"
                                onClick={() => toggleUserRole(user.id, 'user')}
                              >
                                Remover Admin
                              </Button>
                            ) : (
                              <Button
                                variant="outline" 
                                size="sm" 
                                className="mr-2"
                                onClick={() => toggleUserRole(user.id, 'admin')}
                              >
                                <Shield className="h-4 w-4 mr-1" /> Promover
                              </Button>
                            )}
                            
                            <AlertDialog open={deleteDialogOpen && userToDelete === user.id} onOpenChange={setDeleteDialogOpen}>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => {
                                    setUserToDelete(user.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <UserX className="h-4 w-4 mr-1" /> Excluir
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente a conta 
                                    do usuário {user.email} e removerá todos os dados associados.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="whatsapp">
          <WhatsAppMessageLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
