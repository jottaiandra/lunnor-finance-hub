
import React, { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import GoalsList from '@/components/GoalsList';
import GoalForm from '@/components/GoalForm';
import { useFinance } from '@/contexts/FinanceContext';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const GoalsPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { state, fetchGoals } = useFinance();

  // Simplified fetch data function
  const loadData = useCallback(async () => {
    if (state.loading.goals) return; // Prevent duplicate calls if already loading
    
    try {
      setIsLoading(true);
      setLoadError(null);
      await fetchGoals();
    } catch (error) {
      console.error("Erro ao carregar metas:", error);
      setLoadError("Não foi possível carregar as metas. Por favor, tente novamente.");
      toast.error("Erro ao carregar metas");
    } finally {
      setIsLoading(false);
    }
  }, [fetchGoals, state.loading.goals]);

  useEffect(() => {
    loadData();
    
    // Cleanup function
    return () => {
      // Nothing to cleanup
    };
  }, [loadData]); // Only depend on the memoized function

  const handleFormSuccess = () => {
    setDialogOpen(false);
    // Refresh goals list after adding a new goal
    loadData();
  };

  // Show loading state only during initial load
  if (isLoading && !state.goals.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show error state if there's a loading error
  if (loadError) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">{loadError}</p>
        <Button onClick={() => loadData()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas Financeiras</h1>
          <p className="text-muted-foreground">Acompanhe seu progresso em direção às suas metas.</p>
        </div>
        
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

      <GoalsList />
    </div>
  );
};

export default GoalsPage;
