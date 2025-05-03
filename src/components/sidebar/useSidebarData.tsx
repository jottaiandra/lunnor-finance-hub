import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Plus, 
  LucideIcon,
  MessageCircle,
  TestTube
} from "lucide-react";
import { useProfiles } from "@/hooks/useProfiles";

interface NavigationLink {
  title: string;
  href: string;
  icon: LucideIcon;
  visible: boolean;
}

export const useSidebarData = () => {
  const { user } = useAuth();
  const { currentProfile } = useProfiles();
  const isAdmin = currentProfile?.role === 'admin';
  
  const ProtectedRoute = true;
  
  // Navegação principal
  const mainNav: NavigationLink[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      visible: ProtectedRoute
    },
    {
      title: "Transações",
      href: "/transactions",
      icon: FileText,
      visible: ProtectedRoute
    },
    {
      title: "Relatórios",
      href: "/reports",
      icon: FileText,
      visible: ProtectedRoute
    },
    {
      title: "Metas",
      href: "/goals",
      icon: FileText,
      visible: ProtectedRoute
    },
  ];

  // Navegação de configurações
  const settingsNav: NavigationLink[] = [
    {
      title: "Perfil",
      href: "/profile",
      icon: Settings,
      visible: ProtectedRoute
    },
    {
      title: "Exportar Dados",
      href: "/export",
      icon: Plus,
      visible: ProtectedRoute
    },
    {
      title: "Notificações WhatsApp",
      href: "/whatsapp",
      icon: <MessageCircle className="h-5 w-5" />,
      visible: true
    },
    {
      title: "Testes WhatsApp",
      href: "/whatsapp-test",
      icon: <TestTube className="h-5 w-5" />,
      visible: isAdmin // Opcional: limitar acesso a administradores
    },
  ];

  return {
    mainNav,
    settingsNav,
  };
};
