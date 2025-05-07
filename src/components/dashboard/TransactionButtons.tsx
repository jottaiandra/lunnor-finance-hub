
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import TransactionForm from '@/components/TransactionForm';
import { TransactionType } from '@/types';

const TransactionButtons: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2">
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-positive hover:bg-positive/80 text-white">Nova Receita</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <TransactionForm type={TransactionType.INCOME} />
      </DialogContent>
    </Dialog>
    
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-negative hover:bg-negative/80 text-white">Nova Despesa</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <TransactionForm type={TransactionType.EXPENSE} />
      </DialogContent>
    </Dialog>
  </div>
);

export default TransactionButtons;
