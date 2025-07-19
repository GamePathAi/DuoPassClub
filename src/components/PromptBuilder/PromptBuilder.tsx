import React, { useState } from 'react';
import { AlertTriangle, Clock, Lightbulb, CheckCircle, XCircle, Search, Code, TestTube } from 'lucide-react';

interface AnalysisResult {
  pressupostos: string[];
  limitacoes: string[];
  prioridades: string[];
  solucaoRapida: {
    tempo: string;
    implementacao: string;
    codigo: string;
  };
  solucaoIntermediaria: {
    tempo: string;
    implementacao: string;
    codigo: string;
  };
  solucaoCompleta: {
    tempo: string;
    implementacao: string;
    codigo: string;
  };
  autocritica: {
    ondeErrar: string[];
    verificacoes: string[];
    vieses: string[];
  };
  recursos: {
    fontes: string[];
    ferramentas: string[];
  };
}

const PromptBuilder: React.FC = () => {
  const [problema, setProblema] = useState('');
  const [contexto, setContexto] = useState('');
  const [urgencia, setUrgencia] = useState('2-4 horas');
  const [analise, setAnalise] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analisarProblema = () => {
    setLoading(true);
    
    // Simulação de análise inteligente
    setTimeout(() => {
      const resultado: AnalysisResult = {
        pressupostos: [
          'Ambiente React/TypeScript já configurado',
          'Supabase como backend principal',
          'Foco em impacto visual para demo',
          'Dados mock são aceitáveis temporariamente',
          'Prioridade: funcionalidade > escalabilidade'
        ],
        limitacoes: [
          'Configurações de produção não fornecidas',
          'Requisitos específicos dos investidores desconhecidos',
          'Infraestrutura AWS parcialmente configurada',
          'Dados reais de usuários limitados'
        ],
        prioridades: [
          'Interface limpa e responsiva',
          'Navegação funcional sem erros',
          'Feedback visual imediato',
          'Fallbacks para APIs indisponíveis'
        ],
        solucaoRapida: {
          tempo: '15-30 minutos',
          implementacao: 'Componente com dados mock + CSS básico',
          codigo: `// Solução Rápida - Mock Component\nconst QuickSolution = () => {\n  const mockData = { /* dados simulados */ };\n  return (\n    <div className="p-4 bg-white rounded-lg shadow">\n      <h2>Demo Component</h2>\n      {/* Interface básica funcional */}\n    </div>\n  );\n};`
        },
        solucaoIntermediaria: {
          tempo: '1-2 horas',
          implementacao: 'Integração com Supabase + tratamento de erros',
          codigo: `// Solução Intermediária - Com integração\nconst IntermediateSolution = () => {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(false);\n  \n  useEffect(() => {\n    // Buscar dados reais com fallback\n  }, []);\n  \n  return (\n    <div>\n      {loading ? <Spinner /> : <DataDisplay data={data} />}\n    </div>\n  );\n};`
        },
        solucaoCompleta: {
          tempo: 'Pós-demo (1-2 dias)',
          implementacao: 'Arquitetura escalável + testes + otimizações',
          codigo: `// Solução Completa - Produção\nconst CompleteSolution = () => {\n  // Implementação robusta\n  // Testes automatizados\n  // Performance otimizada\n  // Segurança validada\n};`
        },
        autocritica: {
          ondeErrar: [
            'Assumir que visual sempre supera funcionalidade',
            'Subestimar complexidade de integrações',
            'Não considerar limitações de tempo real'
          ],
          verificacoes: [
            'Testar em diferentes navegadores',
            'Verificar responsividade mobile',
            'Validar fluxos críticos de usuário',
            'Confirmar que fallbacks funcionam'
          ],
          vieses: [
            'Tendência a soluções técnicas complexas',
            'Experiência prévia pode influenciar escolhas',
            'Pressuposição de conhecimento técnico do usuário'
          ]
        },
        recursos: {
          fontes: [
            'React Documentation',
            'Supabase Docs',
            'Tailwind CSS Guide',
            'OpenAI API Reference'
          ],
          ferramentas: [
            'React DevTools',
            'Console do navegador',
            'JSON Generator para mocks',
            'Lighthouse para performance'
          ]
        }
      };
      
      setAnalise(resultado);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-800">🚀 Prompt Builder Inteligente</h1>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            Demo para Investidores
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descreva o problema técnico:
            </label>
            <textarea
              value={problema}
              onChange={(e) => setProblema(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Ex: Botão Analytics redireciona para Home em vez da página específica..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contexto adicional:
            </label>
            <textarea
              value={contexto}
              onChange={(e) => setContexto(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Ex: Demo em 2 horas, investidores vão testar navegação..."
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-medium text-gray-700">Urgência:</label>
          <select
            value={urgencia}
            onChange={(e) => setUrgencia(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="15-30 min">15-30 minutos</option>
            <option value="1-2 horas">1-2 horas</option>
            <option value="2-4 horas">2-4 horas</option>
            <option value="1 dia">1 dia</option>
          </select>
        </div>
        
        <button
          onClick={analisarProblema}
          disabled={!problema.trim() || loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analisando problema...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Analisar Problema
            </div>
          )}
        </button>
      </div>

      {analise && (
        <div className="space-y-6">
          {/* Análise Inicial */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🔍 Análise Inicial
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Pressupostos
                </h3>
                <ul className="space-y-2">
                  {analise.pressupostos.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Limitações
                </h3>
                <ul className="space-y-2">
                  {analise.limitacoes.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  Prioridades Demo
                </h3>
                <ul className="space-y-2">
                  {analise.prioridades.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Soluções Múltiplas */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              💡 Soluções Múltiplas
            </h2>
            
            <div className="grid gap-6">
              {/* Solução Rápida */}
              <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">🔧 Solução Rápida ({analise.solucaoRapida.tempo})</h3>
                </div>
                <p className="text-green-700 mb-3">{analise.solucaoRapida.implementacao}</p>
                <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                  <pre className="text-green-400 text-sm">{analise.solucaoRapida.codigo}</pre>
                </div>
              </div>
              
              {/* Solução Intermediária */}
              <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">⚡ Solução Intermediária ({analise.solucaoIntermediaria.tempo})</h3>
                </div>
                <p className="text-blue-700 mb-3">{analise.solucaoIntermediaria.implementacao}</p>
                <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                  <pre className="text-blue-400 text-sm">{analise.solucaoIntermediaria.codigo}</pre>
                </div>
              </div>
              
              {/* Solução Completa */}
              <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">🏗️ Solução Completa ({analise.solucaoCompleta.tempo})</h3>
                </div>
                <p className="text-purple-700 mb-3">{analise.solucaoCompleta.implementacao}</p>
                <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                  <pre className="text-purple-400 text-sm">{analise.solucaoCompleta.codigo}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* Autocrítica */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🤔 Autocrítica Obrigatória
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  Onde Posso Estar Errado
                </h3>
                <ul className="space-y-2">
                  {analise.autocritica.ondeErrar.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-orange-500" />
                  Verificações Necessárias
                </h3>
                <ul className="space-y-2">
                  {analise.autocritica.verificacoes.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-purple-500" />
                  Vieses Identificados
                </h3>
                <ul className="space-y-2">
                  {analise.autocritica.vieses.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recursos Externos */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📚 Recursos Externos
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Search className="w-5 h-5 text-green-500" />
                  Fontes para Verificar
                </h3>
                <ul className="space-y-2">
                  {analise.recursos.fontes.map((item, index) => (
                    <li key={index} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-500" />
                  Ferramentas Recomendadas
                </h3>
                <ul className="space-y-2">
                  {analise.recursos.ferramentas.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Resumo Executivo */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              🎯 Resumo Executivo (Para Investidores)
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Problema Identificado</h3>
                <p className="text-sm opacity-90">
                  {problema.split('.')[0] || 'Problema técnico na aplicação'}
                </p>
              </div>
              
              <div className="bg-white/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Solução Escolhida</h3>
                <p className="text-sm opacity-90">
                  Implementação rápida com dados mock + integração gradual
                </p>
              </div>
              
              <div className="bg-white/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Tempo Estimado</h3>
                <p className="text-sm opacity-90">
                  {urgencia} para solução funcional
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white/10 rounded-lg">
              <h3 className="font-semibold mb-2">⚠️ Alertas Importantes:</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Solução rápida pode ter limitações em edge cases</li>
                <li>• Refatoração necessária após demo para produção</li>
                <li>• Dados mock devem ser substituídos por dados reais</li>
                <li>• Monitoramento de performance durante apresentação</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptBuilder;