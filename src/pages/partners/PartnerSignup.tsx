import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, MapPin, Building, User, Mail, Phone, FileText, DollarSign, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { savePartnerRegistration, checkEmailExists, type PartnerRegistrationData } from '../../services/partnerService';
import { sendPartnerRegistrationEmails } from '../../services/emailService';

interface PartnerSignupForm {
  // Informações básicas
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  
  // Tipo de negócio
  businessType: 'restaurante' | 'cafe' | 'galeria' | 'atelier' | 'spa' | 'teatro' | 'outro';
  
  // Localização
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  
  // História e propósito
  founderStory: string;
  culturalMission: string;
  
  // Experiência proposta
  proposedExperience: {
    title: string;
    description: string;
    normalPrice: number;
    duoValue: string;
  };
  
  // Acordo
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export default function PartnerSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PartnerSignupForm>({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: 'cafe',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'Brasil'
    },
    founderStory: '',
    culturalMission: '',
    proposedExperience: {
      title: '',
      description: '',
      normalPrice: 0,
      duoValue: ''
    },
    termsAccepted: false,
    privacyAccepted: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'saving' | 'sending' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const businessTypes = [
    { value: 'restaurante', label: 'Restaurante', icon: '🍽️' },
    { value: 'cafe', label: 'Café', icon: '☕' },
    { value: 'galeria', label: 'Galeria', icon: '🎨' },
    { value: 'atelier', label: 'Ateliê', icon: '🎭' },
    { value: 'spa', label: 'Spa/Bem-estar', icon: '🧘' },
    { value: 'teatro', label: 'Teatro/Cultura', icon: '🎪' },
    { value: 'outro', label: 'Outro', icon: '✨' }
  ];

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof PartnerSignupForm] as Record<string, any>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('saving');
    setSubmitError('');

    if (isNaN(formData.proposedExperience.normalPrice) || formData.proposedExperience.normalPrice <= 0) {
      setSubmitError('Por favor, insira um preço normal válido maior que zero.');
      setIsSubmitting(false);
      return;
    }

    try {
      const saveData = { ...formData };

      console.log('📝 Salvando registro e enviando e-mails...');
      const dbResult = await savePartnerRegistration(saveData);

      if (dbResult.errorCode === 'duplicate_email') {
        setSubmitError('Este e-mail já está cadastrado. Por favor, use um e-mail diferente.');
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }

      if (!dbResult.success || !dbResult.id) {
        throw new Error(dbResult.error || 'Falha ao salvar o registro no banco de dados.');
      }

      console.log('✅ Registro salvo com ID:', dbResult.id);
      setSubmitStatus('sending');

      const emailResult = await sendPartnerRegistrationEmails(saveData);
      if (!emailResult.success) {
        // Mesmo que o e-mail falhe, o registro foi salvo.
        // O ideal é ter um sistema de retry ou notificação para a equipe.
        console.warn('⚠️ O registro foi salvo, mas o envio de e-mails falhou.', emailResult.errors);
        // Informar o usuário sobre o sucesso do registro, mas com um aviso.
        setSubmitError('Seu cadastro foi recebido, mas não conseguimos enviar o e-mail de confirmação. Nossa equipe entrará em contato em breve.');
      }

      console.log('✅ Processo de cadastro concluído!');
      setSubmitStatus('success');
      setShowSuccessModal(true);

      setTimeout(() => {
        navigate('/partners/success', { 
          state: { 
            contactName: formData.contactName,
            businessName: formData.businessName,
            registrationId: dbResult.id
          } 
        });
      }, 2000);

    } catch (error: any) {
      console.error('❌ Erro crítico no processo de cadastro:', error);
      setSubmitStatus('error');
      setSubmitError(error.message || 'Ocorreu um erro inesperado. Por favor, tente novamente ou entre em contato com o suporte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName && formData.contactName && formData.email && formData.phone;
      case 2:
        return formData.businessType && formData.address.street && formData.address.city && formData.address.postalCode;
      case 3:
        return formData.founderStory && formData.culturalMission;
      case 4:
        return formData.proposedExperience.title && formData.proposedExperience.description && 
               formData.proposedExperience.normalPrice > 0 && formData.proposedExperience.duoValue &&
               formData.termsAccepted && formData.privacyAccepted;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Informações Básicas</h2>
              <p className="text-gray-600">Vamos começar conhecendo você e seu negócio</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Nome do Estabelecimento *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: Café das Letras"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nome do Responsável *
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Tipo de Negócio e Localização</h2>
              <p className="text-gray-600">Nos ajude a entender melhor seu espaço</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Tipo de Estabelecimento *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {businessTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('businessType', type.value)}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      formData.businessType === type.value
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Rua, número, bairro"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade *</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="São Paulo"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CEP *</label>
                <input
                  type="text"
                  value={formData.address.postalCode}
                  onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="00000-000"
                  required
                />
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sua História e Propósito</h2>
              <p className="text-gray-600">O que torna seu espaço especial e autêntico?</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Heart className="w-4 h-4 inline mr-2" />
                Conte um pouco sobre sua história *
              </label>
              <textarea
                value={formData.founderStory}
                onChange={(e) => handleInputChange('founderStory', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Como surgiu seu negócio? O que te motivou a criar este espaço? Qual é a história por trás do seu estabelecimento?"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Qual seu propósito cultural? *
              </label>
              <textarea
                value={formData.culturalMission}
                onChange={(e) => handleInputChange('culturalMission', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Que impacto cultural você quer gerar? Como seu espaço contribui para a comunidade? Quais valores você quer transmitir?"
                required
              />
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Experiência Proposta</h2>
              <p className="text-gray-600">Vamos criar sua primeira experiência DUO PASS</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Título da Experiência *</label>
                <input
                  type="text"
                  value={formData.proposedExperience.title}
                  onChange={(e) => handleInputChange('proposedExperience.title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: Café + Conversa com Livros"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição da Experiência *</label>
                <textarea
                  value={formData.proposedExperience.description}
                  onChange={(e) => handleInputChange('proposedExperience.description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Descreva o que torna esta experiência especial e única"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Preço Normal (CHF) *
                </label>
                <input
                  type="number"
                  value={formData.proposedExperience.normalPrice}
                  onChange={(e) => {
  const value = e.target.value;
  const num = value ? parseFloat(value) : 0;
  handleInputChange('proposedExperience.normalPrice', isNaN(num) ? 0 : num);
}}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="25.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">O que oferece no 2 por 1? *</label>
                <input
                  type="text"
                  value={formData.proposedExperience.duoValue}
                  onChange={(e) => handleInputChange('proposedExperience.duoValue', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: 2 cafés especiais + acesso à biblioteca"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.termsAccepted}
                  onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                  className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  Aceito os <a href="#" className="text-amber-600 hover:underline">termos de uso</a> e condições da plataforma DUO PASS *
                </label>
              </div>
              
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={formData.privacyAccepted}
                  onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
                  className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  required
                />
                <label htmlFor="privacy" className="text-sm text-gray-700">
                  Aceito a <a href="#" className="text-amber-600 hover:underline">política de privacidade</a> *
                </label>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 pt-16">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="w-8 h-8 text-rose-500" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                  DUO PASS - Cadastro de Parceiro
                </h1>
              </div>
              <div className="text-sm text-gray-600">
                Etapa {currentStep} de {totalSteps}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            {renderStep()}
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
                disabled={currentStep === 1}
              >
                Voltar
              </button>
              
              <button
                type="submit"
                disabled={!canProceed() || isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all ${
                  canProceed() && !isSubmitting
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === totalSteps ? 'Finalizar Cadastro' : 'Próximo'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              
              {/* Feedback visual de status */}
              {submitStatus !== 'idle' && (
                <div className="mt-4 text-center">
                  {submitStatus === 'saving' && (
                    <div className="flex items-center justify-center space-x-2 text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>💾 Salvando dados...</span>
                    </div>
                  )}
                  
                  {submitStatus === 'sending' && (
                    <div className="flex items-center justify-center space-x-2 text-orange-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>📧 Enviando emails de confirmação...</span>
                    </div>
                  )}
                  
                  {submitStatus === 'success' && (
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>✅ Cadastro realizado com sucesso! Redirecionando...</span>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="flex items-center justify-center space-x-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <div className="text-center">
                        <div>❌ Erro no cadastro</div>
                        {submitError && (
                          <div className="text-sm mt-1 text-red-500">{submitError}</div>
                        )}
                        <button
                          onClick={() => {
                            setSubmitStatus('idle');
                            setSubmitError('');
                          }}
                          className="mt-2 text-sm underline hover:no-underline"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">Cadastro Recebido com Sucesso!</h3>
            <p className="text-gray-600 text-center mb-4">Seu cadastro como parceiro foi recebido com sucesso.</p>
            <p className="text-gray-600 text-center mb-4">Ele passará por um processo de curadoria pela nossa equipe.</p>
            <p className="text-gray-600 text-center mb-4">Entraremos em contato em até 48 horas para os próximos passos.</p>
            <p className="text-gray-600 text-center mb-6">Em caso de dúvidas, envie um e-mail para: contact@duopassclub.ch</p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}