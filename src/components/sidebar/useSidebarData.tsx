
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Plus
} from "lucide-react";
import { useProfiles } from "@/hooks/useProfiles";
import { NavItem } from "./types";

export const useSidebarData = () => {
  const { user, signOut } = useAuth();
  const { currentProfile, isAdmin } = useProfiles();
  
  // Navegação principal
  const mainNav: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Transações",
      href: "/dashboard/transactions",
      icon: FileText,
    },
    {
      title: "Relatórios",
      href: "/dashboard/reports",
      icon: FileText,
    },
    {
      title: "Metas",
      href: "/dashboard/goals",
      icon: FileText,
    },
  ];

  // Navegação de configurações
  const settingsNav: NavItem[] = [
    {
      title: "Perfil",
      href: "/dashboard/profile",
      icon: Settings,
    },
    {
      title: "Exportar Dados",
      href: "/dashboard/export",
      icon: Plus,
    }
  ];

  // Adicionar página de admin apenas para administradores
  if (isAdmin) {
    settingsNav.push({
      title: "Administração",
      href: "/dashboard/admin",
      icon: Settings
    });
  }
  
  // Determine user initials from email
  const userEmail = user?.email || '';
  const userInitials = userEmail.charAt(0).toUpperCase();
  
  // Get profile image if available
  const profileImage = currentProfile?.avatar_url || null;
  
  // Combine navigation items
  const navItems = [...mainNav, ...settingsNav];
  
  // Handle sign out
  const handleSignOut = () => {
    if (signOut) signOut();
  };

  return {
    mainNav,
    settingsNav,
    navItems,
    profileImage,
    userInitials,
    handleSignOut
  };
};
