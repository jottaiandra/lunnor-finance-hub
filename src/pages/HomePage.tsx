
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CircleDollarSign, Users, FileText, ArrowRight, Mail } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Menu de navegação */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <CircleDollarSign className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold text-primary">Lunnor Caixa</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
                Início
              </Link>
              <Link to="/sobre" className="text-gray-700 hover:text-primary transition-colors">
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

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Controle suas</span>
                <span className="block text-primary">finanças com facilidade</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl">
                Lunnor Caixa é a solução completa para gerenciar suas finanças pessoais e empresariais.
                Acompanhe despesas, receitas, defina metas e muito mais.
              </p>
              <div className="mt-8 flex">
                <Link to="/auth">
                  <Button className="px-8 py-3 text-base">
                    Começar agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/assets/finance-dashboard.jpg" 
                className="w-full max-w-lg mx-auto rounded-lg shadow-xl" 
                alt="Dashboard financeiro" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
            Funcionalidades principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <CircleDollarSign className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Controle financeiro</h3>
                <p className="text-gray-600">
                  Acompanhe suas receitas e despesas com facilidade. Categorizações automáticas 
                  e relatórios detalhados.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Relatórios detalhados</h3>
                <p className="text-gray-600">
                  Visualize e exporte relatórios personalizados. Entenda para onde seu dinheiro está indo.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Multi-usuários</h3>
                <p className="text-gray-600">
                  Gerencie permissões e acesso para sua equipe completa. Ideal para pequenas empresas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já aproveitam os benefícios de um controle financeiro eficiente.
          </p>
          <Link to="/auth">
            <Button variant="secondary" size="lg" className="px-8">
              Criar uma conta gratuitamente
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Lunnor Caixa</h3>
              <p className="text-gray-400">
                A solução completa para controle financeiro pessoal e empresarial.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Links úteis</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Início</Link></li>
                <li><Link to="/sobre" className="text-gray-400 hover:text-white transition-colors">Sobre</Link></li>
                <li><Link to="/contato" className="text-gray-400 hover:text-white transition-colors">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contato</h3>
              <p className="text-gray-400 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                contato@lunnorcaixa.com
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Lunnor Caixa. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
