
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import { TransactionType } from '@/types';
import { useFinance } from '@/contexts/FinanceContext';
import { Loader2, Bell } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const TransactionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('all');
  const [activeForm, setActiveForm] = React.useState<TransactionType | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dataLoaded, setDataLoaded] = React.useState(false);
  const { dispatch, fetchTransactions, fetchNotifications, state, markNotificationRead, hasUnreadNotifications } = useFinance();

  useEffect(() => {
    // Evita chamadas repetidas adicionando uma flag de verificação
    if (dataLoaded) return;
    
    const loadData = async () => {
      try {
        console.log("TransactionsPage: Loading data...");
        await fetchTransactions();
        await fetchNotifications();
        setDataLoaded(true);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados. Por favor, tente novamente.");
      }
    };
    
    loadData();
  }, [fetchTransactions, fetchNotifications, dataLoaded]);

  const handleOpenIncomeForm = () => {
    setActiveForm(TransactionType.INCOME);
    setDialogOpen(true);
  };

  const handleOpenExpenseForm = () => {
    setActiveForm(TransactionType.EXPENSE);
    setDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setDialogOpen(false);
    toast.success('Transação registrada com sucesso!');
    // Recarregar as transações após o registro bem-sucedido
    fetchTransactions();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update filter based on tab
    const type = value === 'all' ? null : 
                value === 'income' ? TransactionType.INCOME : 
                TransactionType.EXPENSE;
    
    dispatch({
      type: "SET_FILTER",
      payload: { type }
    });
  };
  
  const handleNotificationClick = (id: string) => {
    markNotificationRead(id);
  };

  // Mostrar estado de carregamento apenas durante carregamento inicial
  if (!dataLoaded && state.loading.transactions) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">Gerencie suas receitas e despesas.</p>
        </div>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {hasUnreadNotifications() && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive"></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="p-2 border-b border-border">
                <h3 className="font-medium">Notificações</h3>
              </div>
              {state.notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  Nenhuma notificação
                </div>
              ) : (
                <div className="max-h-96 overflow-auto">
                  {state.notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-3 border-b border-border cursor-pointer hover:bg-muted/50 ${notification.isRead ? 'bg-white' : 'bg-muted/20'}`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(notification.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <Badge variant="outline" className="ml-2 bg-blue-50">Nova</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>
          
          <Button 
            className="bg-positive hover:bg-positive/80" 
            onClick={handleOpenIncomeForm}
          >
            Nova Receita
          </Button>
          <Button 
            className="bg-negative hover:bg-negative/80" 
            onClick={handleOpenExpenseForm}
          >
            Nova Despesa
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="income">Receitas</TabsTrigger>
          <TabsTrigger value="expense">Despesas</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TransactionList />
        </TabsContent>
        
        <TabsContent value="income">
          <TransactionList title="Receitas" />
        </TabsContent>
        
        <TabsContent value="expense">
          <TransactionList title="Despesas" />
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {activeForm !== null && (
            <TransactionForm
              type={activeForm}
              onSuccess={handleFormSuccess}
              onCancel={() => setDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionsPage;
