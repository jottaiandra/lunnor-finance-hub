
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UserPlus, Users } from 'lucide-react';
import CreateUserForm from './CreateUserForm';
import UsersList from './UsersList';

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('list');
  const [userAdded, setUserAdded] = useState<boolean>(false);

  const handleUserCreated = () => {
    // Set flag to true to trigger user list refresh
    setUserAdded(true);
    // Switch to list view after user creation
    setActiveTab('list');
  };

  // Reset flag when tab changes to avoid unnecessary refreshes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'list' && userAdded) {
      setUserAdded(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Gerenciamento de Usuários</h2>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Listar</span>
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Adicionar</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="list">
        <UsersList key={userAdded ? 'refreshed' : 'normal'} />
      </TabsContent>
      
      <TabsContent value="create">
        <CreateUserForm onUserCreated={handleUserCreated} />
      </TabsContent>
    </div>
  );
};

export default UserManagement;
