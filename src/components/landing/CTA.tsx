
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CTA: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-primary py-20">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Pronto para transformar suas finanças?</h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
          Junte-se a milhares de empresas que já utilizam o Lunnor Caixa para 
          simplificar sua gestão financeira e alcançar melhores resultados.
        </p>
        <Button 
          onClick={() => navigate('/auth')} 
          size="lg"
          className="bg-white text-primary hover:bg-white/90 font-medium px-8"
        >
          Começar gratuitamente
        </Button>
        <p className="text-white/70 text-sm mt-4">
          Sem necessidade de cartão de crédito • Acesso imediato
        </p>
      </div>
    </div>
  );
};

export default CTA;
