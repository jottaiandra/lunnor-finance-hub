
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, User, Shield, MessageSquare, Paintbrush } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WhatsAppMessageLogs from '@/components/admin/WhatsAppMessageLogs';
import CustomizationSettings from '@/components/admin/CustomizationSettings';
import UsersTab from '@/components/admin/UsersTab';
import AdminAccessError from '@/components/admin/AdminAccessError';

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
  const [adminCheckError, setAdminCheckError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    let isMounted = true;
    
    const checkAdminStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setAdminCheckError(null);
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
      setAdminCheckError('Erro ao carregar lista de usuários');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If there's an error checking admin status or user is not admin, show error component
  if (adminCheckError || !isAdmin) {
    return <AdminAccessError error={adminCheckError} isAdmin={isAdmin} onRetry={() => window.location.reload()} />;
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
          <TabsTrigger value="customization">
            <Paintbrush className="h-4 w-4 mr-2" /> Personalização
          </TabsTrigger>
          <TabsTrigger value="whatsapp">
            <MessageSquare className="h-4 w-4 mr-2" /> Logs de WhatsApp
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UsersTab users={users} loading={loading} onUserChange={fetchUsers} />
        </TabsContent>

        <TabsContent value="customization">
          <CustomizationSettings />
        </TabsContent>
        
        <TabsContent value="whatsapp">
          <WhatsAppMessageLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
