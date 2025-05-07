
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import TransactionForm from '@/components/TransactionForm';
import { TransactionType } from '@/types';
import { Plus } from 'lucide-react';

const TransactionButtons: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2">
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-positive hover:bg-positive/80 text-white shadow-md flex items-center gap-2 h-12">
          <Plus className="h-5 w-5" />
          <span>Nova Receita</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <TransactionForm type={TransactionType.INCOME} />
      </DialogContent>
    </Dialog>
    
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-negative hover:bg-negative/80 text-white shadow-md flex items-center gap-2 h-12">
          <Plus className="h-5 w-5" />
          <span>Nova Despesa</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <TransactionForm type={TransactionType.EXPENSE} />
      </DialogContent>
    </Dialog>
  </div>
);

export default TransactionButtons;
