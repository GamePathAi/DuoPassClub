import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, CreditCard, Shield, Lock, Star, Crown, Trophy } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../types/membership';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseConfig';

// Controle de ambiente para proteção
const _0x7h8i = process.env.NODE_ENV === 'development';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    country: 'CH'
  });

  const planId = searchParams.get('plan') || 'cultural-explorer';
  const initialBilling = searchParams.get('billing') as 'monthly' | 'yearly' || 'monthly';
  
  const selectedPlan = MEMBERSHIP_PLANS.find(plan => plan.id === planId) || MEMBERSHIP_PLANS[1];

  useEffect(() => {
    setBillingCycle(initialBilling);
  }, [initialBilling]);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(`/checkout?plan=${planId}&billing=${billingCycle}`));
    }
  }, [user, navigate, planId, billingCycle]);

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case 'starter': return <Star className="w-6 h-6" />;
      case 'explorer': return <Crown className="w-6 h-6" />;
      case 'ambassador': return <Trophy className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  const getCurrentPrice = () => {
    return billingCycle === 'yearly' ? selectedPlan.price_yearly : selectedPlan.price_monthly;
  };

  const getYearlySavings = () => {
    const monthlyTotal = selectedPlan.price_monthly * 12;
    const yearlyPrice = selectedPlan.price_yearly;
    return monthlyTotal - yearlyPrice;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (selectedPlan.id === 'starter') {
        // Lógica para iniciar o trial de 7 dias
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);

        const { error } = await supabase.from('user_subscriptions').insert({
          user_id: user.id,
          plan_id: selectedPlan.id,
          status: 'trialing',
          trial_end: trialEndDate.toISOString(),
          current_period_end: trialEndDate.toISOString(),
        });

        if (error) throw error;

        localStorage.setItem('showTrialOnboarding', 'true');
        navigate('/customer-dashboard?welcome_trial=true');

      } else {
        // Simulação de pagamento para outros planos
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (_0x7h8i) {
          console.log('Processing payment for:', {
            plan: selectedPlan,
            billing: billingCycle,
            amount: getCurrentPrice(),
            user: user?.email,
            paymentMethod: formData
          });
        }

        // Lógica de criação de assinatura paga (simulada)
        navigate('/customer-dashboard?welcome=true&plan=' + selectedPlan.id);
      }
    } catch (error) {
      if (_0x7h8i) {
        console.error('Subscription/Payment failed:', error);
      }
      alert('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/memberships')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar aos Planos</span>
            </button>
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-purple-600 bg-clip-text text-transparent">
              DUO PASS
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Pagamento Seguro</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">Resumo do Pedido</h2>
              
              {/* Selected Plan */}
              <div className="border border-gray-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`rounded-full p-2 ${
                    selectedPlan.tier === 'starter' ? 'bg-amber-100 text-amber-600' :
                    selectedPlan.tier === 'explorer' ? 'bg-purple-100 text-purple-600' :
                    'bg-rose-100 text-rose-600'
                  }`}>
                    {getPlanIcon(selectedPlan.tier)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedPlan.name}</h3>
                    {selectedPlan.popular && (
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">⭐ Popular</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{selectedPlan.description}</p>
                
                {/* Key Features */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{selectedPlan.experiences_per_month === -1 ? 'Experiências ilimitadas' : `${selectedPlan.experiences_per_month} experiências por mês`}</span>
                  </div>
                  {selectedPlan.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Cycle */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Ciclo de Cobrança</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      billingCycle === 'monthly'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div>Mensal</div>
                    <div className="text-lg font-bold">CHF {selectedPlan.price_monthly}</div>
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all relative ${
                      billingCycle === 'yearly'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Economize CHF {getYearlySavings()}
                    </div>
                    <div>Anual</div>
                    <div className="text-lg font-bold">CHF {selectedPlan.price_yearly}</div>
                    <div className="text-xs text-gray-500">CHF {(selectedPlan.price_yearly / 12).toFixed(2)}/mês</div>
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>CHF {getCurrentPrice()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IVA (7.7%)</span>
                  <span>CHF {(getCurrentPrice() * 0.077).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Teste Grátis (7 dias)</span>
                  <span>-CHF {getCurrentPrice()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total Hoje</span>
                  <span>CHF 0.00</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Após o período de teste, você será cobrado CHF {(getCurrentPrice() * 1.077).toFixed(2)} {billingCycle === 'yearly' ? 'anualmente' : 'mensalmente'}.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Payment Form */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">Informações de Pagamento</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Método de Pagamento</label>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        paymentMethod === 'card'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5" />
                        <span className="font-medium">Cartão de Crédito/Débito</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Visa, Mastercard, American Express</div>
                    </button>
                  </div>
                </div>

                {/* Card Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número do Cartão</label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data de Expiração</label>
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                        placeholder="MM/AA"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome no Cartão</label>
                    <input
                      type="text"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      placeholder="João Silva"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Billing Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">Informações de Cobrança</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email || user?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="CH">Suíça</option>
                      <option value="DE">Alemanha</option>
                      <option value="FR">França</option>
                      <option value="IT">Itália</option>
                      <option value="AT">Áustria</option>
                    </select>
                  </div>
                </div>

                {/* Legal Compliance Checkboxes */}
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">⚖️ Confirmações Obrigatórias</h3>
                  
                  {/* Termos e Privacidade */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      ✓ Aceito os <a href="/termos-de-uso" target="_blank" className="text-purple-600 hover:underline font-medium">Termos de Uso</a> e <a href="/privacidade" target="_blank" className="text-purple-600 hover:underline font-medium">Política de Privacidade</a>
                    </label>
                  </div>
                  
                  {/* Renovação Automática */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="auto-renewal"
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="auto-renewal" className="text-sm text-gray-700">
                      ✓ Entendo que minha assinatura <strong>renova automaticamente</strong> {billingCycle === 'yearly' ? 'anualmente' : 'mensalmente'} por CHF {(getCurrentPrice() * 1.077).toFixed(2)}
                    </label>
                  </div>
                  
                  {/* Cancelamento */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="cancellation"
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="cancellation" className="text-sm text-gray-700">
                      ✓ Posso <strong>cancelar a qualquer momento</strong> com um clique no meu dashboard. <a href="/cancelamento" target="_blank" className="text-purple-600 hover:underline">Saiba mais</a>
                    </label>
                  </div>
                  
                  {/* Direito de Arrependimento */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="refund-policy"
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="refund-policy" className="text-sm text-gray-700">
                      ✓ Tenho <strong>14 dias</strong> para solicitar reembolso integral conforme lei suíça. <a href="/cancelamento" target="_blank" className="text-purple-600 hover:underline">Política de reembolso</a>
                    </label>
                  </div>
                  
                  {/* Aviso Legal */}
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400 mt-4">
                    <p className="text-xs text-blue-800">
                      🇨🇭 <strong>Proteção do Consumidor Suíço:</strong> Esta compra está protegida pelas leis suíças de proteção ao consumidor e GDPR. 
                      Seus dados são processados de acordo com nossa política de privacidade.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-amber-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Iniciar Teste Grátis de 7 Dias</span>
                    </>
                  )}
                </button>

                {/* Security Notice */}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Seus dados estão protegidos com criptografia SSL</span>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}