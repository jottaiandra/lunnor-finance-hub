
import React from 'react';
import { BellRing } from 'lucide-react';
import AlertsNotifications from '@/components/AlertsNotifications';

const DashboardAlerts: React.FC = () => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
        <BellRing className="h-5 w-5 text-yellow-500" />
        Alertas e notificações
      </h2>
      <AlertsNotifications />
    </div>
  );
};

export default DashboardAlerts;
