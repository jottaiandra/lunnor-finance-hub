
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChartPie, CircleDollarSign, FileText, Flag, Home, LogOut, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  const navItems = [
    { title: 'Dashboard', icon: <Home size={20} />, href: '/' },
    { title: 'Transações', icon: <CircleDollarSign size={20} />, href: '/transactions' },
    { title: 'Relatórios', icon: <ChartPie size={20} />, href: '/reports' },
    { title: 'Metas', icon: <Flag size={20} />, href: '/goals' },
    { title: 'Exportar', icon: <FileText size={20} />, href: '/export' },
  ];

  const handleSignOut = () => {
    signOut();
  };

  if (isMobile && isCollapsed) {
    return null;
  }

  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : 'UN';

  return (
    <div className={cn(
      'h-screen transition-all duration-300 bg-white border-r flex flex-col shadow-sm',
      isCollapsed ? 'w-[70px]' : 'w-[240px]'
    )}>
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h1 className="font-bold text-xl text-primary">Lunnor Caixa</h1>}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="ml-auto"
        >
          {isCollapsed ? "➡️" : "⬅️"}
        </Button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                to={item.href}
                className={cn(
                  "flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors",
                  location.pathname === item.href && "bg-primary/10 text-primary font-medium"
                )}
              >
                {item.icon}
                {!isCollapsed && <span className="ml-3">{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.email}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 p-0 h-auto text-xs hover:text-red-600 hover:bg-transparent"
                  onClick={handleSignOut}
                >
                  Sair da conta
                </Button>
              </div>
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500" 
                    onClick={handleSignOut}
                  >
                    <LogOut size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sair da conta</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
