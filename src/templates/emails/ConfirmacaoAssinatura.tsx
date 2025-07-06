import React from 'react';

interface ConfirmacaoAssinaturaProps {
  userName: string;
  planName: string;
  price: number;
  nextBillingDate: string;
  trialDays?: number;
}

export const ConfirmacaoAssinatura: React.FC<ConfirmacaoAssinaturaProps> = ({
  userName,
  planName,
  price,
  nextBillingDate,
  trialDays
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#8B5CF6', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: '0', fontSize: '24px' }}>🎭 DUO PASS Club</h1>
        <p style={{ color: '#E5E7EB', margin: '5px 0 0 0', fontSize: '14px' }}>Experiências Culturais Autênticas • Sempre em Dupla</p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px 20px' }}>
        <h2 style={{ color: '#1F2937', marginBottom: '20px' }}>✅ Bem-vindo ao DUO PASS Club, {userName}!</h2>
        
        <p style={{ color: '#4B5563', lineHeight: '1.6', marginBottom: '20px' }}>
          Sua assinatura foi confirmada com sucesso! Agora você faz parte de uma comunidade que valoriza 
          experiências culturais autênticas e conexões reais.
        </p>

        {/* Plan Details */}
        <div style={{ backgroundColor: '#F3F4F6', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#374151', margin: '0 0 15px 0' }}>📋 Detalhes da sua Assinatura</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280' }}>Plano:</span>
            <strong style={{ color: '#1F2937' }}>{planName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280' }}>Valor mensal:</span>
            <strong style={{ color: '#1F2937' }}>CHF {price.toFixed(2)} (com IVA)</strong>
          </div>
          {trialDays && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#6B7280' }}>Teste grátis:</span>
              <strong style={{ color: '#059669' }}>{trialDays} dias</strong>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6B7280' }}>Próxima cobrança:</span>
            <strong style={{ color: '#8B5CF6' }}>{nextBillingDate}</strong>
          </div>
        </div>

        {/* Legal Summary */}
        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#1E40AF', margin: '0 0 15px 0' }}>⚖️ Resumo dos seus Direitos</h3>
          <ul style={{ color: '#1E3A8A', margin: '0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Direito de arrependimento de <strong>14 dias</strong> conforme lei suíça</li>
            <li>Cancelamento <strong>a qualquer momento</strong> sem multa</li>
            <li>Reembolso proporcional em caso de cancelamento</li>
            <li>Renovação automática (pode ser cancelada facilmente)</li>
            <li>Dados protegidos conforme <strong>GDPR</strong> e <strong>FADP</strong></li>
          </ul>
        </div>

        {/* Next Steps */}
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#166534', margin: '0 0 15px 0' }}>🚀 Próximos Passos</h3>
          <ol style={{ color: '#15803D', margin: '0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Acesse seu <strong>dashboard</strong> para explorar experiências</li>
            <li>Complete seu <strong>perfil cultural</strong> para recomendações personalizadas</li>
            <li>Convide um amigo para suas primeiras experiências em dupla</li>
            <li>Explore nossa curadoria de <strong>estabelecimentos parceiros</strong></li>
          </ol>
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a href="https://duopass.ch/dashboard" 
             style={{ 
               backgroundColor: '#8B5CF6', 
               color: '#ffffff', 
               padding: '12px 30px', 
               textDecoration: 'none', 
               borderRadius: '6px', 
               fontWeight: 'bold',
               display: 'inline-block'
             }}>
            Acessar Meu Dashboard
          </a>
        </div>

        {/* Support */}
        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 10px 0' }}>
            Dúvidas? Nossa equipe está aqui para ajudar!
          </p>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: '0' }}>
            📧 <a href="mailto:suporte@duopass.ch" style={{ color: '#8B5CF6' }}>suporte@duopass.ch</a> • 
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
          <a href="https://duopass.ch/termos-de-uso" style={{ color: '#8B5CF6', textDecoration: 'none' }}>Termos de Uso</a> • 
          <a href="https://duopass.ch/privacidade" style={{ color: '#8B5CF6', textDecoration: 'none' }}>Política de Privacidade</a> • 
          <a href="https://duopass.ch/cancelamento" style={{ color: '#8B5CF6', textDecoration: 'none' }}>Cancelamento</a>
        </p>
        <p style={{ margin: '0', fontSize: '11px' }}>
          Este email foi enviado para {userName}. Se você não solicitou esta assinatura, 
          <a href="mailto:suporte@duopass.ch" style={{ color: '#8B5CF6' }}>entre em contato conosco</a>.
        </p>
      </div>
    </div>
  );
};

export default ConfirmacaoAssinatura;