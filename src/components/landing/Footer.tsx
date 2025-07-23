
import React from 'react';
import { Crown, Shield, Mail, Phone, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-golden" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-beauty-pink to-golden bg-clip-text text-transparent">
                Meu Financeiro Boss
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transformando a vida financeira de mulheres empreendedoras da beleza. 
              Criado com amor por Mirelly Oliveira para você conquistar sua liberdade financeira.
            </p>
            <div className="flex items-center gap-2 text-golden">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">100% Seguro e Confiável</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-golden">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-beauty-pink" />
                <a href="mailto:contato@meufinanceiroboss.com.br" className="text-gray-300 hover:text-white transition-colors">
                  contato@meufinanceiroboss.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-beauty-pink" />
                <a href="tel:+551199999999" className="text-gray-300 hover:text-white transition-colors">
                  (11) 9 9999-9999
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-beauty-pink" />
                <a href="https://instagram.com/meufinanceiroboss" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  @meufinanceiroboss
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-golden">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Política de Reembolso</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © {currentYear} Meu Financeiro Boss. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                🔒 SSL Certificado
              </div>
              <div className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                ✅ Pagamento Seguro
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              Desenvolvido especialmente para mulheres empreendedoras da beleza que querem 
              transformar seu esforço em riqueza de verdade. 💎
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
