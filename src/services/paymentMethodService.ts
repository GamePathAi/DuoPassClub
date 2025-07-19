// Simulação de integração com Stripe para métodos de pagamento

export interface PaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details: {
    name: string;
  };
  created: number;
}

export interface PaymentMethodData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

// Simulação de dados do Stripe
let mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1234567890',
    type: 'card',
    card: {
      brand: 'visa',
      last4: '4242',
      exp_month: 12,
      exp_year: 2025
    },
    billing_details: {
      name: 'João Silva'
    },
    created: Date.now()
  }
];

// Simula delay de rede
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 1500));

// Simula validação do cartão
const validateCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  // Algoritmo de Luhn simplificado para validação
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Detecta a bandeira do cartão
const detectCardBrand = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (cleaned.startsWith('4')) return 'visa';
  if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'mastercard';
  if (cleaned.startsWith('3')) return 'amex';
  if (cleaned.startsWith('6')) return 'discover';
  
  return 'unknown';
};

export class PaymentMethodService {
  // Obtém o método de pagamento atual do usuário
  static async getCurrentPaymentMethod(): Promise<PaymentMethod | null> {
    await simulateNetworkDelay();
    
    // Simula busca no backend/Stripe
    return mockPaymentMethods[0] || null;
  }
  
  // Atualiza o método de pagamento
  static async updatePaymentMethod(paymentData: PaymentMethodData): Promise<PaymentMethod> {
    await simulateNetworkDelay();
    
    // Validações
    if (!validateCard(paymentData.cardNumber)) {
      throw new Error('Número do cartão inválido');
    }
    
    const currentDate = new Date();
    const expYear = parseInt(paymentData.expiryYear);
    const expMonth = parseInt(paymentData.expiryMonth);
    
    if (expYear < currentDate.getFullYear() || 
        (expYear === currentDate.getFullYear() && expMonth < currentDate.getMonth() + 1)) {
      throw new Error('Cartão expirado');
    }
    
    if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      throw new Error('CVV inválido');
    }
    
    if (!paymentData.cardholderName.trim()) {
      throw new Error('Nome do portador é obrigatório');
    }
    
    // Simula criação de novo método de pagamento no Stripe
    const newPaymentMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: 'card',
      card: {
        brand: detectCardBrand(paymentData.cardNumber),
        last4: paymentData.cardNumber.replace(/\s/g, '').slice(-4),
        exp_month: expMonth,
        exp_year: expYear
      },
      billing_details: {
        name: paymentData.cardholderName
      },
      created: Date.now()
    };
    
    // Atualiza o mock (em produção, isso seria feito no backend)
    mockPaymentMethods[0] = newPaymentMethod;
    
    // Simula atualização da assinatura no Stripe
    console.log('Método de pagamento atualizado:', newPaymentMethod);
    
    return newPaymentMethod;
  }
  
  // Remove método de pagamento
  static async removePaymentMethod(paymentMethodId: string): Promise<void> {
    await simulateNetworkDelay();
    
    // Simula remoção no Stripe
    mockPaymentMethods = mockPaymentMethods.filter(pm => pm.id !== paymentMethodId);
    
    console.log('Método de pagamento removido:', paymentMethodId);
  }
  
  // Lista todos os métodos de pagamento do usuário
  static async listPaymentMethods(): Promise<PaymentMethod[]> {
    await simulateNetworkDelay();
    
    return [...mockPaymentMethods];
  }
  
  // Valida dados do cartão em tempo real
  static validateCardData(paymentData: Partial<PaymentMethodData>): {
    isValid: boolean;
    errors: Partial<PaymentMethodData>;
  } {
    const errors: Partial<PaymentMethodData> = {};
    
    if (paymentData.cardNumber && !validateCard(paymentData.cardNumber)) {
      errors.cardNumber = 'Número do cartão inválido';
    }
    
    if (paymentData.expiryMonth && paymentData.expiryYear) {
      const currentDate = new Date();
      const expYear = parseInt(paymentData.expiryYear);
      const expMonth = parseInt(paymentData.expiryMonth);
      
      if (expYear < currentDate.getFullYear() || 
          (expYear === currentDate.getFullYear() && expMonth < currentDate.getMonth() + 1)) {
        errors.expiryMonth = 'Cartão expirado';
      }
    }
    
    if (paymentData.cvv && !/^\d{3,4}$/.test(paymentData.cvv)) {
      errors.cvv = 'CVV deve ter 3 ou 4 dígitos';
    }
    
    if (paymentData.cardholderName !== undefined && !paymentData.cardholderName.trim()) {
      errors.cardholderName = 'Nome do portador é obrigatório';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  // Simula teste de conexão com gateway
  static async testConnection(): Promise<boolean> {
    await simulateNetworkDelay();
    
    // Simula 95% de sucesso
    return Math.random() > 0.05;
  }
}

// Utilitários para formatação
export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, '');
  const match = cleaned.match(/.{1,4}/g);
  return match ? match.join(' ') : cleaned;
};

export const formatExpiryDate = (month: string, year: string): string => {
  const paddedMonth = month.padStart(2, '0');
  const shortYear = year.length === 4 ? year.slice(-2) : year;
  return `${paddedMonth}/${shortYear}`;
};

export const getCardBrandName = (brand: string): string => {
  const brands: Record<string, string> = {
    'visa': 'VISA',
    'mastercard': 'MASTERCARD',
    'amex': 'AMERICAN EXPRESS',
    'discover': 'DISCOVER',
    'unknown': 'CARTÃO'
  };
  
  return brands[brand] || 'CARTÃO';
};

export const maskCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) return cardNumber;
  
  const last4 = cleaned.slice(-4);
  return `•••• •••• •••• ${last4}`;
};