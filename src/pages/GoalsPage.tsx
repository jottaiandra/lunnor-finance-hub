
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import GoalsList from '@/components/GoalsList';
import GoalForm from '@/components/GoalForm';

const GoalsPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleFormSuccess = () => {
    setDialogOpen(false);
  };

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
