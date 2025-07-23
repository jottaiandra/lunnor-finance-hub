import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Clock, Crown, Heart } from 'lucide-react';

const FinalCTA: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-beauty-pink-dark to-black py-20 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-golden/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-beauty-pink/30 rounded-full blur-xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <Crown className="h-16 w-16 text-golden mx-auto mb-6" />
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            O seu esforço merece <span className="text-golden">recompensa.</span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            Não deixe para amanhã: invista em você, na sua paz e na sua 
            <strong className="text-golden"> liberdade financeira!</strong>
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl mb-12 border border-white/20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-golden" />
              <h3 className="text-2xl font-bold">Garantia Incondicional</h3>
            </div>
            
            <p className="text-lg mb-4">
              <strong className="text-golden">7 dias</strong> para testar tudo sem risco.
            </p>
            <p className="opacity-80">
              Se não se sentir preparada para dar o próximo passo, 
              devolvemos seu dinheiro. Sem perguntas, sem burocracia.
            </p>
          </div>
          
          <div className="mb-12">
            <Button 
              onClick={() => window.open('#checkout', '_blank')}
              size="lg"
              className="bg-golden hover:bg-golden-dark text-black font-bold px-12 py-6 text-2xl shadow-2xl hover:scale-105 transition-all duration-300 mb-4"
            >
              Quero comprar agora 💸
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-sm opacity-80 mt-4">
              <Clock className="h-4 w-4" />
              <span>Acesso imediato após a compra</span>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img 
                src="https://images.unsplash.com/photo-1580894908361-967195033215?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80" 
                alt="Mirelly Oliveira" 
                className="w-16 h-16 rounded-full border-3 border-golden object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80";
                }}
              />
              <div className="text-left">
                <h4 className="text-xl font-bold text-golden">Mirelly Oliveira</h4>
                <p className="opacity-80">Fundadora Meu Financeiro Boss</p>
              </div>
            </div>
            
            <div className="bg-beauty-pink/20 p-6 rounded-xl max-w-2xl mx-auto">
              <Heart className="h-6 w-6 text-golden mx-auto mb-3" />
              <p className="italic text-lg">
                "Criei esta plataforma porque acredito que toda mulher merece ter controle 
                sobre seu dinheiro e conquistar a vida dos seus sonhos. Você não está sozinha nessa jornada!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalCTA;