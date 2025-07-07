import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute, CustomerRoute, MerchantRoute, PartnerRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Home } from './pages/Home';

import { Vouchers } from './pages/Vouchers';
import { History } from './pages/History';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Login } from './pages/Auth/Login';
import { SignUp } from './pages/Auth/SignUp';
import { EmailVerification } from './pages/Auth/EmailVerification';
import { ConfirmEmail } from './pages/Auth/ConfirmEmail';
import { MerchantDashboard } from './pages/Dashboard/MerchantDashboard';
import { CustomerDashboard } from './pages/Dashboard/CustomerDashboard';
import { NotificationsPage } from './pages/NotificationsPage';
import { OfferDetails } from './pages/OfferDetails';
import ActiveVoucher from './pages/ActiveVoucher';
import { MyVouchers } from './pages/MyVouchers';
import { VoucherDetails } from './pages/VoucherDetails';
import { VoucherActive } from './pages/VoucherActive';
import { ActiveVoucherSuccess } from './pages/ActiveVoucherSuccess';
import { CulturalPartnerPortal } from './pages/CulturalPartnerPortal';

import { PartnerDashboard } from './components/PartnerDashboard';
import { CulturalPartnerLanding } from './pages/CulturalPartnerLanding';
import { PartnerSignup, PartnerSuccess } from './pages/partners';
import { HowItWorksPartners } from './pages/partners/HowItWorksPartners';

import { ExperienceDetails } from './pages/ExperienceDetails';
import { CommunityDetail } from './pages/CommunityDetail';
import { OfferPage, DescontoPizza, MassagemRelaxante, CorteBarba, AulaYoga } from './pages/offers/index';
import { Memberships } from './pages/Memberships';
import { Checkout } from './pages/Checkout';
import { Dashboard } from './pages/Dashboard';
import { Pricing } from './pages/Pricing';
import { BusinessPage } from './pages/BusinessPage';
import { TrialPage } from './pages/TrialPage';
import { ExperienciasPage } from './pages/ExperienciasPage';
import { OfertasPage } from './pages/OfertasPage';

// Legal Pages
import { TermosDeUso } from './pages/Legal/TermosDeUso';
import { PoliticaPrivacidade } from './pages/Legal/PoliticaPrivacidade';
import { Cancelamento } from './pages/Legal/Cancelamento';
import { ExperienciasTermos } from './pages/Legal/ExperienciasTermos';

import { supabase } from './lib/supabaseConfig';

function App() {
  // Teste de conexão com Supabase
  useEffect(() => {

    supabase.from('categories').select('*').then((result) => {
      if (result.error) {
        console.error('❌ Erro ao conectar com Supabase:', result.error);
      } else {
        console.log('✅ Conexão com Supabase OK! Categorias encontradas:', result.data);
      }
    });
  }, []);

  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/offers" element={<Navigate to="/ofertas" replace />} />
              <Route path="/offer/:id" element={<OfferDetails />} />
              
              {/* Experiências Routes */}
              <Route path="/experiencias" element={<ExperienciasPage />} />
              <Route path="/ofertas" element={<OfertasPage />} />
              
              {/* Legal Pages */}
              <Route path="/termos-de-uso" element={<TermosDeUso />} />
              <Route path="/privacidade" element={<PoliticaPrivacidade />} />
              <Route path="/cancelamento" element={<Cancelamento />} />
              <Route path="/experiencias-termos" element={<ExperienciasTermos />} />
              
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="/confirm-email" element={<ConfirmEmail />} />
              
              {/* Protected Routes - Customer */}
              <Route path="/customer-dashboard" element={
                <CustomerRoute>
                  <CustomerDashboard />
                </CustomerRoute>
              } />
              <Route path="/vouchers" element={
                <CustomerRoute>
                  <Vouchers />
                </CustomerRoute>
              } />
              <Route path="/meus-vouchers" element={
                <CustomerRoute>
                  <MyVouchers />
                </CustomerRoute>
              } />
              <Route path="/history" element={
                <CustomerRoute>
                  <History />
                </CustomerRoute>
              } />

              
              {/* Voucher Flow Routes */}
              <Route path="/voucher/:id" element={
                <CustomerRoute>
                  <VoucherDetails />
                </CustomerRoute>
              } />
              <Route path="/voucher/:id/active" element={
                <CustomerRoute>
                  <ActiveVoucher />
                </CustomerRoute>
              } />

              <Route path="/oferta/:offerId" element={<OfferPage />} />
              <Route path="/oferta/desconto-pizza" element={<DescontoPizza />} />
              <Route path="/oferta/massagem-relaxante" element={<MassagemRelaxante />} />
              <Route path="/oferta/corte-barba" element={<CorteBarba />} />
              <Route path="/oferta/aula-yoga" element={<AulaYoga />} />
              
              {/* Experience Details Route */}
              <Route path="/experiencia/:id" element={<ExperienceDetails />} />
              <Route path="/experience/:id" element={<ExperienceDetails />} />
              
              {/* Membership Routes */}
              <Route path="/memberships" element={<Memberships />} />
              <Route path="/pricing" element={<Pricing />} />
            <Route path="/empresas" element={<BusinessPage />} />
            <Route path="/trial" element={<TrialPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Community Detail Route */}
              <Route path="/comunidade/:id" element={
                <CustomerRoute>
                  <CommunityDetail />
                </CustomerRoute>
              } />
              
              {/* Active Voucher Success Route */}
              <Route path="/voucher/ativo/:id" element={<ActiveVoucherSuccess />} />
              
              {/* Cultural Partner Routes */}
              <Route path="/parceiros-culturais" element={<CulturalPartnerLanding />} />
              <Route path="/cultural-partner-landing" element={<CulturalPartnerLanding />} />
              <Route path="/como-funciona-parceiros" element={<HowItWorksPartners />} />
              <Route path="/cadastro-parceiro" element={<PartnerSignup />} />
              <Route path="/parceiro-cadastrado" element={<PartnerSuccess />} />
              <Route path="/cultural-partner-portal" element={
                <ProtectedRoute>
                  <CulturalPartnerPortal />
                </ProtectedRoute>
              } />
              
              {/* Protected Routes - Merchant */}
              <Route path="/merchant/dashboard" element={
                <MerchantRoute>
                  <MerchantDashboard />
                </MerchantRoute>
              } />
              
              {/* Protected Routes - Partner */}
               <Route path="/dashboard-parceiro" element={
                 <PartnerRoute>
                   <PartnerDashboard />
                 </PartnerRoute>
               } />
              
              {/* Protected Routes - Any Authenticated User */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={
                <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#333333] mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Página não encontrada</p>
                    <a href="/" className="text-[#C91F1F] hover:underline">Voltar ao início</a>
                  </div>
                </div>
              } />
            </Routes>
          </Layout>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;