
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AlertSettings from '@/components/AlertSettings';
import { Bell, Target, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfiles } from '@/hooks/useProfiles';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  showAlertSettings: boolean;
  setShowAlertSettings: (show: boolean) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  showAlertSettings, 
  setShowAlertSettings 
}) => {
  const { user } = useAuth();
  const { currentProfile } = useProfiles();
  
  // Get user initials from email for avatar fallback
  const userEmail = user?.email || '';
  const userInitials = userEmail.charAt(0).toUpperCase();
  
  // Get profile image if available
  const profileImage = currentProfile?.avatar_url || null;
  
  return (
    <div className="mb-8 flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-muted-foreground">Confira o resumo das suas finanças.</p>
      </div>
      <div className="flex items-center gap-4">
        <Dialog open={showAlertSettings} onOpenChange={setShowAlertSettings}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="border border-primary/20 bg-white shadow-sm">
              <Bell className="h-4 w-4 mr-2 text-primary" />
              Configurar alertas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <AlertSettings />
          </DialogContent>
        </Dialog>
        
        <Link to="/dashboard/profile">
          <Avatar className="h-10 w-10 cursor-pointer hover:opacity-90 transition-opacity ring-2 ring-primary/20 ring-offset-2">
            {profileImage ? (
              <AvatarImage 
                src={profileImage} 
                className="object-cover"
                alt="Perfil do usuário" 
                onError={(e) => {
                  // Hide the broken image and show fallback
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <AvatarFallback className="bg-primary text-white">
                {userInitials}
              </AvatarFallback>
            )}
          </Avatar>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
