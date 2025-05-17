
import React from 'react';
import { BellRing } from 'lucide-react';
import AlertsNotifications from '@/components/AlertsNotifications';

const DashboardAlerts: React.FC = () => {
  return (
    <div className="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
        <div className="bg-yellow-100 p-1.5 rounded-lg">
          <BellRing className="h-5 w-5 text-yellow-500" />
        </div>
        <span>Alertas e notificações</span>
      </h2>
      <AlertsNotifications />
    </div>
  );
};

export default DashboardAlerts;
