
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/contexts/FinanceContext';
import { Goal } from '@/types';
import { toast } from '@/components/ui/sonner';
import GoalFormFields from './goals/GoalFormFields';
import GoalFormActions from './goals/GoalFormActions';

interface EditGoalFormProps {
  goal: Goal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditGoalForm: React.FC<EditGoalFormProps> = ({ goal, onSuccess, onCancel }) => {
  const [title, setTitle] = useState(goal.title);
  const [target, setTarget] = useState(String(goal.target));
  const [current, setCurrent] = useState(String(goal.current));
  const [type, setType] = useState<'income' | 'expense-reduction'>(goal.type);
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>(goal.period);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(goal.startDate));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(goal.endDate));
  const [loading, setLoading] = useState(false);

  const { updateGoal } = useFinance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !target || !startDate || !endDate) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);

      const updatedGoal: Goal = {
        ...goal,
        title,
        target: Number(target),
        current: Number(current),
        type,
        period,
        startDate,
        endDate
      };

      await updateGoal(updatedGoal);
      toast.success("Meta atualizada com sucesso!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao atualizar meta:", error);
      toast.error("Não foi possível atualizar a meta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border-t-4 border-t-primary shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Editar Meta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <GoalFormFields 
            title={title}
            setTitle={setTitle}
            target={target}
            setTarget={setTarget}
            current={current}
            setCurrent={setCurrent}
            type={type}
            setType={setType}
            period={period}
            setPeriod={setPeriod}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />

          <GoalFormActions 
            loading={loading}
            onCancel={onCancel}
            submitLabel="Salvar Alterações"
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default EditGoalForm;
