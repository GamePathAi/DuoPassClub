import React, { createContext, useState, useContext } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.offers': 'Ofertas',
    'nav.history': 'Histórico',
    'nav.profile': 'Perfil',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Entrar',
    'nav.signup': 'Cadastrar',
    'nav.logout': 'Sair',

    // Home
    'home.title': 'Pague 1, Leve 2',
    'home.subtitle': 'Descubra ofertas incríveis na sua cidade',
    'home.cta': 'Explorar Ofertas',
    'home.categories': 'Categorias',

    // Categories
    'category.gastronomy': 'Gastronomia',
    'category.beauty': 'Beleza',
    'category.leisure': 'Lazer',
    'category.fitness': 'Fitness',
    'category.shopping': 'Compras',
    'category.services': 'Serviços',

    // Offers
    'offers.title': 'Ofertas Disponíveis',
    'offers.activate': 'Ativar Cupom',
    'offers.expires': 'Expira em',
    'offers.location': 'Localização',
    'offers.original_value': 'Valor Original',

    // Auth
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.fullname': 'Nome Completo',
    'auth.signin': 'Entrar',
    'auth.signup': 'Cadastrar',
    'auth.customer': 'Cliente',
    'auth.merchant': 'Comerciante',
    'auth.usertype': 'Tipo de Usuário',

    // Subscription
    'subscription.required': 'Assinatura Necessária',
    'subscription.message': 'Para ativar cupons, você precisa de uma assinatura ativa.',
    'subscription.subscribe': 'Assinar Agora',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.offers': 'Offers',
    'nav.history': 'History',
    'nav.profile': 'Profile',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',

    // Home
    'home.title': 'Pay 1, Get 2',
    'home.subtitle': 'Discover amazing offers in your city',
    'home.cta': 'Explore Offers',
    'home.categories': 'Categories',

    // Categories
    'category.gastronomy': 'Gastronomy',
    'category.beauty': 'Beauty',
    'category.leisure': 'Leisure',
    'category.fitness': 'Fitness',
    'category.shopping': 'Shopping',
    'category.services': 'Services',

    // Offers
    'offers.title': 'Available Offers',
    'offers.activate': 'Activate Coupon',
    'offers.expires': 'Expires',
    'offers.location': 'Location',
    'offers.original_value': 'Original Value',

    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullname': 'Full Name',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.customer': 'Customer',
    'auth.merchant': 'Merchant',
    'auth.usertype': 'User Type',

    // Subscription
    'subscription.required': 'Subscription Required',
    'subscription.message': 'To activate coupons, you need an active subscription.',
    'subscription.subscribe': 'Subscribe Now',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}