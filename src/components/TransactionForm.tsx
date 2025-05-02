
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useFinance } from '@/contexts/FinanceContext';
import { Transaction, TransactionType, PaymentMethod, IncomeCategory, ExpenseCategory } from '@/types';

interface TransactionFormProps {
  type: TransactionType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, onSuccess, onCancel }) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [contact, setContact] = React.useState('');

  const { toast } = useToast();
  const { dispatch } = useFinance();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !description || !amount || !category || !paymentMethod) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newTransaction: Transaction = {
      id: uuidv4(),
      date: date,
      description,
      amount: Number(amount),
      category,
      paymentMethod: paymentMethod as PaymentMethod,
      type,
      contact: contact || undefined
    };

    dispatch({
      type: "ADD_TRANSACTION",
      payload: newTransaction
    });

    toast({
      title: "Sucesso",
      description: type === TransactionType.INCOME ? "Receita adicionada com sucesso!" : "Despesa adicionada com sucesso!",
    });

    if (onSuccess) {
      onSuccess();
    }
  };

  const categoryOptions = type === TransactionType.INCOME
    ? Object.values(IncomeCategory)
    : Object.values(ExpenseCategory);

  const paymentMethodOptions = Object.values(PaymentMethod);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {type === TransactionType.INCOME ? "Nova Receita" : "Nova Despesa"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Descreva a transação"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">Forma de Pagamento</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodOptions.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">
              {type === TransactionType.INCOME ? "Cliente (opcional)" : "Fornecedor (opcional)"}
            </Label>
            <Input
              id="contact"
              placeholder={type === TransactionType.INCOME ? "Nome do cliente" : "Nome do fornecedor"}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" className={type === TransactionType.INCOME ? "bg-positive hover:bg-positive/80" : "bg-negative hover:bg-negative/80"}>
              {type === TransactionType.INCOME ? "Adicionar Receita" : "Adicionar Despesa"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
