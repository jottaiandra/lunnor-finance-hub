
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { BellRing } from 'lucide-react';

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  icon?: React.ReactNode;
}

interface AlertItemProps {
  alert: AlertItem;
}

const AlertItemComponent: React.FC<AlertItemProps> = ({ alert }) => {
  return (
    <Alert 
      variant={alert.type === 'danger' ? 'destructive' : 'default'}
      className={`
        ${alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : ''} 
        ${alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : ''} 
        ${alert.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' : ''} 
      `}
    >
      <div className="flex items-center gap-2">
        {alert.icon || <BellRing className="h-4 w-4" />}
        <AlertTitle>{alert.title}</AlertTitle>
      </div>
      <AlertDescription>{alert.message}</AlertDescription>
    </Alert>
  );
};

export default AlertItemComponent;
