
import React from 'react';
import AlertItemComponent from './AlertItem';
import EmptyAlertsMessage from './EmptyAlertsMessage';
import { useAlertGenerator } from './useAlertGenerator';
import { useToast } from '@/hooks/use-toast';

const AlertsNotifications: React.FC = () => {
  const { alerts } = useAlertGenerator();
  const { toast } = useToast();

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <AlertItemComponent key={alert.id} alert={alert} />
      ))}
      {alerts.length === 0 && <EmptyAlertsMessage />}
    </div>
  );
};

export default AlertsNotifications;
