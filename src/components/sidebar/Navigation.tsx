
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavItem } from './types';

interface NavigationProps {
  navItems: NavItem[];
  isCollapsed: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ navItems, isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link 
                to={item.href}
                onClick={(e) => handleNavigation(e, item.href)}
                className={cn(
                  "flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors",
                  location.pathname === item.href && "bg-primary/10 text-primary font-medium"
                )}
              >
                <Icon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">{item.title}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
