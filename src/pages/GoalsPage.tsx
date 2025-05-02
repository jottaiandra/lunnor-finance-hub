
import React, { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import GoalsList from '@/components/GoalsList';
import GoalForm from '@/components/GoalForm';
import { useFinance } from '@/contexts/FinanceContext';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const GoalsPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { state, fetchGoals } = useFinance();
  
  // Load goals when the component mounts
  useEffect(() => {
    console.log("GoalsPage mounted, fetching goals...");
    fetchGoals().catch(error => {
      console.error("Error in initial goals fetch:", error);
      toast.error("Erro ao carregar metas. Por favor, tente novamente.");
    });
  }, [fetchGoals]);

  const handleRefresh = () => {
    toast.info("Recarregando metas...");
    fetchGoals().catch(error => {
      console.error("Error refreshing goals:", error);
      toast.error("Erro ao recarregar metas");
    });
  };

  const handleFormSuccess = () => {
    setDialogOpen(false);
    toast.success("Meta adicionada com sucesso!");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas Financeiras</h1>
          <p className="text-muted-foreground">Acompanhe seu progresso em direção às suas metas.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Nova Meta</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <GoalForm 
                onSuccess={handleFormSuccess} 
                onCancel={() => setDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pass the loading state directly to GoalsList */}
      <GoalsList />
      
      {/* Debug information */}
      <div className="text-xs text-muted-foreground mt-8">
        <p>Estado de carregamento: {state.loading.goals ? 'Carregando' : 'Pronto'}</p>
        <p>Metas carregadas: {state.goals.length}</p>
      </div>
    </div>
  );
};

export default GoalsPage;
