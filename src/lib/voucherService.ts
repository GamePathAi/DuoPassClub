import { supabase } from './supabase';
import { Voucher, UsageReport } from '../types';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';

export class VoucherService {
  // Gerar voucher único para um parceiro
  static async generateVoucher(userId: string, merchantId: string): Promise<Voucher | null> {
    try {
      // Verificar se já existe voucher ativo para este usuário e parceiro
      const { data: existingVoucher } = await supabase
        .from('vouchers')
        .select('*')
        .eq('user_id', userId)
        .eq('merchant_id', merchantId)
        .eq('status', 'active')
        .single();

      if (existingVoucher) {
        throw new Error('Usuário já possui voucher ativo para este parceiro');
      }

      // Gerar código único
      const voucherCode = this.generateVoucherCode(merchantId);
      const qrCodeData = JSON.stringify({
        voucherId: uuidv4(),
        userId,
        merchantId,
        code: voucherCode,
        timestamp: new Date().toISOString()
      });

      // Gerar QR Code
      const qrCodeUrl = await QRCode.toDataURL(qrCodeData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Criar voucher no banco
      const { data: voucher, error } = await supabase
        .from('vouchers')
        .insert({
          user_id: userId,
          merchant_id: merchantId,
          voucher_code: voucherCode,
          qr_code_data: qrCodeUrl,
          status: 'active',
          expires_at: addDays(new Date(), 30).toISOString() // Válido por 30 dias
        })
        .select(`
          *,
          user:users(full_name, email),
          merchant:users!vouchers_merchant_id_fkey(full_name as business_name, email as contact_info)
        `)
        .single();

      if (error) throw error;
      return voucher;
    } catch (error) {
      console.error('Erro ao gerar voucher:', error);
      return null;
    }
  }

  // Validar voucher pelo QR Code
  static async validateVoucher(qrCodeData: string, merchantId: string, location: string): Promise<{ success: boolean; message: string; voucher?: Voucher }> {
    try {
      const qrData = JSON.parse(qrCodeData);
      
      // Verificar se o QR Code é válido
      if (!qrData.voucherId || !qrData.userId || !qrData.merchantId || !qrData.code) {
        return { success: false, message: 'QR Code inválido' };
      }

      // Verificar se o voucher é para este comerciante
      if (qrData.merchantId !== merchantId) {
        return { success: false, message: 'Voucher não é válido para este estabelecimento' };
      }

      // Buscar voucher no banco
      const { data: voucher, error } = await supabase
        .from('vouchers')
        .select(`
          *,
          user:users(full_name, email),
          merchant:users!vouchers_merchant_id_fkey(full_name as business_name, email as contact_info)
        `)
        .eq('voucher_code', qrData.code)
        .eq('user_id', qrData.userId)
        .eq('merchant_id', qrData.merchantId)
        .single();

      if (error || !voucher) {
        return { success: false, message: 'Voucher não encontrado' };
      }

      // Verificar status do voucher
      if (voucher.status === 'used') {
        return { success: false, message: 'Voucher já foi utilizado' };
      }

      if (voucher.status === 'expired' || new Date(voucher.expires_at) < new Date()) {
        return { success: false, message: 'Voucher expirado' };
      }

      // Marcar voucher como usado
      const { error: updateError } = await supabase
        .from('vouchers')
        .update({
          status: 'used',
          used_at: new Date().toISOString(),
          used_location: location
        })
        .eq('id', voucher.id);

      if (updateError) throw updateError;

      // Registrar uso
      await supabase.from('voucher_usage').insert({
        voucher_id: voucher.id,
        merchant_id: merchantId,
        user_id: voucher.user_id,
        used_at: new Date().toISOString(),
        location,
        validated_by: merchantId
      });

      return { 
        success: true, 
        message: 'Voucher validado com sucesso!', 
        voucher: { ...voucher, status: 'used', used_at: new Date().toISOString(), used_location: location }
      };
    } catch (error) {
      console.error('Erro ao validar voucher:', error);
      return { success: false, message: 'Erro interno do sistema' };
    }
  }

  // Buscar vouchers do usuário
  static async getUserVouchers(userId: string): Promise<Voucher[]> {
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select(`
          *,
          merchant:users!vouchers_merchant_id_fkey(full_name as business_name, email as contact_info)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar vouchers:', error);
      return [];
    }
  }

  // Gerar relatório de uso
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

      // Buscar usos no período
      const { data: usages, error } = await supabase
        .from('voucher_usage')
        .select(`
          *,
          voucher:vouchers(*),
          user:users!voucher_usage_user_id_fkey(full_name, email),
          merchant:users!voucher_usage_merchant_id_fkey(full_name as business_name)
        `)
        .gte('used_at', startDate.toISOString())
        .lte('used_at', endDate.toISOString());

      if (error) throw error;

      // Processar estatísticas
      const merchantStats = new Map();
      const customerStats = new Map();
      const uniqueCustomers = new Set();

      usages?.forEach(usage => {
        const merchantId = usage.merchant_id;
        const userId = usage.user_id;
        
        uniqueCustomers.add(userId);

        // Stats por comerciante
        if (!merchantStats.has(merchantId)) {
          merchantStats.set(merchantId, {
            merchant_id: merchantId,
            business_name: usage.merchant?.business_name || 'N/A',
            total_uses: 0,
            unique_customers: new Set()
          });
        }
        const merchantStat = merchantStats.get(merchantId);
        merchantStat.total_uses++;
        merchantStat.unique_customers.add(userId);

        // Stats por cliente
        if (!customerStats.has(userId)) {
          customerStats.set(userId, {
            user_id: userId,
            full_name: usage.user?.full_name || 'N/A',
            total_uses: 0
          });
        }
        customerStats.get(userId).total_uses++;
      });

      // Converter para arrays e ordenar
      const merchantStatsArray = Array.from(merchantStats.values()).map(stat => ({
        ...stat,
        unique_customers: stat.unique_customers.size
      })).sort((a, b) => b.total_uses - a.total_uses);

      const topCustomers = Array.from(customerStats.values())
        .sort((a, b) => b.total_uses - a.total_uses)
        .slice(0, 10);

      return {
        period,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        total_vouchers_used: usages?.length || 0,
        unique_customers: uniqueCustomers.size,
        merchant_stats: merchantStatsArray,
        top_customers: topCustomers
      };
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      return null;
    }
  }

  // Gerar código único do voucher
  private static generateVoucherCode(merchantId: string): string {
    const prefix = 'DUO';
    const merchantCode = merchantId.substring(0, 3).toUpperCase();
    const randomNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `${prefix}-${merchantCode}-${randomNumber}`;
  }

  // Verificar se usuário pode gerar voucher para um parceiro
  static async canGenerateVoucher(userId: string, merchantId: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('vouchers')
        .select('id')
        .eq('user_id', userId)
        .eq('merchant_id', merchantId)
        .eq('status', 'active')
        .single();

      return !data; // Pode gerar se não existe voucher ativo
    } catch {
      return true; // Se der erro, assume que pode gerar
    }
  }
}