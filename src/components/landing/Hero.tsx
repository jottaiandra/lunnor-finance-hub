
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, DollarSign } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative bg-gradient-to-br from-beauty-pink-light via-white to-beauty-gold-light pt-24 pb-20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-beauty-pink/20 rounded-full blur-xl"></div>
      <div className="absolute top-40 right-20 w-20 h-20 bg-golden/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-beauty-pink/15 rounded-full blur-lg"></div>
      
      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row items-center justify-between relative z-10">
        <div className="max-w-2xl mb-10 md:mb-0">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-beauty-pink" />
            <span className="text-beauty-pink font-semibold">Por Mirelly Oliveira</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Chega de ver seu <br />
            <span className="text-beauty-pink">dinheiro sumir!</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
            Transforme seu salão em uma máquina de lucro com o 
            <span className="text-golden font-bold"> Meu Financeiro Boss</span>
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Desenvolvido especialmente para mulheres da beleza que querem 
            controlar suas finanças, lucrar de verdade e conquistar sua liberdade financeira.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => window.open('#checkout', '_blank')} 
              size="lg"
              className="text-white bg-beauty-pink hover:bg-beauty-pink-dark font-bold px-8 py-4 text-lg shadow-lg"
            >
              Quero comprar agora 💸
              <DollarSign className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => navigate('/auth')} 
              variant="outline" 
              size="lg"
              className="font-medium border-beauty-pink text-beauty-pink hover:bg-beauty-pink hover:text-white"
            >
              Já tenho conta - Entrar
            </Button>
          </div>
          
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
            <Heart className="h-4 w-4 text-beauty-pink" />
            <span>Criado especialmente para mulheres empreendedoras da beleza</span>
          </div>
        </div>
        
        <div className="relative w-full md:w-1/2 lg:w-5/12">
          <div className="bg-white p-4 rounded-2xl shadow-2xl border border-beauty-pink/10">
            <img 
              src="https://images.unsplash.com/photo-1580894908361-967195033215?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Mulher empoderada - Mirelly Oliveira" 
              className="rounded-xl w-full h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
              }}
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-beauty-pink rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -top-6 -left-6 w-28 h-28 bg-golden rounded-full opacity-25 blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
