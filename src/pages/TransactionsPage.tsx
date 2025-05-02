
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import { TransactionType } from '@/types';
import { useFinance } from '@/contexts/FinanceContext';
import { Loader2 } from 'lucide-react';

const TransactionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('all');
  const [activeForm, setActiveForm] = React.useState<TransactionType | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { dispatch, fetchTransactions, state } = useFinance();

  useEffect(() => {
    fetchTransactions();
  }, []);

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

  if (state.loading.transactions) {
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
          <Button className="bg-positive hover:bg-positive/80" onClick={handleOpenIncomeForm}>
            Nova Receita
          </Button>
          <Button className="bg-negative hover:bg-negative/80" onClick={handleOpenExpenseForm}>
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
