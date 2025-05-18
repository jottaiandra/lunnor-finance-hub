
import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { toast } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import GoalCard from './goals/GoalCard';
import GoalListLoading from './goals/GoalListLoading';
import EmptyGoalsList from './goals/EmptyGoalsList';
import GoalDialogs from './goals/GoalDialogs';

const GoalsList: React.FC = () => {
  const { state, deleteGoal } = useFinance();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  
  const handleDeleteGoal = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteGoal(id);
      toast.success("Meta excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir meta:", error);
      toast.error("Erro ao excluir meta");
    } finally {
      setDeletingId(null);
    }
  };
  
  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setEditDialogOpen(true);
  };
  
  const handleDeposit = (goal: any) => {
    setSelectedGoal(goal);
    setDepositDialogOpen(true);
  };
  
  const handleWithdrawal = (goal: any) => {
    setSelectedGoal(goal);
    setWithdrawalDialogOpen(true);
  };
  
  // Show loading skeleton during API fetch
  if (state.loading.goals) {
    return <GoalListLoading />;
  }
  
  // Verify the goals data structure is valid
  const hasValidGoals = Array.isArray(state.goals) && state.goals.length > 0;
  
  if (!hasValidGoals) {
    return <EmptyGoalsList />;
  }
  
  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {state.goals.map((goal: any) => {
          // Skip rendering if goal data is invalid
          if (!goal || !goal.id) {
            console.warn("Received invalid goal data:", goal);
            return null;
          }
          
          return (
            <GoalCard
              key={goal.id}
              goal={goal}
              onDelete={handleDeleteGoal}
              onEdit={handleEditGoal}
              onDeposit={handleDeposit}
              onWithdrawal={handleWithdrawal}
              deletingId={deletingId}
            />
          );
        })}
      </div>

      <GoalDialogs
        selectedGoal={selectedGoal}
        editDialogOpen={editDialogOpen}
        depositDialogOpen={depositDialogOpen}
        withdrawalDialogOpen={withdrawalDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        setDepositDialogOpen={setDepositDialogOpen}
        setWithdrawalDialogOpen={setWithdrawalDialogOpen}
      />
    </TooltipProvider>
  );
};

export default GoalsList;
