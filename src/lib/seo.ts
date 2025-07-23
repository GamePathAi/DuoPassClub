// Configurações de SEO para DuoPass

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  siteName?: string;
}

// Configurações padrão de SEO
export const defaultSEOConfig: SEOConfig = {
  title: 'DuoPass - Ofertas Exclusivas na Suíça',
  description: 'Descubra ofertas exclusivas e experiências únicas na Suíça com DuoPass. Restaurantes, atividades, hospedagem e muito mais com descontos especiais.',
  keywords: [
    'ofertas suíça',
    'descontos suíça',
    'restaurantes suíça',
    'atividades suíça',
    'turismo suíça',
    'experiências suíça',
    'cupons desconto',
    'duopass'
  ],
  image: '/images/og-image.jpg',
  url: 'https://duopassclub.ch',
  type: 'website',
  locale: 'pt_BR',
  siteName: 'DuoPass'
};

// Configurações específicas por página
export const pageConfigs: Record<string, Partial<SEOConfig>> = {
  '/': {
    title: 'DuoPass - Ofertas Exclusivas na Suíça',
    description: 'Descubra ofertas exclusivas e experiências únicas na Suíça com DuoPass. Restaurantes, atividades, hospedagem e muito mais.',
    keywords: ['ofertas suíça', 'descontos suíça', 'duopass', 'turismo suíça']
  },
  '/ofertas': {
    title: 'Ofertas Exclusivas - DuoPass',
    description: 'Explore todas as ofertas disponíveis no DuoPass. Restaurantes, atividades, hospedagem e experiências únicas na Suíça.',
    keywords: ['ofertas', 'descontos', 'restaurantes', 'atividades', 'suíça']
  },
  '/auth/signup': {
    title: 'Criar Conta - DuoPass',
    description: 'Crie sua conta no DuoPass e tenha acesso a ofertas exclusivas na Suíça. Cadastro rápido e seguro.',
    keywords: ['cadastro', 'criar conta', 'registro', 'duopass']
  },
  '/auth/signin': {
    title: 'Entrar - DuoPass',
    description: 'Faça login na sua conta DuoPass e acesse ofertas exclusivas na Suíça.',
    keywords: ['login', 'entrar', 'acesso', 'duopass']
  },
  '/dashboard': {
    title: 'Painel - DuoPass',
    description: 'Gerencie suas ofertas, perfil e assinatura no painel do DuoPass.',
    keywords: ['painel', 'dashboard', 'gerenciar', 'perfil']
  },
  '/pricing': {
    title: 'Planos e Preços - DuoPass',
    description: 'Conheça os planos do DuoPass e escolha o melhor para você. Acesso a ofertas exclusivas na Suíça.',
    keywords: ['planos', 'preços', 'assinatura', 'premium', 'duopass']
  }
};

// Função para atualizar meta tags
export const updateMetaTags = (config: Partial<SEOConfig>) => {
  const finalConfig = { ...defaultSEOConfig, ...config };
  
  // Title
  document.title = finalConfig.title;
  
  // Meta description
  updateMetaTag('description', finalConfig.description);
  
  // Meta keywords
  if (finalConfig.keywords) {
    updateMetaTag('keywords', finalConfig.keywords.join(', '));
  }
  
  // Open Graph tags
  updateMetaTag('og:title', finalConfig.title, 'property');
  updateMetaTag('og:description', finalConfig.description, 'property');
  updateMetaTag('og:type', finalConfig.type || 'website', 'property');
  updateMetaTag('og:url', finalConfig.url || window.location.href, 'property');
  updateMetaTag('og:site_name', finalConfig.siteName || 'DuoPass', 'property');
  updateMetaTag('og:locale', finalConfig.locale || 'pt_BR', 'property');
  
  if (finalConfig.image) {
    updateMetaTag('og:image', finalConfig.image, 'property');
    updateMetaTag('og:image:alt', finalConfig.title, 'property');
  }
  
  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', finalConfig.title);
  updateMetaTag('twitter:description', finalConfig.description);
  
  if (finalConfig.image) {
    updateMetaTag('twitter:image', finalConfig.image);
  }
  
  // Article tags (se aplicável)
  if (finalConfig.type === 'article') {
    if (finalConfig.author) {
      updateMetaTag('article:author', finalConfig.author, 'property');
    }
    if (finalConfig.publishedTime) {
      updateMetaTag('article:published_time', finalConfig.publishedTime, 'property');
    }
    if (finalConfig.modifiedTime) {
      updateMetaTag('article:modified_time', finalConfig.modifiedTime, 'property');
    }
  }
  
  // Canonical URL
  updateCanonicalUrl(finalConfig.url || window.location.href);
};

// Função auxiliar para atualizar meta tags
const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.content = content;
};

// Função para atualizar URL canônica
const updateCanonicalUrl = (url: string) => {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  
  element.href = url;
};

// Structured Data (JSON-LD)
export const generateStructuredData = (type: 'Organization' | 'WebSite' | 'Offer' | 'Product', data: Record<string, unknown>) => {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type
  };
  
  let structuredData;
  
  switch (type) {
    case 'Organization':
      structuredData = {
        ...baseStructure,
        name: 'DuoPass',
        url: 'https://duopassclub.ch',
        logo: 'https://duopassclub.ch/duopass_logo.svg',
        description: 'Ofertas exclusivas e experiências únicas na Suíça',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'CH'
        },
        sameAs: [
          'https://facebook.com/duopass',
          'https://instagram.com/duopass',
          'https://linkedin.com/company/duopass'
        ],
        ...data
      };
      break;
      
    case 'WebSite':
      structuredData = {
        ...baseStructure,
        name: 'DuoPass',
        url: 'https://duopassclub.ch',
        description: 'Ofertas exclusivas e experiências únicas na Suíça',
        publisher: {
          '@type': 'Organization',
          name: 'DuoPass'
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://duopassclub.ch/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        },
        ...data
      };
      break;
      
    case 'Offer':
      structuredData = {
        ...baseStructure,
        name: data.name,
        description: data.description,
        price: data.price,
        priceCurrency: 'CHF',
        availability: 'https://schema.org/InStock',
        validFrom: data.validFrom,
        validThrough: data.validThrough,
        seller: {
          '@type': 'Organization',
          name: 'DuoPass'
        },
        ...data
      };
      break;
      
    default:
      structuredData = { ...baseStructure, ...data };
  }
  
  return structuredData;
};

// Função para inserir structured data
export const insertStructuredData = (structuredData: Record<string, unknown>) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};

// Hook para React Router
export const useSEO = () => {
  const updateSEO = (path: string, customConfig?: Partial<SEOConfig>) => {
    const pageConfig = pageConfigs[path] || {};
    const finalConfig = { ...pageConfig, ...customConfig };
    updateMetaTags(finalConfig);
  };
  
  return { updateSEO };
};

// Sitemap generator (para build time)
export const generateSitemap = () => {
  const baseUrl = 'https://duopassclub.ch';
  const pages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/ofertas', priority: 0.9, changefreq: 'daily' },
    { url: '/pricing', priority: 0.8, changefreq: 'weekly' },
    { url: '/auth/signup', priority: 0.7, changefreq: 'monthly' },
    { url: '/auth/signin', priority: 0.7, changefreq: 'monthly' },
    { url: '/about', priority: 0.6, changefreq: 'monthly' },
    { url: '/contact', priority: 0.6, changefreq: 'monthly' },
    { url: '/privacy', priority: 0.5, changefreq: 'yearly' },
    { url: '/terms', priority: 0.5, changefreq: 'yearly' }
  ];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n')}
</urlset>`;
  
  return sitemap;
};

// Robots.txt generator
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

Sitemap: https://duopassclub.ch/sitemap.xml`;
};

// Inicialização do SEO
export const initializeSEO = () => {
  // Inserir structured data da organização
  const organizationData = generateStructuredData('Organization', {});
  insertStructuredData(organizationData);
  
  // Inserir structured data do website
  const websiteData = generateStructuredData('WebSite', {});
  insertStructuredData(websiteData);
  
  // Configurar meta tags padrão
  updateMetaTags(defaultSEOConfig);
  
  console.log('[SEO] Configurações inicializadas');
};