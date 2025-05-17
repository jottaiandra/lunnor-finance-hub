
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { FinanceProvider } from '@/contexts/FinanceContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useCustomization } from '@/contexts/CustomizationContext';
import { useAuth } from '@/contexts/AuthContext';

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { settings } = useCustomization();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Quick check to ensure user is authenticated
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Give components time to initialize and prevent flickering
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <FinanceProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <Sidebar isCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header with toggle button */}
          {isMobile && (
            <div className="bg-white p-4 border-b flex items-center">
              <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                {sidebarCollapsed ? "☰" : "✕"}
              </Button>
              <h1 className="ml-2 text-xl font-bold text-primary">{settings.platformName}</h1>
            </div>
          )}
          
          {/* Content area */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </FinanceProvider>
  );
};

export default Layout;
