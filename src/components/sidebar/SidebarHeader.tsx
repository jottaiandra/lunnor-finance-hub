
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div className="flex items-center justify-between p-4">
      {!isCollapsed && <h1 className="font-bold text-xl text-primary">Lunnor Caixa</h1>}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="ml-auto text-primary"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </Button>
    </div>
  );
};

export default SidebarHeader;
