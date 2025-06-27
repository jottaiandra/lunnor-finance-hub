
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFinance } from '@/contexts/FinanceContext';
import { Transaction, TransactionType, IncomeCategory, ExpenseCategory } from '@/types';
import TransactionDetails from './transactions/TransactionDetails';
import RecurrenceOptions from './transactions/RecurrenceOptions';
import FormActions from './transactions/FormActions';

interface EditTransactionFormProps {
  transaction: Transaction;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditTransactionForm: React.FC<EditTransactionFormProps> = ({ transaction, onSuccess, onCancel }) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date(transaction.date));
  const [description, setDescription] = React.useState(transaction.description);
  const [amount, setAmount] = React.useState(transaction.amount.toString());
  const [category, setCategory] = React.useState(transaction.category);
  const [paymentMethod, setPaymentMethod] = React.useState(transaction.paymentMethod);
  const [contact, setContact] = React.useState(transaction.contact || '');
  const [loading, setLoading] = React.useState(false);
  
  // Recurrence states
  const [isRecurrent, setIsRecurrent] = React.useState(transaction.isRecurrent || false);
  const [recurrenceFrequency, setRecurrenceFrequency] = React.useState(transaction.recurrenceFrequency || 'monthly');
  const [recurrenceInterval, setRecurrenceInterval] = React.useState(transaction.recurrenceInterval?.toString() || '1');
  const [recurrenceEndDate, setRecurrenceEndDate] = React.useState<Date | undefined>(
    transaction.recurrenceEndDate ? new Date(transaction.recurrenceEndDate) : undefined
  );

  const { toast } = useToast();
  const { updateTransaction } = useFinance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !description || !amount || !category || !paymentMethod) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (isRecurrent && !recurrenceFrequency) {
      toast({
        title: "Erro",
        description: "Selecione a frequência da recorrência.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const updatedTransaction: Transaction = {
        ...transaction,
        date: date,
        description,
        amount: Number(amount),
        category,
        paymentMethod: paymentMethod as any,
        contact: contact || undefined,
        isRecurrent,
        recurrenceFrequency: isRecurrent ? recurrenceFrequency : undefined,
        recurrenceInterval: isRecurrent ? Number(recurrenceInterval) : undefined,
        recurrenceStartDate: isRecurrent ? date : undefined,
        recurrenceEndDate: isRecurrent ? recurrenceEndDate : undefined,
      };

      await updateTransaction(updatedTransaction);

      toast({
        title: "Sucesso",
        description: "Transação atualizada com sucesso!",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a transação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = transaction.type === TransactionType.INCOME
    ? Object.values(IncomeCategory)
    : Object.values(ExpenseCategory);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Editar {transaction.type === TransactionType.INCOME ? "Receita" : "Despesa"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TransactionDetails
            type={transaction.type}
            date={date}
            setDate={setDate}
            description={description}
            setDescription={setDescription}
            amount={amount}
            setAmount={setAmount}
            category={category}
            setCategory={setCategory}
            categoryOptions={categoryOptions}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            contact={contact}
            setContact={setContact}
          />
          
          <RecurrenceOptions
            isRecurrent={isRecurrent}
            setIsRecurrent={setIsRecurrent}
            recurrenceFrequency={recurrenceFrequency}
            setRecurrenceFrequency={setRecurrenceFrequency}
            recurrenceInterval={recurrenceInterval}
            setRecurrenceInterval={setRecurrenceInterval}
            recurrenceEndDate={recurrenceEndDate}
            setRecurrenceEndDate={setRecurrenceEndDate}
          />

          <FormActions 
            type={transaction.type} 
            onCancel={onCancel}
            loading={loading}
            submitText="Atualizar"
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default EditTransactionForm;
