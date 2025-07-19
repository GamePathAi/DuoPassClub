import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">DUO PASS</span>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              Conectando pessoas através de experiências culturais autênticas na Suíça. 
              Sempre em dupla, sempre especial.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Zurich, Switzerland</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contato@duopassclub.ch</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+41 44 123 4567</span>
              </div>
            </div>
          </div>
          
          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/experiencias" className="text-gray-300 hover:text-green-400 transition-colors">
                  Experiências
                </Link>
              </li>
              <li>
                <Link to="/ofertas" className="text-gray-300 hover:text-green-400 transition-colors">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link to="/memberships" className="text-gray-300 hover:text-green-400 transition-colors">
                  Memberships
                </Link>
              </li>
              <li>
                <Link to="/parceiros-culturais" className="text-gray-300 hover:text-green-400 transition-colors">
                  Parceiros Culturais
                </Link>
              </li>
              <li>
                <Link to="/empresas" className="text-gray-300 hover:text-green-400 transition-colors">
                  Para Empresas
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Informações Legais */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações Legais</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/termos-de-uso" className="text-gray-300 hover:text-green-400 transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-gray-300 hover:text-green-400 transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/cancelamento" className="text-gray-300 hover:text-green-400 transition-colors">
                  Cancelamento e Reembolso
                </Link>
              </li>
              <li>
                <Link to="/experiencias-termos" className="text-gray-300 hover:text-green-400 transition-colors">
                  Termos de Experiências
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Linha de Separação */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} DUO PASS Club. Todos os direitos reservados.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>🇨🇭 Empresa Suíça</span>
              <span>•</span>
              <span>GDPR Compliant</span>
              <span>•</span>
              <span>SSL Seguro</span>
            </div>
          </div>
          
          {/* Aviso Legal */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>
              DUO PASS Club é uma plataforma cultural registrada na Suíça. 
              Todas as experiências estão sujeitas aos termos e condições dos estabelecimentos parceiros.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}