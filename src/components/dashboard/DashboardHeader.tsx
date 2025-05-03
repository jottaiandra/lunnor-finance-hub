
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AlertSettings from '@/components/AlertSettings';
import { Target } from 'lucide-react';

interface DashboardHeaderProps {
  showAlertSettings: boolean;
  setShowAlertSettings: (show: boolean) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  showAlertSettings, 
  setShowAlertSettings 
}) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Confira o resumo das suas finanças.</p>
      </div>
      <div className="flex items-center gap-2">
        <Dialog open={showAlertSettings} onOpenChange={setShowAlertSettings}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Configurar alertas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <AlertSettings />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DashboardHeader;
