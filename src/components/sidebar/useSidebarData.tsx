
import { useState, useEffect } from 'react';
import { ChartPie, CircleDollarSign, FileText, Flag, Home, Users, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { NavItem } from './types';

export const useSidebarData = () => {
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState('UN');
  const [navItems, setNavItems] = useState<NavItem[]>([
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
        
        // Update navigation items if admin
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
        // Check if profile exists before fetching the image
        const { data, error } = await supabase
          .from('profiles')
          .select('profile_image_url, first_name, last_name, email')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Erro ao buscar imagem de perfil:', error);
          return;
        }
        
        // Check if data exists and has the profile_image_url property
        if (data) {
          if (data.profile_image_url) {
            setProfileImage(data.profile_image_url);
          } else {
            setProfileImage(null);
          }
          
          // Set initials based on name or email
          if (data.first_name && data.last_name) {
            setUserInitials(`${data.first_name.charAt(0)}${data.last_name.charAt(0)}`);
          } else if (data.first_name) {
            setUserInitials(data.first_name.substring(0, 2).toUpperCase());
          } else if (user.email) {
            setUserInitials(user.email.substring(0, 2).toUpperCase());
          }
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

  // Set up a subscription to profile changes to update the image in real-time
  useEffect(() => {
    if (!user) return;
    
    const profileChanges = supabase
      .channel('profile-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${user.id}`
        }, 
        (payload) => {
          if (payload.new && 'profile_image_url' in payload.new) {
            setProfileImage(payload.new.profile_image_url as string);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(profileChanges);
    };
  }, [user?.id]);

  const handleSignOut = () => {
    signOut();
  };

  return {
    isAdmin,
    profileImage,
    userInitials,
    navItems,
    handleSignOut
  };
};
