import React from 'react';

interface ReembolsoProcessadoProps {
  userName: string;
  refundAmount: number;
  originalAmount: number;
  refundDate: string;
  transactionId: string;
  paymentMethod: string;
  refundReason: string;
  processingDays: number;
}

export const ReembolsoProcessado: React.FC<ReembolsoProcessadoProps> = ({
  userName,
  refundAmount,
  originalAmount,
  refundDate,
  transactionId,
  paymentMethod,
  refundReason,
  processingDays
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#059669', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: '0', fontSize: '24px' }}>💰 DUO PASS Club</h1>
        <p style={{ color: '#D1FAE5', margin: '5px 0 0 0', fontSize: '14px' }}>Reembolso Processado com Sucesso</p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px 20px' }}>
        <h2 style={{ color: '#1F2937', marginBottom: '20px' }}>✅ Reembolso Confirmado, {userName}!</h2>
        
        <p style={{ color: '#4B5563', lineHeight: '1.6', marginBottom: '20px' }}>
          Seu reembolso foi processado com sucesso! O valor já foi enviado para seu método de pagamento 
          e deve aparecer em sua conta nos próximos dias úteis.
        </p>

        {/* Refund Details */}
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #BBF7D0', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#166534', margin: '0 0 15px 0' }}>💳 Detalhes do Reembolso</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#15803D' }}>Valor reembolsado:</span>
            <strong style={{ color: '#166534', fontSize: '18px' }}>CHF {refundAmount.toFixed(2)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#15803D' }}>Valor original:</span>
            <span style={{ color: '#166534' }}>CHF {originalAmount.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#15803D' }}>Data do processamento:</span>
            <strong style={{ color: '#166534' }}>{refundDate}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#15803D' }}>ID da transação:</span>
            <code style={{ color: '#166534', backgroundColor: '#F0FDF4', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
              {transactionId}
            </code>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#15803D' }}>Método de pagamento:</span>
            <span style={{ color: '#166534' }}>{paymentMethod}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#15803D' }}>Motivo:</span>
            <span style={{ color: '#166534' }}>{refundReason}</span>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#166534', margin: '0 0 15px 0' }}>⏰ Quando o dinheiro chegará?</h3>
          
          <div style={{ position: 'relative', paddingLeft: '30px' }}>
            {/* Timeline Item 1 */}
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                left: '-20px', 
                top: '2px', 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#059669', 
                borderRadius: '50%'
              }}></div>
              <div style={{ fontWeight: 'bold', color: '#166534', marginBottom: '5px' }}>✅ Processado hoje</div>
              <div style={{ color: '#15803D', fontSize: '14px' }}>Reembolso enviado para {paymentMethod}</div>
            </div>
            
            {/* Timeline Item 2 */}
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                left: '-20px', 
                top: '2px', 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#F59E0B', 
                borderRadius: '50%'
              }}></div>
              <div style={{ fontWeight: 'bold', color: '#92400E', marginBottom: '5px' }}>⏳ Em processamento</div>
              <div style={{ color: '#78350F', fontSize: '14px' }}>Pode levar {processingDays} dias úteis para aparecer</div>
            </div>
            
            {/* Timeline Item 3 */}
            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                left: '-20px', 
                top: '2px', 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#D1D5DB', 
                borderRadius: '50%'
              }}></div>
              <div style={{ fontWeight: 'bold', color: '#6B7280', marginBottom: '5px' }}>💰 Disponível na sua conta</div>
              <div style={{ color: '#6B7280', fontSize: '14px' }}>Valor creditado conforme política do seu banco</div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#92400E', margin: '0 0 15px 0' }}>⚠️ Informações Importantes</h3>
          <ul style={{ color: '#78350F', margin: '0', paddingLeft: '20px', lineHeight: '1.6', fontSize: '14px' }}>
            <li>O prazo pode variar conforme a política do seu banco ou operadora de cartão</li>
            <li>Finais de semana e feriados podem afetar o tempo de processamento</li>
            <li>Se não receber o reembolso em {processingDays + 2} dias úteis, entre em contato conosco</li>
            <li>Guarde este email como comprovante da transação</li>
          </ul>
        </div>

        {/* Refund Breakdown */}
        {refundAmount !== originalAmount && (
          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
            <h3 style={{ color: '#1E40AF', margin: '0 0 15px 0' }}>📊 Cálculo do Reembolso</h3>
            <div style={{ space: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #DBEAFE' }}>
                <span style={{ color: '#1E3A8A' }}>Valor original da assinatura:</span>
                <span style={{ color: '#1E40AF' }}>CHF {originalAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #DBEAFE' }}>
                <span style={{ color: '#1E3A8A' }}>Período utilizado:</span>
                <span style={{ color: '#1E40AF' }}>Proporcional</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 'bold' }}>
                <span style={{ color: '#1E40AF' }}>Valor do reembolso:</span>
                <span style={{ color: '#1E40AF' }}>CHF {refundAmount.toFixed(2)}</span>
              </div>
            </div>
            <p style={{ color: '#1E3A8A', fontSize: '13px', margin: '15px 0 0 0' }}>
              O reembolso foi calculado proporcionalmente conforme a legislação suíça de proteção ao consumidor.
            </p>
          </div>
        )}

        {/* Next Steps */}
        <div style={{ backgroundColor: '#F3F4F6', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#374151', margin: '0 0 15px 0' }}>🔄 E agora?</h3>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#6B7280', fontSize: '16px', marginRight: '10px' }}>📱</span>
              <strong style={{ color: '#374151' }}>Acompanhe seu extrato</strong>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 0 26px' }}>
              Verifique seu extrato bancário ou do cartão nos próximos dias.
            </p>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#6B7280', fontSize: '16px', marginRight: '10px' }}>💾</span>
              <strong style={{ color: '#374151' }}>Guarde este comprovante</strong>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 0 26px' }}>
              Este email serve como comprovante oficial do reembolso.
            </p>
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#6B7280', fontSize: '16px', marginRight: '10px' }}>🎭</span>
              <strong style={{ color: '#374151' }}>Volte quando quiser</strong>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 0 26px' }}>
              Você sempre será bem-vindo de volta ao DUO PASS Club!
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <p style={{ color: '#6B7280', marginBottom: '15px' }}>
            Sentiu falta das experiências culturais? Reative sua assinatura a qualquer momento.
          </p>
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
            Explorar DUO PASS
          </a>
        </div>

        {/* Legal Notice */}
        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
          <h4 style={{ color: '#1E40AF', margin: '0 0 10px 0', fontSize: '14px' }}>⚖️ Conformidade Legal</h4>
          <p style={{ color: '#1E3A8A', margin: '0', fontSize: '13px', lineHeight: '1.5' }}>
            Este reembolso está em conformidade com a legislação suíça de proteção ao consumidor e 
            regulamentações da União Europeia. Todos os dados da transação são mantidos seguros 
            conforme padrões PCI DSS e GDPR.
          </p>
        </div>

        {/* Support */}
        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 10px 0' }}>
            Dúvidas sobre o reembolso? Nossa equipe está aqui para ajudar!
          </p>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: '0' }}>
            📧 <a href="mailto:financeiro@duopass.ch" style={{ color: '#8B5CF6' }}>financeiro@duopass.ch</a> • 
            📱 WhatsApp: +41 XX XXX XX XX
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#F9FAFB', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#6B7280' }}>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>DUO PASS Club</strong> • Empresa Suíça • PCI DSS Compliant • GDPR Compliant
        </p>
        <p style={{ margin: '0 0 10px 0' }}>
          <a href="https://duopass.ch/termos-de-uso" style={{ color: '#8B5CF6', textDecoration: 'none' }}>Termos de Uso</a> • 
          <a href="https://duopass.ch/privacidade" style={{ color: '#8B5CF6', textDecoration: 'none' }}>Política de Privacidade</a> • 
          <a href="https://duopass.ch/cancelamento" style={{ color: '#8B5CF6', textDecoration: 'none' }}>Cancelamento</a>
        </p>
        <p style={{ margin: '0', fontSize: '11px' }}>
          Transação ID: {transactionId} • Processado em {refundDate}
        </p>
      </div>
    </div>
  );
};

export default ReembolsoProcessado;