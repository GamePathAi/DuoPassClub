import React from 'react';

interface LembreteRenovacaoProps {
  userName: string;
  planName: string;
  price: number;
  renewalDate: string;
  experiencesUsed: number;
  experiencesTotal: number;
}

export const LembreteRenovacao: React.FC<LembreteRenovacaoProps> = ({
  userName,
  planName,
  price,
  renewalDate,
  experiencesUsed,
  experiencesTotal
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#F59E0B', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: '0', fontSize: '24px' }}>⏰ DUO PASS Club</h1>
        <p style={{ color: '#FEF3C7', margin: '5px 0 0 0', fontSize: '14px' }}>Lembrete de Renovação • 7 dias restantes</p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px 20px' }}>
        <h2 style={{ color: '#1F2937', marginBottom: '20px' }}>Olá {userName}! 👋</h2>
        
        <p style={{ color: '#4B5563', lineHeight: '1.6', marginBottom: '20px' }}>
          Sua assinatura do <strong>DUO PASS Club</strong> será renovada automaticamente em <strong>7 dias</strong>. 
          Queremos garantir que você esteja ciente e satisfeito com o serviço.
        </p>

        {/* Renewal Details */}
        <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#92400E', margin: '0 0 15px 0' }}>📅 Detalhes da Renovação</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#78350F' }}>Data da renovação:</span>
            <strong style={{ color: '#92400E' }}>{renewalDate}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#78350F' }}>Plano:</span>
            <strong style={{ color: '#92400E' }}>{planName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#78350F' }}>Valor a ser cobrado:</span>
            <strong style={{ color: '#92400E' }}>CHF {price.toFixed(2)} (com IVA)</strong>
          </div>
        </div>

        {/* Usage Summary */}
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#166534', margin: '0 0 15px 0' }}>📊 Seu Mês Cultural</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ color: '#15803D' }}>Experiências utilizadas:</span>
            <strong style={{ color: '#166534' }}>{experiencesUsed} de {experiencesTotal}</strong>
          </div>
          
          {/* Progress Bar */}
          <div style={{ backgroundColor: '#DCFCE7', borderRadius: '10px', height: '8px', marginBottom: '10px' }}>
            <div style={{ 
              backgroundColor: '#16A34A', 
              borderRadius: '10px', 
              height: '8px', 
              width: `${(experiencesUsed / experiencesTotal) * 100}%`,
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          
          <p style={{ color: '#15803D', fontSize: '14px', margin: '0' }}>
            {experiencesUsed === 0 ? 
              '🎭 Que tal começar a explorar nossa curadoria cultural?' :
              experiencesUsed < experiencesTotal ? 
                `🌟 Ainda restam ${experiencesTotal - experiencesUsed} experiências este mês!` :
                '🎉 Parabéns! Você aproveitou todas as experiências do mês!'
            }
          </p>
        </div>

        {/* Action Options */}
        <div style={{ backgroundColor: '#F3F4F6', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#374151', margin: '0 0 20px 0' }}>🎯 Suas Opções</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#059669', fontSize: '18px', marginRight: '10px' }}>✅</span>
              <strong style={{ color: '#374151' }}>Continuar aproveitando</strong>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 0 28px' }}>
              Não faça nada. Sua assinatura será renovada automaticamente e você continuará 
              explorando experiências culturais incríveis.
            </p>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#DC2626', fontSize: '18px', marginRight: '10px' }}>❌</span>
              <strong style={{ color: '#374151' }}>Cancelar assinatura</strong>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 0 28px' }}>
              Você pode cancelar a qualquer momento até a data de renovação. 
              Manterá acesso até o final do período atual.
            </p>
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#8B5CF6', fontSize: '18px', marginRight: '10px' }}>🔄</span>
              <strong style={{ color: '#374151' }}>Alterar plano</strong>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 0 28px' }}>
              Upgrade ou downgrade para um plano que melhor atenda suas necessidades culturais.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a href="https://duopassclub.ch/dashboard" 
             style={{ 
               backgroundColor: '#059669', 
               color: '#ffffff', 
               padding: '12px 25px', 
               textDecoration: 'none', 
               borderRadius: '6px', 
               fontWeight: 'bold',
               display: 'inline-block',
               marginRight: '10px'
             }}>
            Continuar Assinatura
          </a>
          <a href="https://duopassclub.ch/dashboard?tab=billing" 
             style={{ 
               backgroundColor: '#8B5CF6', 
               color: '#ffffff', 
               padding: '12px 25px', 
               textDecoration: 'none', 
               borderRadius: '6px', 
               fontWeight: 'bold',
               display: 'inline-block',
               marginRight: '10px'
             }}>
            Gerenciar Assinatura
          </a>
          <a href="https://duopassclub.ch/cancelamento" 
             style={{ 
               backgroundColor: '#DC2626', 
               color: '#ffffff', 
               padding: '12px 25px', 
               textDecoration: 'none', 
               borderRadius: '6px', 
               fontWeight: 'bold',
               display: 'inline-block'
             }}>
            Cancelar
          </a>
        </div>

        {/* Legal Notice */}
        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
          <h4 style={{ color: '#1E40AF', margin: '0 0 10px 0', fontSize: '14px' }}>⚖️ Seus Direitos (Lei Suíça)</h4>
          <ul style={{ color: '#1E3A8A', margin: '0', paddingLeft: '20px', fontSize: '13px', lineHeight: '1.5' }}>
            <li>Cancelamento sem multa até a data de renovação</li>
            <li>Reembolso proporcional se cancelar após a renovação</li>
            <li>Direito de arrependimento de 14 dias para novos usuários</li>
            <li>Transparência total de preços e taxas</li>
          </ul>
        </div>

        {/* Support */}
        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 10px 0' }}>
            Dúvidas sobre sua assinatura? Estamos aqui para ajudar!
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
          Para não receber mais lembretes de renovação, 
          <a href="https://duopassclub.ch/dashboard?tab=privacy" style={{ color: '#8B5CF6' }}>gerencie suas preferências</a>.
        </p>
      </div>
    </div>
  );
};

export default LembreteRenovacao;