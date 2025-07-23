import React from 'react';

interface ConfirmacaoCancelamentoProps {
  userName: string;
  planName: string;
  cancelDate: string;
  accessUntil: string;
  refundAmount?: number;
  refundDate?: string;
  cancelReason?: string;
}

export const ConfirmacaoCancelamento: React.FC<ConfirmacaoCancelamentoProps> = ({
  userName,
  planName,
  cancelDate,
  accessUntil,
  refundAmount,
  refundDate,
  cancelReason
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#DC2626', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: '0', fontSize: '24px' }}>✅ DUO PASS Club</h1>
        <p style={{ color: '#FEE2E2', margin: '5px 0 0 0', fontSize: '14px' }}>Cancelamento Confirmado</p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px 20px' }}>
        <h2 style={{ color: '#1F2937', marginBottom: '20px' }}>Cancelamento Processado, {userName}</h2>
        
        <p style={{ color: '#4B5563', lineHeight: '1.6', marginBottom: '20px' }}>
          Confirmamos o cancelamento da sua assinatura do <strong>DUO PASS Club</strong>. 
          Lamentamos vê-lo partir, mas respeitamos sua decisão.
        </p>

        {/* Cancellation Details */}
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#991B1B', margin: '0 0 15px 0' }}>📋 Detalhes do Cancelamento</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#7F1D1D' }}>Data do cancelamento:</span>
            <strong style={{ color: '#991B1B' }}>{cancelDate}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#7F1D1D' }}>Plano cancelado:</span>
            <strong style={{ color: '#991B1B' }}>{planName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#7F1D1D' }}>Acesso até:</span>
            <strong style={{ color: '#991B1B' }}>{accessUntil}</strong>
          </div>
          {cancelReason && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#7F1D1D' }}>Motivo:</span>
              <strong style={{ color: '#991B1B' }}>{cancelReason}</strong>
            </div>
          )}
        </div>

        {/* Access Information */}
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#166534', margin: '0 0 15px 0' }}>🎭 Seu Acesso Continua</h3>
          <p style={{ color: '#15803D', lineHeight: '1.6', margin: '0 0 15px 0' }}>
            Você ainda pode aproveitar todas as funcionalidades do DUO PASS Club até <strong>{accessUntil}</strong>. 
            Isso inclui:
          </p>
          <ul style={{ color: '#15803D', margin: '0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Acesso a todas as experiências culturais</li>
            <li>Reservas em estabelecimentos parceiros</li>
            <li>Benefícios 2 por 1 em vigor</li>
            <li>Suporte ao cliente completo</li>
          </ul>
        </div>

        {/* Refund Information */}
        {refundAmount && refundAmount > 0 && (
          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
            <h3 style={{ color: '#1E40AF', margin: '0 0 15px 0' }}>💰 Informações de Reembolso</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#1E3A8A' }}>Valor do reembolso:</span>
              <strong style={{ color: '#1E40AF' }}>CHF {refundAmount.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ color: '#1E3A8A' }}>Previsão de processamento:</span>
              <strong style={{ color: '#1E40AF' }}>{refundDate}</strong>
            </div>
            <p style={{ color: '#1E3A8A', fontSize: '14px', margin: '0' }}>
              O reembolso será processado no mesmo método de pagamento utilizado na assinatura. 
              Você receberá uma confirmação por email quando o reembolso for processado.
            </p>
          </div>
        )}

        {/* What Happens Next */}
        <div style={{ backgroundColor: '#F3F4F6', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#374151', margin: '0 0 15px 0' }}>🔄 O que acontece agora?</h3>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#059669', fontSize: '16px', marginRight: '10px' }}>✅</span>
              <strong style={{ color: '#374151' }}>Cancelamento processado</strong>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 0 26px' }}>
              Sua assinatura foi cancelada e não haverá mais cobranças futuras.
            </p>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#F59E0B', fontSize: '16px', marginRight: '10px' }}>⏰</span>
              <strong style={{ color: '#374151' }}>Acesso mantido até {accessUntil}</strong>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 0 26px' }}>
              Continue aproveitando todas as funcionalidades até o final do período pago.
            </p>
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#8B5CF6', fontSize: '16px', marginRight: '10px' }}>🔄</span>
              <strong style={{ color: '#374151' }}>Reativação a qualquer momento</strong>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 0 26px' }}>
              Você pode reativar sua assinatura a qualquer momento através do seu dashboard.
            </p>
          </div>
        </div>

        {/* Feedback Request */}
        <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#92400E', margin: '0 0 15px 0' }}>💭 Seu Feedback é Importante</h3>
          <p style={{ color: '#78350F', lineHeight: '1.6', margin: '0 0 15px 0' }}>
            Gostaríamos de entender como podemos melhorar o DUO PASS Club. 
            Sua opinião nos ajuda a criar experiências culturais ainda mais incríveis.
          </p>
          <div style={{ textAlign: 'center' }}>
            <a href="https://duopassclub.ch/feedback?type=cancelamento" 
               style={{ 
                 backgroundColor: '#F59E0B', 
                 color: '#ffffff', 
                 padding: '10px 20px', 
                 textDecoration: 'none', 
                 borderRadius: '6px', 
                 fontWeight: 'bold',
                 display: 'inline-block',
                 fontSize: '14px'
               }}>
              Compartilhar Feedback
            </a>
          </div>
        </div>

        {/* Reactivation CTA */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <p style={{ color: '#6B7280', marginBottom: '15px' }}>
            Mudou de ideia? Você pode reativar sua assinatura a qualquer momento.
          </p>
          <a href="https://duopassclub.ch/dashboard" 
             style={{ 
               backgroundColor: '#8B5CF6', 
               color: '#ffffff', 
               padding: '12px 30px', 
               textDecoration: 'none', 
               borderRadius: '6px', 
               fontWeight: 'bold',
               display: 'inline-block'
             }}>
            Reativar Assinatura
          </a>
        </div>

        {/* Legal Notice */}
        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
          <h4 style={{ color: '#1E40AF', margin: '0 0 10px 0', fontSize: '14px' }}>⚖️ Informações Legais</h4>
          <p style={{ color: '#1E3A8A', margin: '0', fontSize: '13px', lineHeight: '1.5' }}>
            Este cancelamento está em conformidade com a legislação suíça de proteção ao consumidor. 
            Todos os seus dados pessoais continuam protegidos conforme nossa Política de Privacidade 
            e regulamentações GDPR/FADP.
          </p>
        </div>

        {/* Support */}
        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 10px 0' }}>
            Dúvidas sobre o cancelamento? Nossa equipe está aqui para ajudar!
          </p>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: '0' }}>
            📧 <a href="mailto:suporte@duopassclub.ch" style={{ color: '#8B5CF6' }}>suporte@duopassclub.ch</a> • 
            📱 WhatsApp: +41 XX XXX XX XX
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#F9FAFB', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#6B7280' }}>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>DUO PASS Club</strong> • Empresa Suíça • GDPR Compliant
        </p>
        <p style={{ margin: '0 0 10px 0' }}>
          <a href="https://duopassclub.ch/termos-de-uso" style={{ color: '#8B5CF6', textDecoration: 'none' }}>Termos de Uso</a> • 
          <a href="https://duopassclub.ch/privacidade" style={{ color: '#8B5CF6', textDecoration: 'none' }}>Política de Privacidade</a> • 
          <a href="https://duopassclub.ch/cancelamento" style={{ color: '#8B5CF6', textDecoration: 'none' }}>Cancelamento</a>
        </p>
        <p style={{ margin: '0', fontSize: '11px' }}>
          Obrigado por ter feito parte da comunidade DUO PASS Club. 
          Esperamos vê-lo novamente em breve! 🎭
        </p>
      </div>
    </div>
  );
};

export default ConfirmacaoCancelamento;