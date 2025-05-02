
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChartPie, CircleDollarSign, FileText, Flag, Home, LogOut, Users, ChevronLeft, ChevronRight, UserCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [navItems, setNavItems] = useState([
    { title: 'Dashboard', icon: <Home size={20} />, href: '/app' },
    { title: 'Transações', icon: <CircleDollarSign size={20} />, href: '/app/transactions' },
    { title: 'Relatórios', icon: <ChartPie size={20} />, href: '/app/reports' },
    { title: 'Metas', icon: <Flag size={20} />, href: '/app/goals' },
    { title: 'Exportar', icon: <FileText size={20} />, href: '/app/export' },
    { title: 'Perfil', icon: <UserCircle size={20} />, href: '/app/profile' },
  ]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
        if (error) {
          console.error('Erro ao verificar status de admin:', error);
          return;
        }
        
        const isUserAdmin = data || false;
        setIsAdmin(isUserAdmin);
        
        // Atualizar os itens de navegação se for admin
        if (isUserAdmin && !navItems.some(item => item.title === 'Administração')) {
          setNavItems(prev => [
            ...prev,
            { title: 'Administração', icon: <Users size={20} />, href: '/app/admin' }
          ]);
        }
      } catch (error) {
        console.error('Erro ao verificar status de admin:', error);
      }
    };
    
    const fetchProfileImage = async () => {
      if (!user) return;
      
      try {
        // Verificando se o perfil existe antes de buscar a imagem
        const { data, error } = await supabase
          .from('profiles')
          .select('profile_image_url')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Erro ao buscar imagem de perfil:', error);
          return;
        }
        
        // Verificar se o data existe e tem a propriedade profile_image_url
        if (data && 'profile_image_url' in data && data.profile_image_url) {
          setProfileImage(data.profile_image_url);
        }
      } catch (error) {
        console.error('Erro ao buscar imagem de perfil:', error);
      }
    };
    
    if (user) {
      checkAdminStatus();
      fetchProfileImage();
    }
  }, [user?.id]);

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
          className="ml-auto text-primary"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
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
                {profileImage ? (
                  <AvatarImage src={profileImage} alt="Foto de perfil" />
                ) : (
                  <AvatarFallback className="bg-primary text-white">
                    {userInitials}
                  </AvatarFallback>
                )}
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
