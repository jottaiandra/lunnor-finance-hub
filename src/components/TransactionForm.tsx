
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFinance } from '@/contexts/FinanceContext';
import { Transaction, TransactionType, IncomeCategory, ExpenseCategory } from '@/types';
import TransactionDetails from './transactions/TransactionDetails';
import RecurrenceOptions from './transactions/RecurrenceOptions';
import FormActions from './transactions/FormActions';

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
  const [loading, setLoading] = React.useState(false);
  
  // Recurrence states
  const [isRecurrent, setIsRecurrent] = React.useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = React.useState('monthly');
  const [recurrenceInterval, setRecurrenceInterval] = React.useState('1');
  const [recurrenceEndDate, setRecurrenceEndDate] = React.useState<Date | undefined>(undefined);

  const { toast } = useToast();
  const { addTransaction } = useFinance();

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

      const newTransaction: Omit<Transaction, "id"> = {
        date: date,
        description,
        amount: Number(amount),
        category,
        paymentMethod: paymentMethod as any, // Cast to PaymentMethod
        type,
        contact: contact || undefined,
        isRecurrent,
        recurrenceFrequency: isRecurrent ? recurrenceFrequency : undefined,
        recurrenceInterval: isRecurrent ? Number(recurrenceInterval) : undefined,
        recurrenceStartDate: isRecurrent ? date : undefined,
        recurrenceEndDate: isRecurrent ? recurrenceEndDate : undefined,
        isOriginal: true
      };

      await addTransaction(newTransaction);
      
      // Envio direto para o Make com log detalhado
      const makeWebhookUrl = "https://hook.us2.make.com/xvkee5kj7au6i85tb8yvrv682kau9fxm";
      const webhookData = {
        nome: contact || "Usuário",
        tipo: type === TransactionType.INCOME ? "receita" : "despesa",
        valor: amount,
        descricao: description,
        data: date?.toISOString().split("T")[0]
      };
      
      console.log("Enviando dados para Make.com:", JSON.stringify(webhookData));
      
      fetch(makeWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(webhookData)
      })
      .then(res => {
        console.log("Status da resposta Make:", res.status);
        return res.text(); // Usamos text() em vez de json() para ver qualquer resposta
      })
      .then(data => {
        console.log("Resposta completa do Make:", data);
        try {
          // Tenta converter para JSON se a resposta for um JSON válido
          const jsonData = JSON.parse(data);
          console.log("Resposta do Make como JSON:", jsonData);
        } catch (e) {
          // Se não for JSON, já exibimos como texto acima
        }
      })
      .catch(err => {
        console.error("Erro detalhado no envio ao Make:", err);
      });

      toast({
        title: "Sucesso",
        description: type === TransactionType.INCOME ? "Receita adicionada com sucesso!" : "Despesa adicionada com sucesso!",
      });

      // Reset form
      setDate(new Date());
      setDescription('');
      setAmount('');
      setCategory('');
      setPaymentMethod('');
      setContact('');
      setIsRecurrent(false);
      setRecurrenceFrequency('monthly');
      setRecurrenceInterval('1');
      setRecurrenceEndDate(undefined);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a transação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = type === TransactionType.INCOME
    ? Object.values(IncomeCategory)
    : Object.values(ExpenseCategory);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {type === TransactionType.INCOME ? "Nova Receita" : "Nova Despesa"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TransactionDetails
            type={type}
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
            type={type} 
            onCancel={onCancel}
            loading={loading}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
