
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WhatsAppMessageLogs from '@/components/admin/WhatsAppMessageLogs';
import WhatsAppWebhookLogs from '@/components/admin/WhatsAppWebhookLogs';
import CustomizationSettings from '@/components/admin/CustomizationSettings';
import CreateUserForm from '@/components/admin/CreateUserForm';
import UsersList from '@/components/admin/UsersList';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('customization');

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Administração</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="customization">Personalização</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="whatsapp-logs">Logs de WhatsApp</TabsTrigger>
          <TabsTrigger value="webhook-logs">Logs de Webhook</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customization">
          <CustomizationSettings />
        </TabsContent>
        
        <TabsContent value="users">
          <CreateUserForm />
          <UsersList />
        </TabsContent>
        
        <TabsContent value="whatsapp-logs">
          <WhatsAppMessageLogs />
        </TabsContent>
        
        <TabsContent value="webhook-logs">
          <WhatsAppWebhookLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
