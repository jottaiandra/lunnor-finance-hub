
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative bg-gradient-to-b from-white to-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-2xl mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Gestão financeira <br />
            <span className="text-primary">simplificada e eficiente</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Transforme a maneira como você controla suas finanças. Com o Lunnor Caixa, 
            você tem acesso a ferramentas poderosas para gerenciar transações, 
            acompanhar metas e gerar relatórios detalhados em um só lugar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg"
              className="text-white bg-primary hover:bg-primary/90 font-medium px-8"
            >
              Começar agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => navigate('/sobre')} 
              variant="outline" 
              size="lg"
              className="font-medium"
            >
              Saiba mais
            </Button>
          </div>
        </div>
        
        <div className="relative w-full md:w-1/2 lg:w-5/12">
          <div className="bg-white p-2 rounded-xl shadow-xl">
            <img 
              src="/assets/finance-dashboard.jpg" 
              alt="Lunnor Caixa Dashboard" 
              className="rounded-lg w-full h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.11&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max";
              }}
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-full opacity-20 blur-xl"></div>
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
