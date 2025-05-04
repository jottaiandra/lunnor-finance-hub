
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
      {!isCollapsed && (
        <div className="flex items-center gap-2">
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
            alt="Financial Dashboard" 
            className="w-6 h-6 object-cover rounded"
          />
          <h1 className="font-bold text-xl text-primary">Lunnor Caixa</h1>
        </div>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className={`${isCollapsed ? '' : 'ml-auto'} text-primary`}
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </Button>
    </div>
  );
};

export default SidebarHeader;
