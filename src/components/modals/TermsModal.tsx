import React, { useState, useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TermsModalProps {
  onAccept: () => void;
}

export default function TermsModal({ onAccept }: TermsModalProps) {
  const { t } = useContext(LanguageContext);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [commsAccepted, setCommsAccepted] = useState(false);

  const canProceed = termsAccepted && privacyAccepted;

  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleReject = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">TERMOS DE USO - DUO PASS</h2>
        <div className="space-y-4 text-sm text-gray-600 max-h-96 overflow-y-auto pr-2">  // Aumentei max-h para 96 para acomodar mais conteúdo
          <p>Última atualização: [DATA]</p>
          <p>Vigência: A partir da aceitação</p>
          
          <div>
            <h3 className="font-semibold">1. DEFINIÇÕES</h3>
            <p>Duo Pass: Plataforma digital que oferece vouchers e experiências culturais, gastronômicas e de lazer na Suíça.</p>
            <p>Usuário: Pessoa física que utiliza os serviços da plataforma.</p>
            <p>Golden Week: Período promocional de 7 dias com acesso a vouchers premium.</p>
            <p>Plano Freemium: Acesso gratuito limitado a 1 voucher por mês.</p>
            <p>Parceiros: Estabelecimentos e prestadores de serviços credenciados.</p>
          </div>
          
          <div>
            <h3 className="font-semibold">2. ACEITAÇÃO DOS TERMOS</h3>
            <p>Ao criar uma conta ou utilizar nossos serviços, você aceita integralmente estes termos. Se discordar de qualquer cláusula, não utilize a plataforma.</p>
          </div>
          
          <div>
            <h3 className="font-semibold">3. DESCRIÇÃO DOS SERVIÇOS</h3>
            <h4>3.1 Golden Week (Período de Teste Premium)</h4>
            <p>Duração: 7 dias corridos</p>
            <p>Acesso: 3-4 vouchers premium</p>
            <p>Experiências: Restaurantes top-tier e atividades exclusivas</p>
            <p>Ativação automática no primeiro acesso</p>
            
            <h4>3.2 Plano Freemium</h4>
            <p>Vouchers: 1 por mês calendário</p>
            <p>Categoria: Experiências mid-tier</p>
            <p>Validade: Conforme especificado em cada voucher</p>
            <p>Sem cobrança recorrente</p>
            
            <h4>3.3 Planos Pagos</h4>
            <p>Valores: CHF 9, 12 ou 18 mensais</p>
            <p>Benefícios: Vouchers adicionais + experiências premium</p>
            <p>Cobrança: Automática via cartão de crédito</p>
            <p>Cancelamento: A qualquer momento</p>
          </div>
          
          <div>
            <h3 className="font-semibold">4. CADASTRO E CONTA DE USUÁRIO</h3>
            <h4>4.1 Elegibilidade</h4>
            <p>Maior de 18 anos</p>
            <p>Residente na Suíça ou pessoa com endereço válido no país</p>
            <p>Informações verdadeiras e atualizadas</p>
            
            <h4>4.2 Responsabilidades do Usuário</h4>
            <p>Manter dados atualizados</p>
            <p>Não compartilhar credenciais de acesso</p>
            <p>Usar vouchers pessoalmente (salvo vouchers 2-por-1)</p>
            <p>Notificar imediatamente sobre uso não autorizado</p>
          </div>
          
          <div>
            <h3 className="font-semibold">5. VOUCHERS E EXPERIÊNCIAS</h3>
            <h4>5.1 Utilização</h4>
            <p>Vouchers têm data de validade específica</p>
            <p>Necessário agendamento prévio com o parceiro</p>
            <p>Sujeito à disponibilidade do estabelecimento</p>
            <p>Não cumulativo com outras promoções (salvo indicação contrária)</p>
            
            <h4>5.2 Limitações</h4>
            <p>1 voucher por pessoa por estabelecimento por mês (salvo especificação)</p>
            <p>Não transferível entre usuários</p>
            <p>Não conversível em dinheiro</p>
            <p>Válido apenas no estabelecimento indicado</p>
            
            <h4>5.3 Cancelamentos pelo Parceiro</h4>
            <p>Parceiros podem cancelar vouchers por motivos operacionais</p>
            <p>Usuário será notificado com 24h de antecedência (quando possível)</p>
            <p>Voucher será reemitido ou valor creditado</p>
          </div>
          
          <div>
            <h3 className="font-semibold">6. PAGAMENTOS E CANCELAMENTOS</h3>
            <h4>6.1 Cobrança</h4>
            <p>Planos pagos: cobrança mensal automática</p>
            <p>Cartões aceitos: Visa, Mastercard, PostFinance</p>
            <p>Moeda: Franco Suíço (CHF)</p>
            <p>Falha no pagamento: suspensão do serviço após 7 dias</p>
            
            <h4>6.2 Cancelamento</h4>
            <p>Possível a qualquer momento via app/website</p>
            <p>Efetivo ao final do período já pago</p>
            <p>Vouchers não utilizados expiram com o cancelamento</p>
            <p>Sem multa de cancelamento</p>
            
            <h4>6.3 Reembolsos</h4>
            <p>Golden Week: sem reembolso (período promocional)</p>
            <p>Planos pagos: reembolso proporcional em caso de cancelamento pela empresa</p>
            <p>Vouchers defeituosos: reemissão ou crédito</p>
          </div>
          
          <div>
            <h3 className="font-semibold">7. RESPONSABILIDADES E LIMITAÇÕES</h3>
            <h4>7.1 Duo Pass</h4>
            <p>Intermediação entre usuário e parceiros</p>
            <p>Manutenção da plataforma tecnológica</p>
            <p>Atendimento ao cliente</p>
            <p>Não responsável por qualidade dos serviços dos parceiros</p>
            
            <h4>7.2 Limitação de Responsabilidade</h4>
            <p>Responsabilidade limitada ao valor pago pelo usuário</p>
            <p>Não responsável por danos indiretos ou lucros cessantes</p>
            <p>Parceiros respondem pela qualidade de seus serviços</p>
            <p>Força maior exime responsabilidade</p>
            
            <h4>7.3 Disponibilidade</h4>
            <p>Serviço sujeito a manutenções programadas</p>
            <p>Indisponibilidade temporária não gera direito a compensação</p>
            <p>Esforços para manter 99% de uptime</p>
          </div>
          
          <div>
            <h3 className="font-semibold">8. PROPRIEDADE INTELECTUAL</h3>
            <p>Todos os direitos sobre marcas, logotipos, design e conteúdo da plataforma pertencem ao Duo Pass. Uso não autorizado é proibido.</p>
          </div>
          
          <div>
            <h3 className="font-semibold">9. PRIVACIDADE E DADOS</h3>
            <h4>9.1 Coleta de Dados</h4>
            <p>Dados pessoais: nome, email, telefone, endereço</p>
            <p>Dados de uso: vouchers utilizados, preferências</p>
            <p>Dados de pagamento: processados por terceiros certificados</p>
            
            <h4>9.2 Uso dos Dados</h4>
            <p>Prestação do serviço</p>
            <p>Comunicação sobre ofertas</p>
            <p>Análises estatísticas (dados anonimizados)</p>
            <p>Compartilhamento com parceiros para prestação do serviço</p>
            
            <h4>9.3 Direitos do Usuário</h4>
            <p>Acesso aos dados pessoais</p>
            <p>Correção de informações incorretas</p>
            <p>Exclusão de dados (direito ao esquecimento)</p>
            <p>Portabilidade de dados</p>
          </div>
          
          <div>
            <h3 className="font-semibold">10. MODIFICAÇÕES</h3>
            <h4>10.1 Alterações nos Termos</h4>
            <p>Duo Pass pode alterar estes termos a qualquer momento</p>
            <p>Usuários serão notificados com 30 dias de antecedência</p>
            <p>Continuidade do uso implica aceitação das alterações</p>
            <p>Discordância: direito de cancelamento sem ônus</p>
            
            <h4>10.2 Alterações no Serviço</h4>
            <p>Funcionalidades podem ser modificadas ou descontinuadas</p>
            <p>Novos serviços podem ser adicionados</p>
            <p>Parceiros podem ser incluídos ou removidos</p>
          </div>
          
          <div>
            <h3 className="font-semibold">11. RESCISÃO</h3>
            <h4>11.1 Pelo Usuário</h4>
            <p>Cancelamento a qualquer momento</p>
            <p>Encerramento da conta via solicitação</p>
            
            <h4>11.2 Pelo Duo Pass</h4>
            <p>Violação destes termos</p>
            <p>Uso fraudulento ou abusivo</p>
            <p>Informações falsas no cadastro</p>
            <p>Notificação prévia de 15 dias (quando possível)</p>
          </div>
          
          <div>
            <h3 className="font-semibold">12. DISPOSIÇÕES GERAIS</h3>
            <h4>12.1 Lei Aplicável</h4>
            <p>Legislação suíça</p>
            <p>Foro: Tribunal competente na Suíça</p>
            
            <h4>12.2 Independência das Cláusulas</h4>
            <p>Invalidade de uma cláusula não afeta as demais</p>
            <p>Interpretação de boa-fé</p>
            
            <h4>12.3 Comunicações</h4>
            <p>Email: [email de contato]</p>
            <p>Endereço: [endereço da empresa]</p>
            <p>Telefone: [telefone de contato]</p>
          </div>
          
          <div>
            <h3 className="font-semibold">13. CONTATO E SUPORTE</h3>
            <p>Atendimento ao Cliente:</p>
            <p>Email: suporte@duopass.ch</p>
            <p>Horário: Segunda a sexta, 9h às 18h</p>
            <p>Idiomas: Alemão, Francês, Italiano</p>
            <p>Emergências com Vouchers:</p>
            <p>WhatsApp: [número]</p>
            <p>Disponível 7 dias por semana</p>
            <p>Ao utilizar o Duo Pass, você confirma ter lido, compreendido e aceito todos os termos acima.</p>
          </div>
        </div>
        <div className="space-y-4 mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mr-2"
            />
            Aceito os Termos de Uso
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mr-2"
            />
            Aceito a Política de Privacidade
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={commsAccepted}
              onChange={(e) => setCommsAccepted(e.target.checked)}
              className="mr-2"
            />
            Aceito comunicações de marketing
          </label>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleReject}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Rejeitar
          </button>
          <button
            onClick={onAccept}
            disabled={!canProceed}
            className={`px-4 py-2 rounded text-white ${canProceed ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}