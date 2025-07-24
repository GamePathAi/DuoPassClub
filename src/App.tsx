// React import removed since it's not directly used in this file
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ScrollToTop from '@/components/ScrollToTop';
import { supabase } from '@/lib/supabase';

// Layouts
import Layout from '@/components/Layout/Layout';
import DashboardLayout from '@/components/Layout/DashboardLayout';

// Page Components
import Home from '@/pages/Home';
// Removed unused import DemoShowcase
import ExperienciasLanding from '@/pages/ExperienciasLanding';
import ExperienciasPage from '@/pages/ExperienciasPage';
import ExperienceDetails from '@/pages/ExperienceDetails';


import Login from '@/pages/Auth/Login';
import Signup from '@/pages/Auth/SignUp';
import Callback from '@/pages/Auth/Callback';
import ConfirmEmail from '@/pages/Auth/ConfirmEmail';
import EmailVerification from '@/pages/Auth/EmailVerification';
import AuthCallback from '@/pages/Auth/AuthCallback';


import Dashboard from '@/pages/Dashboard';
import CustomerDashboard from '@/pages/Dashboard/CustomerDashboard';
import MyVouchers from '@/pages/MyVouchers';
import History from '@/pages/History';
import Connect from '@/pages/Connect';
import Recommendations from '@/pages/Recommendations';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Memberships from '@/pages/Memberships';
import Pricing from '@/pages/Pricing';
import Checkout from '@/pages/Checkout';
import BusinessPage from '@/pages/BusinessPage';
import TrialPage from '@/pages/TrialPage';
import CommunityDetail from '@/pages/CommunityDetail';
import VoucherActive from '@/pages/VoucherActive';
import VoucherDetails from '@/pages/VoucherDetails';
import ActiveVoucherSuccess from '@/pages/ActiveVoucherSuccess';
import CulturalPartnerLanding from '@/pages/CulturalPartnerLanding';
import HowItWorksPartners from '@/pages/partners/HowItWorksPartners';
import PartnerSignup from '@/pages/partners/PartnerSignup';
import PartnerSuccess from '@/pages/partners/PartnerSuccess';
import CulturalPartnerPortal from './pages/CulturalPartnerPortal';
import MerchantPortal from './pages/Merchant/MerchantPortal';
import MerchantDashboard from '@/pages/Dashboard/MerchantDashboard';
import AdminLoginPage from '@/pages/Admin/AdminLoginPage';
import AdminDashboard from '@/pages/Admin/AdminDashboard';
import OffersManager from '@/pages/Admin/OffersManager';
import UsersManager from '@/pages/Admin/UsersManager';
import Analytics from '@/pages/Admin/Analytics';
import AdminSettings from '@/pages/Admin/AdminSettings';
// import PartnerDashboard from '@/pages/PartnerDashboard'; // File not found
// import BusinessAnalytics from '@/pages/BusinessAnalytics'; // File not found
import PromptBuilderPage from '@/pages/PromptBuilderPage';
import NotificationsPage from '@/pages/NotificationsPage';
import Offers from '@/pages/Offers';
import OfferDetails from '@/pages/OfferDetails';
import OfertasPage from '@/pages/OfertasPage';
import Onboarding from '@/pages/Onboarding';

// Legal Pages
import Cancelamento from '@/pages/Legal/Cancelamento';
import ExperienciasTermos from '@/pages/Legal/ExperienciasTermos';
import PoliticaPrivacidade from '@/pages/Legal/PoliticaPrivacidade';
import TermosDeUso from '@/pages/Legal/TermosDeUso';

// Route Protection
import { ProtectedRoute, CustomerRoute, MerchantRoute } from '@/components/ProtectedRoute';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <ScrollToTop />
      <HelmetProvider>
        <LanguageProvider>
          <AuthProvider>
            <AdminAuthProvider>
              <Layout>
                <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/experiencias" element={<ExperienciasPage />} />

<Route path="/ofertas" element={<ProtectedRoute><OfertasPage /></ProtectedRoute>} />

              {/* Legal Routes */}
              <Route path="/legal/cancelamento" element={<Cancelamento />} />
              <Route path="/legal/termos-experiencias" element={<ExperienciasTermos />} />
              <Route path="/legal/politica-de-privacidade" element={<PoliticaPrivacidade />} />
              <Route path="/legal/termos-de-uso" element={<TermosDeUso />} />
              
              
              
              {/* Auth Routes */} 
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth/callback" element={<Callback />} />
              <Route path="/confirm-email" element={<ConfirmEmail />} />
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="/auth/google/callback" element={<AuthCallback />} />
              <Route path="/auth/v1/callback" element={<AuthCallback />} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              
              
              
              {/* Membership Routes */} 
              <Route path="/memberships" element={<Memberships />} />
              <Route path="/pricing" element={<Pricing />} />
            <Route path="/empresas" element={<BusinessPage />} />
            <Route path="/trial" element={<TrialPage />} />
              <Route path="/checkout" element={<Checkout />} />
              {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
              <Route path="/customer-dashboard" element={<CustomerRoute><CustomerDashboard /></CustomerRoute>} />
              <Route path="/recomendacoes-ia" element={<CustomerRoute><Recommendations /></CustomerRoute>} />
              <Route path="/meus-vouchers" element={<CustomerRoute><MyVouchers /></CustomerRoute>} />
              <Route path="/historico" element={<CustomerRoute><History /></CustomerRoute>} />
              <Route path="/connect" element={<CustomerRoute><Connect /></CustomerRoute>} />

              
              {/* Community Detail Route */}
              <Route path="/comunidade/:id" element={
                <CustomerRoute>
                  <CommunityDetail />
                </CustomerRoute>
              } />
              
              {/* Voucher Routes */}
              <Route path="/voucher/:id" element={<CustomerRoute><VoucherDetails /></CustomerRoute>} />
              <Route path="/voucher/:id/active" element={<CustomerRoute><VoucherActive /></CustomerRoute>} />
              <Route path="/voucher/active/success" element={<CustomerRoute><ActiveVoucherSuccess /></CustomerRoute>} />
              
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
              
              {/* Merchant Portal - Public for testing */}
              <Route path="/merchant" element={<MerchantPortal />} />
              
              {/* Protected Routes - Merchant */}
              <Route path="/merchant/dashboard" element={
                <MerchantRoute>
                  <MerchantDashboard />
                </MerchantRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminProtectedRoute><DashboardLayout><AdminDashboard /></DashboardLayout></AdminProtectedRoute>} />
              <Route path="/admin/ofertas" element={<AdminProtectedRoute><DashboardLayout><OffersManager /></DashboardLayout></AdminProtectedRoute>} />
              <Route path="/admin/usuarios" element={<AdminProtectedRoute><DashboardLayout><UsersManager /></DashboardLayout></AdminProtectedRoute>} />
              <Route path="/admin/analytics" element={<AdminProtectedRoute><DashboardLayout><Analytics /></DashboardLayout></AdminProtectedRoute>} />
              <Route path="/admin/settings" element={<AdminProtectedRoute><DashboardLayout><AdminSettings /></DashboardLayout></AdminProtectedRoute>} />
              
              {/* Protected Routes - Partner - File not found, route commented out */}
               {/* <Route path="/dashboard-parceiro" element={ */}
               {/*   <PartnerRoute> */}
               {/*     <PartnerDashboard /> */}
               {/*   </PartnerRoute> */}
               {/* } /> */}
              
              {/* Analytics Route - Admin Only - File not found, route commented out */}
              {/* <Route path="/analytics" element={ */}
              {/*   <ProtectedRoute> */}
              {/*     <BusinessAnalytics /> */}
              {/*   </ProtectedRoute> */}
              {/* } /> */}
              
              {/* Prompt Builder - Demo Tool for Investors */}
              <Route path="/prompt-builder" element={<PromptBuilderPage />} />
              
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
            </AdminAuthProvider>
          </AuthProvider>
        </LanguageProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;