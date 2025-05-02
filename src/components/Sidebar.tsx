
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChartPie, CircleDollarSign, FileText, Flag, Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { title: 'Dashboard', icon: <Home size={20} />, href: '/' },
    { title: 'Transações', icon: <CircleDollarSign size={20} />, href: '/transactions' },
    { title: 'Relatórios', icon: <ChartPie size={20} />, href: '/reports' },
    { title: 'Metas', icon: <Flag size={20} />, href: '/goals' },
    { title: 'Exportar', icon: <FileText size={20} />, href: '/export' },
  ];

  if (isMobile && isCollapsed) {
    return null;
  }

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
        {!isCollapsed && (
          <div className="text-sm text-gray-500">
            <p className="font-medium">Lunnor Caixa</p>
            <p>v1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
