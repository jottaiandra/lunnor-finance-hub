
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import EditGoalForm from '@/components/EditGoalForm';
import GoalDepositForm from '@/components/GoalDepositForm';
import GoalWithdrawalForm from '@/components/GoalWithdrawalForm';
import { Goal } from '@/types';

interface GoalDialogsProps {
  selectedGoal: Goal | null;
  editDialogOpen: boolean;
  depositDialogOpen: boolean;
  withdrawalDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  setDepositDialogOpen: (open: boolean) => void;
  setWithdrawalDialogOpen: (open: boolean) => void;
}

const GoalDialogs: React.FC<GoalDialogsProps> = ({
  selectedGoal,
  editDialogOpen,
  depositDialogOpen,
  withdrawalDialogOpen,
  setEditDialogOpen,
  setDepositDialogOpen,
  setWithdrawalDialogOpen
}) => {
  return (
    <>
      {/* Dialog para edição de meta */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedGoal && (
            <EditGoalForm 
              goal={selectedGoal} 
              onSuccess={() => setEditDialogOpen(false)} 
              onCancel={() => setEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para depósito */}
      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedGoal && (
            <GoalDepositForm 
              goal={selectedGoal} 
              onSuccess={() => setDepositDialogOpen(false)} 
              onCancel={() => setDepositDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para saque */}
      <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedGoal && (
            <GoalWithdrawalForm 
              goal={selectedGoal} 
              onSuccess={() => setWithdrawalDialogOpen(false)} 
              onCancel={() => setWithdrawalDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoalDialogs;
