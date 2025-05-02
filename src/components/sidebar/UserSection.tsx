
import React from 'react';
import { LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';

interface UserSectionProps {
  isCollapsed: boolean;
  profileImage: string | null;
  userInitials: string;
  handleSignOut: () => void;
}

const UserSection: React.FC<UserSectionProps> = ({ 
  isCollapsed, 
  profileImage, 
  userInitials, 
  handleSignOut 
}) => {
  const { user } = useAuth();

  if (!isCollapsed) {
    return (
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
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-10 w-10">
              {profileImage ? (
                <AvatarImage src={profileImage} alt="Foto de perfil" />
              ) : (
                <AvatarFallback className="bg-primary text-white">
                  {userInitials}
                </AvatarFallback>
              )}
            </Avatar>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-500" 
              onClick={handleSignOut}
            >
              <LogOut size={20} />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">Sair da conta</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserSection;
