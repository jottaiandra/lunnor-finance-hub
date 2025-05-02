
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarHeader from './SidebarHeader';
import Navigation from './Navigation';
import UserSection from './UserSection';
import { useSidebarData } from './useSidebarData';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const isMobile = useIsMobile();
  const { profileImage, userInitials, navItems, handleSignOut } = useSidebarData();

  if (isMobile && isCollapsed) {
    return null;
  }

  return (
    <div className={cn(
      'h-screen transition-all duration-300 bg-white border-r flex flex-col shadow-sm',
      isCollapsed ? 'w-[70px]' : 'w-[240px]'
    )}>
      <SidebarHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <Navigation navItems={navItems} isCollapsed={isCollapsed} />
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <UserSection 
            isCollapsed={isCollapsed}
            profileImage={profileImage}
            userInitials={userInitials}
            handleSignOut={handleSignOut}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
