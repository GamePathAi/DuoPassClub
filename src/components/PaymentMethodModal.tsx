import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import type { PaymentMethodData } from '../services/paymentMethodService';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: PaymentMethodData) => Promise<void>;
  currentCard?: {
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
  };
}

export function PaymentMethodModal({ isOpen, onClose, onSave, currentCard }: PaymentMethodModalProps) {
  const [formData, setFormData] = useState<PaymentMethodData>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });
  
  const [errors, setErrors] = useState<Partial<PaymentMethodData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  };

  const validateExpiryDate = (month: string, year: string) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return expMonth >= 1 && expMonth <= 12;
  };

  const validateCVV = (cvv: string) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const getCardBrand = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'VISA';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'MASTERCARD';
    if (cleaned.startsWith('3')) return 'AMEX';
    return 'CARD';
  };

  const handleInputChange = (field: keyof PaymentMethodData, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      if (formattedValue.replace(/\s/g, '').length > 19) return;
    }
    
    if (field === 'expiryMonth' || field === 'expiryYear') {
      formattedValue = value.replace(/\D/g, '');
      if (field === 'expiryMonth' && formattedValue.length > 2) return;
      if (field === 'expiryYear' && formattedValue.length > 4) return;
    }
    
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<PaymentMethodData> = {};
    
    if (!formData.cardNumber || !validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Número do cartão inválido';
    }
    
    if (!formData.expiryMonth || !formData.expiryYear || 
        !validateExpiryDate(formData.expiryMonth, formData.expiryYear)) {
      newErrors.expiryMonth = 'Data de expiração inválida';
    }
    
    if (!formData.cvv || !validateCVV(formData.cvv)) {
      newErrors.cvv = 'CVV inválido';
    }
    
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Nome do portador é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await onSave(formData);
      setShowSuccess(true);
      
      // Close modal after success animation
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        // Reset form
        setFormData({
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          cardholderName: ''
        });
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar método de pagamento:', error);
      // Handle error - could show error message
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {showSuccess ? (
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sucesso!</h2>
            <p className="text-gray-600">Método de pagamento atualizado com sucesso.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Alterar Método de Pagamento</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Current Card Info */}
              {currentCard && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Cartão Atual</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{currentCard.brand}</span>
                    </div>
                    <span className="text-gray-800">•••• •••• •••• {currentCard.last4}</span>
                    <span className="text-gray-600 text-sm">{currentCard.expMonth}/{currentCard.expYear}</span>
                  </div>
                </div>
              )}

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do Cartão
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <div className="absolute right-3 top-3">
                    <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {getCardBrand(formData.cardNumber)}
                      </span>
                    </div>
                  </div>
                </div>
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mês
                  </label>
                  <input
                    type="text"
                    value={formData.expiryMonth}
                    onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                    placeholder="12"
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.expiryMonth ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ano
                  </label>
                  <input
                    type="text"
                    value={formData.expiryYear}
                    onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                    placeholder="2025"
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.expiryMonth ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    placeholder="123"
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.cvv ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
              {(errors.expiryMonth || errors.cvv) && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.expiryMonth || errors.cvv}
                </p>
              )}

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Portador
                </label>
                <input
                  type="text"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  placeholder="João Silva"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.cardholderName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.cardholderName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.cardholderName}
                  </p>
                )}
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">Pagamento Seguro</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Seus dados são criptografados e protegidos conforme padrões PCI DSS.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>Salvar Cartão</>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}