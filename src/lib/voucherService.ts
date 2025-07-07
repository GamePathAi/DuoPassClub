import { UsageReport } from '../types';
import QRCode from 'qrcode';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';

export class VoucherService {
  // Gerar voucher único para um parceiro - MOCK VERSION
  static async generateVoucher(userId: string, partnerId: string): Promise<unknown> {
    try {
      console.log('🎫 Mock: Gerando voucher...', { userId, partnerId });
      
      // Verificar se já existe voucher ativo
      const existingVoucher = localStorage.getItem(`voucher_${userId}_${partnerId}`);
      if (existingVoucher) {
        console.log('⚠️ Mock: Usuário já possui voucher ativo para este parceiro');
        throw new Error('Usuário já possui voucher ativo para este parceiro');
      }
      
      // Gerar voucher mock
      const voucherId = `voucher_${Date.now()}`;
      const voucherCode = `DUO${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      
      // Gerar QR Code data
      const qrCodeData = JSON.stringify({
        voucherId,
        userId,
        partnerId,
        code: voucherCode,
        timestamp: new Date().toISOString()
      });
      
      // Gerar QR Code URL
      const qrCodeUrl = await QRCode.toDataURL(qrCodeData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      const mockVoucher = {
        id: voucherId,
        voucher_code: voucherCode,
        user_id: userId,
        partner_id: partnerId,
        merchant_id: partnerId, // Para compatibilidade
        status: 'active',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
        qr_code_data: qrCodeUrl,
        cultural_experience: {
          experience_name: 'Experiência DuoPass',
          duo_price: 60
        },
        cultural_partners: {
          id: partnerId,
          business_name: 'Parceiro Cultural',
          contact_name: 'Contato do Parceiro',
          email: 'contato@parceiro.com',
          address: {
            street: 'Rua Cultural, 123',
            city: 'Genebra',
            state: 'Genebra',
            zipcode: '1200'
          }
        }
      };
      
      // Salvar no localStorage para persistir
      localStorage.setItem(`voucher_${userId}_${partnerId}`, JSON.stringify(mockVoucher));
      localStorage.setItem(`active_voucher_${voucherId}`, JSON.stringify(mockVoucher));
      
      console.log('✅ Mock: Voucher gerado com sucesso!', mockVoucher);
      
      return mockVoucher;
      
    } catch (error) {
      console.error('❌ Erro ao gerar voucher mock:', error);
      throw error;
    }
  }

  // Verificar se usuário pode gerar voucher para um parceiro - MOCK VERSION
  static async canGenerateVoucher(userId: string, partnerId: string): Promise<boolean> {
    try {
      console.log('🔍 Mock: Verificando se pode gerar voucher...', { userId, partnerId });
      
      // Simular verificação de voucher existente
      const existingVoucher = localStorage.getItem(`voucher_${userId}_${partnerId}`);
      
      const canGenerate = !existingVoucher;
      console.log('🔍 Mock: Pode gerar voucher?', canGenerate);
      
      return canGenerate; // true se não existe voucher
    } catch (error) {
      console.error('Erro ao verificar voucher:', error);
      return true; // Em caso de erro, permite gerar
    }
  }

  // Buscar voucher ativo - MOCK VERSION
  static async getActiveVoucher(voucherId: string) {
    try {
      const voucher = localStorage.getItem(`active_voucher_${voucherId}`);
      return voucher ? JSON.parse(voucher) : null;
    } catch (error) {
      console.error('Erro ao buscar voucher ativo:', error);
      return null;
    }
  }

  // Buscar vouchers do usuário - MOCK VERSION
  static async getUserVouchers(userId: string): Promise<unknown[]> {
    try {
      const vouchers = [];
      
      // Procurar todos os vouchers do usuário no localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(`voucher_${userId}_`)) {
          const voucher = localStorage.getItem(key);
          if (voucher) {
            vouchers.push(JSON.parse(voucher));
          }
        }
      }
      
      return vouchers;
    } catch (error) {
      console.error('Erro ao buscar vouchers do usuário:', error);
      return [];
    }
  }

  // Validar voucher pelo QR Code - MOCK VERSION
  static async validateVoucher(qrCodeData: string, merchantId: string, location: string): Promise<{ success: boolean; message: string; voucher?: unknown }> {
    try {
      const qrData = JSON.parse(qrCodeData);
      
      // Verificar se o QR Code é válido
      if (!qrData.voucherId || !qrData.userId || !qrData.partnerId || !qrData.code) {
        return { success: false, message: 'QR Code inválido' };
      }

      // Verificar se o voucher é para este comerciante
      if (qrData.partnerId !== merchantId) {
        return { success: false, message: 'Voucher não é válido para este estabelecimento' };
      }

      // Buscar voucher no localStorage
      const voucher = localStorage.getItem(`active_voucher_${qrData.voucherId}`);
      if (!voucher) {
        return { success: false, message: 'Voucher não encontrado' };
      }

      const voucherData = JSON.parse(voucher);

      // Verificar status do voucher
      if (voucherData.status === 'used') {
        return { success: false, message: 'Voucher já foi utilizado' };
      }

      if (voucherData.status === 'expired' || new Date(voucherData.expires_at) < new Date()) {
        return { success: false, message: 'Voucher expirado' };
      }

      // Marcar voucher como usado
      voucherData.status = 'used';
      voucherData.used_at = new Date().toISOString();
      voucherData.used_location = location;
      
      localStorage.setItem(`active_voucher_${qrData.voucherId}`, JSON.stringify(voucherData));

      return { 
        success: true, 
        message: 'Voucher validado com sucesso!', 
        voucher: voucherData
      };
    } catch (error) {
      console.error('Erro ao validar voucher:', error);
      return { success: false, message: 'Erro interno do sistema' };
    }
  }

  // Gerar relatório de uso - MOCK VERSION
  static async generateUsageReport(period: 'weekly' | 'monthly', date: Date = new Date()): Promise<UsageReport | null> {
    try {
      let startDate: Date;
      let endDate: Date;

      if (period === 'weekly') {
        startDate = startOfWeek(date);
        endDate = endOfWeek(date);
      } else {
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
      }

      // Mock data para relatório
      return {
        period,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        total_vouchers_used: 5,
        unique_customers: 3,
        merchant_stats: [
          {
            merchant_id: 'mock-merchant-1',
            business_name: 'Café das Letras',
            total_uses: 3,
            unique_customers: 2
          }
        ],
        top_customers: [
          {
            user_id: 'mock-user-1',
            full_name: 'João Silva',
            total_uses: 2
          }
        ]
      };
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      return null;
    }
  }

  // Gerar código único do voucher - MOCK VERSION
  private static generateVoucherCode(partnerId: string): string {
    const prefix = 'DUO';
    const partnerCode = partnerId.substring(0, 3).toUpperCase();
    const randomNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `${prefix}-${partnerCode}-${randomNumber}`;
  }
}