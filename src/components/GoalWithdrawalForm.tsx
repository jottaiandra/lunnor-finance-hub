
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';
import { Goal } from '@/types';
import { toast } from '@/components/ui/sonner';

interface GoalWithdrawalFormProps {
  goal: Goal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const GoalWithdrawalForm: React.FC<GoalWithdrawalFormProps> = ({ goal, onSuccess, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const { updateGoal } = useFinance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error("Insira um valor válido para o saque.");
      return;
    }

    const withdrawalAmount = Number(amount);
    if (withdrawalAmount > goal.current) {
      toast.error("O valor do saque não pode ser maior que o valor atual da meta.");
      return;
    }

    try {
      setLoading(true);

      const newCurrent = goal.current - withdrawalAmount;

      const updatedGoal: Goal = {
        ...goal,
        current: newCurrent,
      };

      await updateGoal(updatedGoal);

      toast.success(`Saque de R$ ${withdrawalAmount.toFixed(2).replace('.', ',')} realizado com sucesso!`);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao fazer saque:", error);
      toast.error("Não foi possível realizar o saque.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Realizar Saque</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor do Saque (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={goal.current}
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              Valor Disponível: R$ {goal.current.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-sm text-muted-foreground">
              Novo Saldo: R$ {amount ? (goal.current - Number(amount)).toFixed(2).replace('.', ',') : goal.current.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button variant="outline" onClick={onCancel} type="button" disabled={loading}>
                Cancelar
              </Button>
            )}
            <Button 
              type="submit" 
              variant="destructive"
              disabled={loading || !amount || Number(amount) <= 0 || Number(amount) > goal.current}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Confirmar Saque"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoalWithdrawalForm;
