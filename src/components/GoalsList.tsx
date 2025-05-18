
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/contexts/FinanceContext';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { AlertCircle, Check, Trash, Loader2, Target, Edit, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from '@/components/ui/sonner';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent } from './ui/dialog';
import EditGoalForm from './EditGoalForm';
import GoalDepositForm from './GoalDepositForm';
import GoalWithdrawalForm from './GoalWithdrawalForm';

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
  
  const calculateProgress = (goal: any) => {
    if (!goal || typeof goal.current !== 'number' || typeof goal.target !== 'number') {
      return 0;
    }
    const percentage = (goal.current / goal.target) * 100;
    return Math.min(100, Math.max(0, percentage));
  };
  
  // Show loading skeleton during API fetch
  if (state.loading.goals) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  // Verify the goals data structure is valid
  const hasValidGoals = Array.isArray(state.goals) && state.goals.length > 0;
  
  if (!hasValidGoals) {
    return (
      <Card className="py-12">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <Target className="h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">Nenhuma meta encontrada</h3>
            <p className="text-muted-foreground">
              Crie sua primeira meta financeira usando o botão "Nova Meta" acima.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {state.goals.map((goal: any) => {
          // Skip rendering if goal data is invalid
          if (!goal || !goal.id) {
            console.warn("Received invalid goal data:", goal);
            return null;
          }
          
          const progress = calculateProgress(goal);
          const isComplete = progress >= 100;
          
          return (
            <Card key={goal.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteGoal(goal.id)}
                    disabled={deletingId === goal.id}
                  >
                    {deletingId === goal.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso:</span>
                    <span className={isComplete ? 'text-green-600 font-medium' : 'font-medium'}>
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  
                  <Progress value={progress} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Atual:</span>
                    <span className="font-medium">R$ {goal.current.toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Meta:</span>
                    <span className="font-medium">R$ {goal.target.toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <span>
                      {goal.start_date && goal.end_date ? (
                        <>
                          Período: {format(new Date(goal.startDate), "dd/MM/yyyy")} - 
                          {format(new Date(goal.endDate), "dd/MM/yyyy")}
                        </>
                      ) : (
                        'Período não definido'
                      )}
                    </span>
                  </div>
                  
                  <div className="pt-2 flex items-center">
                    {isComplete ? (
                      <div className="text-green-600 text-sm font-medium flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Meta alcançada!
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Faltam R$ {(goal.target - goal.current).toFixed(2).replace('.', ',')}
                      </div>
                    )}
                  </div>

                  {/* Ações da meta */}
                  <div className="flex gap-2 mt-4 justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditGoal(goal)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDeposit(goal)}
                    >
                      <ArrowUp className="h-4 w-4 mr-1" />
                      Depositar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleWithdrawal(goal)}
                      disabled={goal.current <= 0}
                    >
                      <ArrowDown className="h-4 w-4 mr-1" />
                      Sacar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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

export default GoalsList;
