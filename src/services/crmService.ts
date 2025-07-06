import { supabase } from '../lib/supabaseConfig';
import { NotificationService } from './notificationService';
// import { GamificationService } from './gamificationService';

interface CRMContact {
  id: string;
  type: 'user' | 'merchant' | 'lead';
  email: string;
  name: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  tags: string[];
  segment: string;
  source: string;
  last_interaction: string;
  lifetime_value: number;
  engagement_score: number;
  preferences: Record<string, string | number | boolean>;
  metadata: Record<string, string | number | boolean>;
  created_at: string;
  updated_at: string;
}

interface CRMInteraction {
  id: string;
  contact_id: string;
  type: 'email' | 'sms' | 'call' | 'meeting' | 'offer_view' | 'offer_redeem' | 'support_ticket';
  channel: string;
  subject?: string;
  content?: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'failed';
  metadata: Record<string, string | number | boolean>;
  created_at: string;
  created_by?: string;
}

interface CRMSegment {
  id: string;
  name: string;
  description: string;
  criteria: Record<string, string | number | boolean>;
  contact_count: number;
  is_dynamic: boolean;
  created_at: string;
  updated_at: string;
}

interface CRMCampaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'multi_channel';
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  segment_ids: string[];
  template_id?: string;
  subject?: string;
  content: string;
  scheduled_at?: string;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  conversion_count: number;
  created_at: string;
  created_by: string;
}

// interface CRMTemplate {
//   id: string;
//   name: string;
//   type: 'email' | 'sms' | 'push';
//   subject?: string;
//   content: string;
//   variables: string[];
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
// }

interface CRMAnalytics {
  total_contacts: number;
  active_contacts: number;
  new_contacts_this_month: number;
  engagement_rate: number;
  conversion_rate: number;
  avg_lifetime_value: number;
  top_segments: Array<{
    name: string;
    count: number;
    engagement_rate: number;
  }>;
  campaign_performance: Array<{
    name: string;
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  }>;
}

export class CRMService {
  // Criar ou atualizar contato
  static async upsertContact(contactData: Partial<CRMContact>): Promise<{ success: boolean; contact?: CRMContact; error?: string }> {
    try {
      const { data: contact, error } = await supabase
        .from('crm_contacts')
        .upsert({
          ...contactData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Erro ao salvar contato' };
      }

      // Atualizar score de engajamento
      await this.updateEngagementScore(contact.id);

      return { success: true, contact };
    } catch (error) {
      console.error('Erro ao criar/atualizar contato:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  // Buscar contatos com filtros
  static async getContacts(filters: {
    type?: string;
    status?: string;
    segment?: string;
    tags?: string[];
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<CRMContact[]> {
    try {
      let query = supabase
        .from('crm_contacts')
        .select('*');

      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.segment) {
        query = query.eq('segment', filters.segment);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      query = query.order('updated_at', { ascending: false });

      const { data: contacts } = await query;
      return contacts || [];
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      return [];
    }
  }

  // Criar segmento
  static async createSegment(segmentData: Omit<CRMSegment, 'id' | 'contact_count' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; segment?: CRMSegment; error?: string }> {
    try {
      const { data: segment, error } = await supabase
        .from('crm_segments')
        .insert({
          ...segmentData,
          contact_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Erro ao criar segmento' };
      }

      // Atualizar contagem de contatos
      await this.updateSegmentCount(segment.id);

      return { success: true, segment };
    } catch (error) {
      console.error('Erro ao criar segmento:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  // Segmentação automática baseada em comportamento
  static async autoSegmentContacts(): Promise<void> {
    try {
      // Segmento: Usuários VIP (alto valor de vida)
      await this.updateContactsSegment(
        { lifetime_value: { gte: 500 } },
        'vip_users'
      );

      // Segmento: Usuários ativos (alta pontuação de engajamento)
      await this.updateContactsSegment(
        { engagement_score: { gte: 80 } },
        'active_users'
      );

      // Segmento: Usuários em risco (baixo engajamento)
      await this.updateContactsSegment(
        { engagement_score: { lte: 30 } },
        'at_risk_users'
      );

      // Segmento: Novos usuários (criados nos últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      await this.updateContactsSegment(
        { created_at: { gte: thirtyDaysAgo.toISOString() } },
        'new_users'
      );

      console.log('Segmentação automática concluída');
    } catch (error) {
      console.error('Erro na segmentação automática:', error);
    }
  }

  // Atualizar segmento de contatos
  private static async updateContactsSegment(
    criteria: Record<string, string | number | boolean | { gte?: number; lte?: number }>,
    segment: string
  ): Promise<void> {
    try {
      let query = supabase.from('crm_contacts').select('id');

      // Aplicar critérios (implementação simplificada)
      Object.entries(criteria).forEach(([field, condition]) => {
        if (typeof condition === 'object') {
          if (condition.gte) {
            query = query.gte(field, condition.gte);
          }
          if (condition.lte) {
            query = query.lte(field, condition.lte);
          }
        } else {
          query = query.eq(field, condition);
        }
      });

      const { data: contacts } = await query;
      
      if (contacts && contacts.length > 0) {
        const contactIds = contacts.map(c => c.id);
        
        await supabase
          .from('crm_contacts')
          .update({ segment })
          .in('id', contactIds);
      }
    } catch (error) {
      console.error('Erro ao atualizar segmento:', error);
    }
  }

  // Registrar interação
  static async recordInteraction(
    contactId: string,
    interactionData: Omit<CRMInteraction, 'id' | 'contact_id' | 'created_at'>
  ): Promise<void> {
    try {
      await supabase
        .from('crm_interactions')
        .insert({
          contact_id: contactId,
          ...interactionData,
          created_at: new Date().toISOString()
        });

      // Atualizar última interação do contato
      await supabase
        .from('crm_contacts')
        .update({
          last_interaction: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', contactId);

      // Atualizar score de engajamento
      await this.updateEngagementScore(contactId);
    } catch (error) {
      console.error('Erro ao registrar interação:', error);
    }
  }

  // Atualizar score de engajamento
  static async updateEngagementScore(contactId: string): Promise<void> {
    try {
      // Buscar interações dos últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: interactions } = await supabase
        .from('crm_interactions')
        .select('type, status')
        .eq('contact_id', contactId)
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (!interactions) return;

      // Calcular score baseado nas interações
      let score = 0;
      interactions.forEach(interaction => {
        switch (interaction.type) {
          case 'offer_redeem':
            score += 20;
            break;
          case 'offer_view':
            score += 5;
            break;
          case 'email':
            if (interaction.status === 'opened') score += 3;
            if (interaction.status === 'clicked') score += 8;
            break;
          case 'sms':
            if (interaction.status === 'delivered') score += 2;
            break;
          default:
            score += 1;
        }
      });

      // Normalizar score (0-100)
      const normalizedScore = Math.min(100, Math.max(0, score));

      await supabase
        .from('crm_contacts')
        .update({ engagement_score: normalizedScore })
        .eq('id', contactId);
    } catch (error) {
      console.error('Erro ao atualizar score de engajamento:', error);
    }
  }

  // Criar campanha
  static async createCampaign(
    campaignData: Omit<CRMCampaign, 'id' | 'sent_count' | 'delivered_count' | 'opened_count' | 'clicked_count' | 'conversion_count' | 'created_at'>
  ): Promise<{ success: boolean; campaign?: CRMCampaign; error?: string }> {
    try {
      const { data: campaign, error } = await supabase
        .from('crm_campaigns')
        .insert({
          ...campaignData,
          sent_count: 0,
          delivered_count: 0,
          opened_count: 0,
          clicked_count: 0,
          conversion_count: 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Erro ao criar campanha' };
      }

      return { success: true, campaign };
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  // Executar campanha
  static async executeCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Buscar campanha
      const { data: campaign } = await supabase
        .from('crm_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (!campaign) {
        return { success: false, error: 'Campanha não encontrada' };
      }

      // Buscar contatos dos segmentos
      const { data: contacts } = await supabase
        .from('crm_contacts')
        .select('*')
        .in('segment', campaign.segment_ids)
        .eq('status', 'active');

      if (!contacts || contacts.length === 0) {
        return { success: false, error: 'Nenhum contato encontrado nos segmentos' };
      }

      // Atualizar status da campanha
      await supabase
        .from('crm_campaigns')
        .update({ status: 'running' })
        .eq('id', campaignId);

      // Enviar mensagens
      let sentCount = 0;
      for (const contact of contacts) {
        try {
          await this.sendCampaignMessage(campaign, contact);
          sentCount++;

          // Registrar interação
          await this.recordInteraction(contact.id, {
            type: campaign.type as 'email' | 'sms' | 'call' | 'meeting' | 'offer_view' | 'offer_redeem' | 'support_ticket',
            channel: 'campaign',
            subject: campaign.subject,
            content: campaign.content,
            status: 'sent',
            metadata: { campaign_id: campaignId }
          });
        } catch (error) {
          console.error(`Erro ao enviar para ${contact.email}:`, error);
        }
      }

      // Atualizar contadores da campanha
      await supabase
        .from('crm_campaigns')
        .update({
          sent_count: sentCount,
          status: 'completed'
        })
        .eq('id', campaignId);

      return { success: true };
    } catch (error) {
      console.error('Erro ao executar campanha:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  // Enviar mensagem da campanha
  private static async sendCampaignMessage(
    campaign: CRMCampaign,
    contact: CRMContact
  ): Promise<void> {
    try {
      // Personalizar conteúdo
      let personalizedContent = campaign.content;
      personalizedContent = personalizedContent.replace('{{name}}', contact.name);
      personalizedContent = personalizedContent.replace('{{email}}', contact.email);

      switch (campaign.type) {
        case 'email':
          // Simular envio de email
          console.log(`Email enviado para ${contact.email}: ${campaign.subject}`);
          break;
        
        case 'sms':
          // Simular envio de SMS
          if (contact.phone) {
            console.log(`SMS enviado para ${contact.phone}: ${personalizedContent}`);
          }
          break;
        
        case 'push':
          // Enviar notificação push
          if (contact.type === 'user') {
            await NotificationService.create({
              user_id: contact.id,
              type: 'marketing',
              title: campaign.subject || 'Nova oferta!',
              message: personalizedContent
            });
          }
          break;
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  // Atualizar contagem de segmento
  private static async updateSegmentCount(segmentId: string): Promise<void> {
    try {
      const { data: segment } = await supabase
        .from('crm_segments')
        .select('criteria')
        .eq('id', segmentId)
        .single();

      if (!segment) return;

      // Contar contatos que atendem aos critérios
      const { count } = await supabase
        .from('crm_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('segment', segmentId);

      await supabase
        .from('crm_segments')
        .update({
          contact_count: count || 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', segmentId);
    } catch (error) {
      console.error('Erro ao atualizar contagem do segmento:', error);
    }
  }

  // Obter analytics do CRM
  static async getAnalytics(): Promise<CRMAnalytics> {
    try {
      // Buscar estatísticas básicas
      const { count: totalContacts } = await supabase
        .from('crm_contacts')
        .select('*', { count: 'exact', head: true });

      const { count: activeContacts } = await supabase
        .from('crm_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: newContacts } = await supabase
        .from('crm_contacts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Calcular métricas
      const { data: contacts } = await supabase
        .from('crm_contacts')
        .select('engagement_score, lifetime_value, segment');

      const avgEngagement = contacts?.reduce((sum, c) => sum + (c.engagement_score || 0), 0) / (contacts?.length || 1);
      const avgLifetimeValue = contacts?.reduce((sum, c) => sum + (c.lifetime_value || 0), 0) / (contacts?.length || 1);

      // Top segmentos
      const segmentCounts = contacts?.reduce((acc: Record<string, number>, contact) => {
        acc[contact.segment] = (acc[contact.segment] || 0) + 1;
        return acc;
      }, {}) || {};

      const topSegments = Object.entries(segmentCounts)
        .map(([name, count]) => ({
          name,
          count,
          engagement_rate: avgEngagement // Simplificado
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        total_contacts: totalContacts || 0,
        active_contacts: activeContacts || 0,
        new_contacts_this_month: newContacts || 0,
        engagement_rate: avgEngagement || 0,
        conversion_rate: 5.2, // Simulado
        avg_lifetime_value: avgLifetimeValue || 0,
        top_segments: topSegments,
        campaign_performance: [] // Simplificado
      };
    } catch (error) {
      console.error('Erro ao obter analytics:', error);
      return {
        total_contacts: 0,
        active_contacts: 0,
        new_contacts_this_month: 0,
        engagement_rate: 0,
        conversion_rate: 0,
        avg_lifetime_value: 0,
        top_segments: [],
        campaign_performance: []
      };
    }
  }

  // Automação: Welcome series para novos usuários
  static async triggerWelcomeSeries(userId: string): Promise<void> {
    try {
      const welcomeMessages = [
        {
          delay: 0, // Imediato
          title: '🎉 Bem-vindo ao DuoPass Club!',
          message: 'Obrigado por se juntar a nós! Descubra ofertas incríveis na sua região.'
        },
        {
          delay: 24 * 60 * 60 * 1000, // 24 horas
          title: '💡 Dica: Como usar o DuoPass',
          message: 'Explore ofertas próximas a você e acumule pontos a cada resgate!'
        },
        {
          delay: 7 * 24 * 60 * 60 * 1000, // 7 dias
          title: '🎁 Oferta especial para você!',
          message: 'Como novo membro, você tem 20% de desconto na primeira assinatura!'
        }
      ];

      for (const message of welcomeMessages) {
        setTimeout(async () => {
          await NotificationService.create({
            user_id: userId,
            type: 'welcome',
            title: message.title,
            message: message.message
          });

          await this.recordInteraction(userId, {
            type: 'email',
            channel: 'automation',
            subject: message.title,
            content: message.message,
            status: 'sent',
            metadata: { automation: 'welcome_series' }
          });
        }, message.delay);
      }
    } catch (error) {
      console.error('Erro ao disparar série de boas-vindas:', error);
    }
  }

  // Automação: Win-back para usuários inativos
  static async triggerWinBackCampaign(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Buscar usuários inativos
      const { data: inactiveUsers } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('type', 'user')
        .eq('status', 'active')
        .lt('last_interaction', thirtyDaysAgo.toISOString())
        .lte('engagement_score', 30);

      if (!inactiveUsers) return;

      for (const user of inactiveUsers) {
        // Enviar notificação de win-back
        await NotificationService.create({
          user_id: user.id,
          type: 'winback',
          title: '😢 Sentimos sua falta!',
          message: 'Volte e descubra as novas ofertas que preparamos para você. Oferta especial te aguarda!'
        });

        // Registrar interação
        await this.recordInteraction(user.id, {
          type: 'email',
          channel: 'automation',
          subject: 'Sentimos sua falta!',
          content: 'Campanha de reativação',
          status: 'sent',
          metadata: { automation: 'win_back' }
        });

        // Atualizar segmento
        await supabase
          .from('crm_contacts')
          .update({ segment: 'win_back_target' })
          .eq('id', user.id);
      }

      console.log(`Campanha win-back enviada para ${inactiveUsers.length} usuários`);
    } catch (error) {
      console.error('Erro ao executar campanha win-back:', error);
    }
  }

  // Sincronizar dados do usuário com CRM
  static async syncUserToCRM(userId: string, userData: Record<string, unknown>): Promise<void> {
    try {
      await this.upsertContact({
        id: userId,
        type: 'user',
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        phone: userData.phone,
        status: 'active',
        tags: ['app_user'],
        segment: 'new_users',
        source: 'app_registration',
        last_interaction: new Date().toISOString(),
        lifetime_value: 0,
        engagement_score: 50,
        preferences: userData.preferences || {},
        metadata: {
          registration_date: userData.created_at,
          subscription_status: userData.subscription_status
        }
      });

      // Disparar série de boas-vindas
      await this.triggerWelcomeSeries(userId);
    } catch (error) {
      console.error('Erro ao sincronizar usuário com CRM:', error);
    }
  }
}