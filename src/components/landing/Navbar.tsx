
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomization } from '@/contexts/CustomizationContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useCustomization();
  
  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">{settings.platformName}</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="/">Início</NavLink>
          <NavLink href="/sobre">Sobre</NavLink>
          <NavLink href="/contato">Contato</NavLink>
          {user ? (
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="bg-primary hover:bg-primary/90 text-white font-medium"
            >
              Dashboard
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/auth')} 
              className="bg-primary hover:bg-primary/90 text-white font-medium"
            >
              Entrar
            </Button>
          )}
        </nav>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          {user ? (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="bg-primary hover:bg-primary/90 text-white font-medium ml-2"
            >
              Dashboard
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="bg-primary hover:bg-primary/90 text-white font-medium ml-2"
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className }) => {
  return (
    <Link
      to={href}
      className={cn(
        "text-gray-700 hover:text-primary transition-colors font-medium",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default Navbar;
