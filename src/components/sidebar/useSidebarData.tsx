
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Home, Receipt, BarChart3, Target, FileDown, Shield, UserCircle, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NavItem } from './types';

export const useSidebarData = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string>('');

  useEffect(() => {
    if (user) {
      const fetchProfileData = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, profile_image_url')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          if (data) {
            if (data.profile_image_url) {
              setProfileImage(data.profile_image_url);
            }

            let initials = '';
            if (data.first_name) {
              initials += data.first_name[0].toUpperCase();
            }
            if (data.last_name) {
              initials += data.last_name[0].toUpperCase();
            }

            if (initials) {
              setUserInitials(initials);
            } else if (user.email) {
              setUserInitials(user.email[0].toUpperCase());
            }
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
          if (user.email) {
            setUserInitials(user.email[0].toUpperCase());
          }
        }
      };

      fetchProfileData();
    }
  }, [user]);

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/app',
      icon: <Home className="h-5 w-5" />
    },
    {
      title: 'Transações',
      href: '/app/transactions',
      icon: <Receipt className="h-5 w-5" />
    },
    {
      title: 'Relatórios',
      href: '/app/reports',
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      title: 'Metas',
      href: '/app/goals',
      icon: <Target className="h-5 w-5" />
    },
    {
      title: 'Exportar Dados',
      href: '/app/export',
      icon: <FileDown className="h-5 w-5" />
    },
    {
      title: 'WhatsApp',
      href: '/app/whatsapp',
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      title: 'Perfil',
      href: '/app/profile',
      icon: <UserCircle className="h-5 w-5" />
    }
  ];

  // Only show admin link if user has admin role
  if (user) {
    navItems.push({
      title: 'Admin',
      href: '/app/admin',
      icon: <Shield className="h-5 w-5" />
    });
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return {
    navItems,
    profileImage,
    userInitials,
    handleSignOut
  };
};
