
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CircleDollarSign } from 'lucide-react';

const SobrePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Menu de navegação */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <CircleDollarSign className="h-8 w-8 text-primary" />
              <Link to="/" className="ml-2 text-2xl font-bold text-primary">Lunnor Caixa</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
                Início
              </Link>
              <Link to="/sobre" className="text-primary font-medium transition-colors">
                Sobre
              </Link>
              <Link to="/contato" className="text-gray-700 hover:text-primary transition-colors">
                Contato
              </Link>
              <Link to="/auth">
                <Button>Entrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Sobre o Lunnor Caixa</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conheça nossa história, missão e valores que nos impulsionam a criar a melhor solução de gestão financeira.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Nossa história</h2>
            <p className="text-gray-700 mb-4">
              O Lunnor Caixa nasceu em 2023 da necessidade de simplificar o controle financeiro para pequenos empreendedores e profissionais autônomos.
              Percebemos que muitas das soluções disponíveis eram complexas demais ou não atendiam às necessidades específicas desse público.
            </p>
            <p className="text-gray-700">
              Depois de meses de pesquisa e desenvolvimento, lançamos nossa plataforma com o objetivo de democratizar o acesso a ferramentas 
              financeiras eficientes e intuitivas, permitindo que nossos usuários tomem decisões mais acertadas sobre seus negócios.
            </p>
          </div>
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/8f1d9d45-930f-451d-83fb-88fe97ea42e9.png" 
              alt="Fundadores do Lunnor Caixa" 
              className="rounded-lg shadow-md object-cover max-h-96" 
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Nossa missão</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Capacitar indivíduos e empresas a alcançarem independência e crescimento financeiro através de ferramentas 
              simples, eficientes e acessíveis para controle e planejamento financeiro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-primary">Visão</h3>
              <p className="text-gray-700">
                Ser a plataforma de gestão financeira mais confiável e utilizada por empreendedores e pequenas empresas no Brasil.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-primary">Valores</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Transparência</li>
                <li>Simplicidade</li>
                <li>Inovação</li>
                <li>Compromisso com resultados</li>
                <li>Foco no cliente</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-primary">Diferenciais</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Interface intuitiva</li>
                <li>Suporte personalizado</li>
                <li>Recursos focados no usuário</li>
                <li>Segurança de dados</li>
                <li>Atualização constante</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Nossa equipe</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-12">
            Contamos com uma equipe diversificada de profissionais apaixonados por tecnologia e finanças, 
            comprometidos em oferecer a melhor experiência para nossos usuários.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <img 
                    src="/placeholder.svg" 
                    alt={`Membro da equipe ${index + 1}`}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">Nome do Colaborador</h3>
                  <p className="text-gray-600 text-sm">Cargo / Função</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SobrePage;
