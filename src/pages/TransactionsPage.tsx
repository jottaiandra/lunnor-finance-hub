
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import { TransactionType } from '@/types';

const TransactionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('all');
  const [activeForm, setActiveForm] = React.useState<TransactionType | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="income">Receitas</TabsTrigger>
          <TabsTrigger value="expense">Despesas</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TransactionList />
        </TabsContent>
        
        <TabsContent value="income">
          <TransactionList />
        </TabsContent>
        
        <TabsContent value="expense">
          <TransactionList />
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
