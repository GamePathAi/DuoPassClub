import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Users, Gift, Heart, Zap, Globe, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { CategoryGrid } from '../components/CategoryGrid';
import { CulturalExperiences } from '../components/CulturalExperiences';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F5F3EF]">
      <Helmet>
        <title>Duo Pass Club – Experiências Autênticas</title>
        <meta name="description" content="Uma plataforma cultural que conecta pessoas através de experiências genuínas. Não vendemos produtos, criamos memórias e fortalecemos comunidades." />
        <meta property="og:title" content="Duo Pass Club" />
        <meta property="og:description" content="Transforme momentos em memórias com experiências culturais únicas." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Duo Pass Club" />
        <meta name="twitter:description" content="Transforme momentos em memórias com experiências culturais únicas." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#F6C100] via-[#C91F1F] to-[#333333] text-white py-24">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Crown 
              className="w-24 h-24 md:w-32 md:h-32 text-yellow-400 drop-shadow-lg" 
              strokeWidth={1.5} 
              fill="currentColor" 
            />
          </motion.div>
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Duo Pass Club
          </motion.h1>
          <motion.p 
            className="text-2xl md:text-3xl mb-6 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Onde experiências autênticas ganham vida.
          </motion.p>
          <motion.p 
            className="text-xl md:text-2xl mb-12 text-yellow-100 max-w-4xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Uma plataforma cultural que conecta pessoas através de experiências genuínas. Não vendemos produtos, criamos memórias e fortalecemos comunidades.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              to="/ofertas"
              onClick={() => console.log('🔗 Clicou em Descobrir Experiências - Navegando para /ofertas')}
              className="inline-flex items-center bg-white text-[#C91F1F] px-10 py-5 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Descobrir Experiências
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
            <Link
              to="/como-funciona-parceiros"
              onClick={() => console.log('🔗 Clicou em Ser Parceiro Cultural - Navegando para /como-funciona-parceiros')}
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-white hover:text-[#C91F1F] transition-all"
            >
              Ser Parceiro Cultural
              <Heart className="ml-3 w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What is Duo Pass Club Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#F6C100] to-[#C91F1F] rounded-full mb-8">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-8">
            O que é o Duo Pass Club?
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Uma plataforma cultural que conecta pessoas através de experiências autênticas. Apoiamos negócios com alma, 
            promovemos conexões genuínas e fortalecemos a economia criativa local — transformando consumo em cultura viva.
          </p>
        </motion.div>
      </section>

      {/* For Who Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#C91F1F] to-[#F6C100] rounded-full mb-8">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-8">
              Para quem é?
            </h2>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Para quem quer fazer parte de algo maior:
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-center p-8 bg-[#F5F3EF] rounded-2xl border-2 border-[#F6C100] hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F6C100] to-[#C91F1F] rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#333333] mb-4">Parceiros Culturais</h3>
              <p className="text-gray-700 leading-relaxed">
                Cafés culturais, ateliês, restaurantes familiares e espaços que respiram autenticidade e propósito
              </p>
            </div>
            
            <div className="text-center p-8 bg-[#F5F3EF] rounded-2xl border-2 border-[#C91F1F] hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C91F1F] to-[#F6C100] rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#333333] mb-4">Artistas & Criativos</h3>
              <p className="text-gray-700 leading-relaxed">
                Artistas, criativos, coletivos que valorizam cultura e expressão autêntica
              </p>
            </div>
            
            <div className="text-center p-8 bg-[#F5F3EF] rounded-2xl border-2 border-[#333333] hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[#333333] to-[#F6C100] rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#333333] mb-4">Comunidade Consciente</h3>
              <p className="text-gray-700 leading-relaxed">
                Pessoas que buscam experiências com alma, valorizam conexões genuínas e apoiam a cultura local
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#C91F1F] to-[#333333] rounded-full mb-8">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-8">
            Por que entrar?
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-[#F6C100] hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-[#F6C100] rounded-lg flex items-center justify-center mb-6">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#333333] mb-3">Destaque como Parceiro Fundador</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Divulgue seu negócio com destaque especial na plataforma
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-[#C91F1F] hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-[#C91F1F] rounded-lg flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#333333] mb-3">Ações Promocionais Conjuntas</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Faça parte de campanhas colaborativas com outros parceiros
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-[#333333] hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center mb-6">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#333333] mb-3">Novos Clientes</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Receba clientes sem comissão, sem complicação
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-[#F6C100] hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F6C100] to-[#C91F1F] rounded-lg flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#333333] mb-3">Ativação Imediata</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Ative sua oferta e comece imediatamente
            </p>
          </div>
        </motion.div>
      </section>

      {/* Cultural Experiences Section */}
      <section className="bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <CulturalExperiences limit={6} showHeader={true} />
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-8">
              Explore por Categoria
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Descubra experiências organizadas por tipo e conecte-se com a comunidade cultural
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <CategoryGrid onCategorySelect={(category) => {
              navigate(`/ofertas?category=${category}`);
            }} />
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-br from-[#F6C100] via-[#C91F1F] to-[#333333] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Pronto para começar?
          </motion.h2>
          <motion.p 
            className="text-xl text-yellow-100 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Junte-se à nossa comunidade cultural e descubra experiências autênticas que transformam momentos em memórias.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link
              to="/ofertas"
              className="inline-flex items-center bg-white text-[#C91F1F] px-10 py-5 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Explorar Ofertas
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-white hover:text-[#C91F1F] transition-all"
            >
              Criar Conta
              <Users className="ml-3 w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-[#F6C100] via-[#C91F1F] to-[#333333] text-white py-24">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Sua história, em movimento.
          </motion.h2>
          <motion.h3 
            className="text-3xl md:text-4xl font-light mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Sua comunidade, conectada.
          </motion.h3>
          <motion.p 
            className="text-xl md:text-2xl mb-12 text-yellow-100 font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            ✨ Faça parte deste movimento cultural. Onde autenticidade encontra propósito.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              to="/parceiros-culturais"
              className="inline-flex items-center bg-white text-[#C91F1F] px-12 py-6 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
            >
              Ser Parceiro Cultural
              <Heart className="ml-3 w-7 h-7" />
            </Link>
            <Link
              to="/ofertas"
              className="inline-flex items-center bg-transparent border-3 border-white text-white px-12 py-6 rounded-full font-bold text-xl hover:bg-white hover:text-[#C91F1F] transition-all"
            >
              Descobrir Experiências
              <ArrowRight className="ml-3 w-7 h-7" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}