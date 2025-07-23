
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, DollarSign } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-md border-b border-beauty-pink/20 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="h-8 w-8 text-beauty-pink" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-beauty-pink to-golden bg-clip-text text-transparent">
            Meu Financeiro Boss
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <div className="flex gap-3">
            <Button 
              onClick={() => window.open('#checkout', '_blank')}
              size="lg"
              className="bg-beauty-pink hover:bg-beauty-pink-dark text-white font-bold px-6 shadow-lg"
            >
              Quero comprar agora 💸
              <DollarSign className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate('/auth')} 
              variant="outline"
              size="lg"
              className="border-beauty-pink text-beauty-pink hover:bg-beauty-pink hover:text-white font-medium"
            >
              Entrar
            </Button>
          </div>
        </nav>
        
        {/* Mobile menu */}
        <div className="md:hidden flex gap-2">
          <Button 
            onClick={() => window.open('#checkout', '_blank')}
            size="sm"
            className="bg-beauty-pink hover:bg-beauty-pink-dark text-white font-bold"
          >
            Comprar 💸
          </Button>
          <Button 
            onClick={() => navigate('/auth')} 
            variant="outline"
            size="sm"
            className="border-beauty-pink text-beauty-pink hover:bg-beauty-pink hover:text-white"
          >
            Entrar
          </Button>
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
