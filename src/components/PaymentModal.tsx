import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Check, AlertCircle, Loader2 } from 'lucide-react';
import { PaymentService } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';
import { PaymentFormData, PaymentValidation, SubscriptionPlan, BillingCycle } from '../types/payment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: SubscriptionPlan;
  onSuccess?: (subscription: { id: string; user_id: string; plan_id: string; status: string }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  onSuccess
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'plan' | 'payment' | 'processing' | 'success'>('plan');
  const [billingCycle] = useState<BillingCycle>(BillingCycle.MONTHLY);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [formData, setFormData] = useState<PaymentFormData>({
    payment_method: 'credit_card',
    plan_id: selectedPlan?.id || '',
    billing_cycle: BillingCycle.MONTHLY
  });
  const [validation, setValidation] = useState<PaymentValidation>({ is_valid: true, errors: [] });
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixQRCode] = useState<string>('');
  const [error] = useState<string>('');

  const plans = PaymentService.SUBSCRIPTION_PLANS;
  const currentPlan = selectedPlan || plans[0];

  useEffect(() => {
    if (selectedPlan) {
      setFormData(prev => ({ ...prev, plan_id: selectedPlan.id }));
    }
  }, [selectedPlan]);

  const validateForm = (): PaymentValidation => {
    const errors: string[] = [];

    if (!formData.plan_id) {
      errors.push('Selecione um plano');
    }

    if (paymentMethod === 'credit_card') {
      if (!formData.card_number || formData.card_number.length < 16) {
        errors.push('Número do cartão inválido');
      }
      if (!formData.card_holder_name) {
        errors.push('Nome do portador é obrigatório');
      }
      if (!formData.card_expiry || !/^\d{2}\/\d{2}$/.test(formData.card_expiry)) {
        errors.push('Data de validade inválida (MM/AA)');
      }
      if (!formData.card_cvv || formData.card_cvv.length < 3) {
        errors.push('CVV inválido');
      }
    }

    if (paymentMethod === 'pix') {
      if (!formData.cpf || formData.cpf.length < 11) {
        errors.push('CPF é obrigatório para PIX');
      }
    }

    return {
      is_valid: errors.length === 0,
      errors
    };
  };

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatCPF = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleSubmit = async () => {
    const validationResult = validateForm();
    setValidation(validationResult);

    if (!validationResult.is_valid) {
      return;
    }

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    setIsProcessing(true);
    setStep('processing');

    try {
      if (paymentMethod === 'pix') {
        // Gerar QR Code PIX
        const amount = billingCycle === 'yearly' ? currentPlan.price_yearly : currentPlan.price_monthly;
        const qrCode = PaymentService.generatePixQRCode(
          amount,
          `Assinatura ${currentPlan.name} - DuoPass Club`
        );
        setPixQRCode(qrCode);
        setStep('payment');
        setIsProcessing(false);
        return;
      }

      // Simular adição de método de pagamento
      const paymentMethodResult = await PaymentService.addPaymentMethod(
        user.id,
        formData.payment_method,
        'stripe', // Provider simulado
        {
          last_four: formData.card_number?.slice(-4),
          brand: 'visa' // Simulado
        }
      );

      if (!paymentMethodResult.success) {
        throw new Error(paymentMethodResult.error);
      }

      // Criar assinatura
      const subscriptionResult = await PaymentService.createSubscription(
        user.id,
        formData.plan_id,
        paymentMethodResult.paymentMethod!.id,
        billingCycle
      );

      if (!subscriptionResult.success) {
        throw new Error(subscriptionResult.error);
      }

      setStep('success');
      onSuccess?.(subscriptionResult.subscription);
    } catch (error) {
      console.error('Erro no pagamento:', error);
      setError(error instanceof Error ? error.message : 'Erro no processamento do pagamento');
      setStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePixPayment = () => {
    // Simular confirmação do pagamento PIX
    setTimeout(() => {
      setStep('success');
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'plan' && 'Escolha seu Plano'}
            {step === 'payment' && 'Pagamento'}
            {step === 'processing' && 'Processando...'}
            {step === 'success' && 'Pagamento Confirmado!'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'plan' && (
            <div className="space-y-6">
              {/* Planos */}
              <div className="grid gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      formData.plan_id === plan.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('plan_id', plan.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                        <p className="text-gray-600 text-sm">{plan.description}</p>
                        <div className="mt-2">
                          <span className="text-2xl font-bold text-blue-600">
                            CHF {billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly}
                          </span>
                          <span className="text-gray-500 ml-1">
                            /{billingCycle === 'yearly' ? 'ano' : 'mês'}
                          </span>
                        </div>
                      </div>
                      {formData.plan_id === plan.id && (
                        <Check className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                    <div className="mt-3 space-y-1">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ciclo de cobrança */}
              <div>
                <h4 className="font-semibold mb-3">Ciclo de cobrança</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`p-3 rounded-lg border-2 transition-all ${
                      billingCycle === 'monthly'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setBillingCycle(BillingCycle.MONTHLY)}
                  >
                    <div className="text-sm font-medium">Mensal</div>
                    <div className="text-xs text-gray-500">Pague mensalmente</div>
                  </button>
                  <button
                    className={`p-3 rounded-lg border-2 transition-all ${
                      billingCycle === 'yearly'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setBillingCycle(BillingCycle.YEARLY)}
                  >
                    <div className="text-sm font-medium">Anual</div>
                    <div className="text-xs text-green-600">Economize 2 meses!</div>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep('payment')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Continuar para Pagamento
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              {/* Resumo do plano */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Resumo do pedido</h4>
                <div className="flex justify-between items-center">
                  <span>{currentPlan.name} - {billingCycle === 'yearly' ? 'Anual' : 'Mensal'}</span>
                  <span className="font-bold">
                    CHF {billingCycle === 'yearly' ? currentPlan.price_yearly : currentPlan.price_monthly}
                  </span>
                </div>
              </div>

              {/* Método de pagamento */}
              <div>
                <h4 className="font-semibold mb-3">Método de pagamento</h4>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    className={`p-3 rounded-lg border-2 flex items-center justify-center transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('credit_card')}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Cartão
                  </button>
                  <button
                    className={`p-3 rounded-lg border-2 flex items-center justify-center transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('pix')}
                  >
                    <Smartphone className="w-5 h-5 mr-2" />
                    PIX
                  </button>
                </div>

                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número do cartão
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={formData.card_number || ''}
                        onChange={(e) => handleInputChange('card_number', formatCardNumber(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do portador
                      </label>
                      <input
                        type="text"
                        placeholder="João Silva"
                        value={formData.card_holder_name || ''}
                        onChange={(e) => handleInputChange('card_holder_name', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Validade
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          maxLength={5}
                          value={formData.card_expiry || ''}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.substring(0, 2) + '/' + value.substring(2, 4);
                            }
                            handleInputChange('card_expiry', value);
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength={4}
                          value={formData.card_cvv || ''}
                          onChange={(e) => handleInputChange('card_cvv', e.target.value.replace(/\D/g, ''))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'pix' && (
                  <div className="space-y-4">
                    {!pixQRCode ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CPF
                        </label>
                        <input
                          type="text"
                          placeholder="000.000.000-00"
                          maxLength={14}
                          value={formData.cpf || ''}
                          onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                          <div className="w-48 h-48 bg-gray-100 mx-auto rounded-lg flex items-center justify-center">
                            <div className="text-xs text-gray-500 text-center">
                              QR Code PIX<br />
                              {pixQRCode.substring(0, 20)}...
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Escaneie o QR Code com seu app do banco ou copie o código PIX
                        </p>
                        <button
                          onClick={handlePixPayment}
                          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Já paguei via PIX
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Erros */}
              {(validation.errors.length > 0 || error) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700 font-medium">Erro no pagamento</span>
                  </div>
                  <ul className="mt-2 text-sm text-red-600">
                    {validation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {error && <li>• {error}</li>}
                  </ul>
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('plan')}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
                {paymentMethod === 'credit_card' && (
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : null}
                    {isProcessing ? 'Processando...' : 'Finalizar Pagamento'}
                  </button>
                )}
                {paymentMethod === 'pix' && !pixQRCode && (
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : null}
                    {isProcessing ? 'Gerando PIX...' : 'Gerar PIX'}
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Processando pagamento...</h3>
              <p className="text-gray-600">Aguarde enquanto confirmamos seu pagamento</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pagamento confirmado!</h3>
              <p className="text-gray-600 mb-6">
                Sua assinatura {currentPlan.name} foi ativada com sucesso.
              </p>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Continuar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};